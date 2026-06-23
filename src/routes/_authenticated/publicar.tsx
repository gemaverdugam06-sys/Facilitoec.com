import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";
import { z } from "zod";

interface Categoria {
  id: string;
  nombre: string;
}

const schema = z.object({
  titulo: z.string().trim().min(3, "Mínimo 3 caracteres").max(120),
  descripcion: z.string().trim().min(10, "Describe mejor tu producto").max(2000),
  precio: z.number().nonnegative().max(9999999),
  categoria_id: z.string().min(1),
  ciudad: z.string().trim().min(2).max(80),
  estado: z.enum(["nuevo", "usado"]),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
});

export const Route = createFileRoute("/_authenticated/publicar")({
  component: PublicarPage,
});

function PublicarPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState<"nuevo" | "usado">("nuevo");
  const [whatsapp, setWhatsapp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("categorias")
      .select("id, nombre")
      .order("orden")
      .then(({ data }) => {
        if (data) setCategorias(data);
      });
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 8 - files.length);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setPreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(f);
    });
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (files.length === 0) {
      toast.error("Agrega al menos una foto");
      return;
    }

    const parsed = schema.safeParse({
      titulo,
      descripcion,
      precio: parseFloat(precio || "0"),
      categoria_id: categoriaId,
      ciudad,
      estado,
      whatsapp,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const uploadedPaths: string[] = [];
    for (const f of files) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("productos").upload(path, f, {
        cacheControl: "3600",
        upsert: false,
        contentType: f.type,
      });
      if (error) {
        toast.error(toUserMessage(error, "Error al subir la imagen. Intenta de nuevo."));
        setLoading(false);
        return;
      }
      uploadedPaths.push(path);
    }

    const { data, error } = await supabase
      .from("productos")
      .insert({
        user_id: user.id,
        titulo: parsed.data.titulo,
        descripcion: parsed.data.descripcion,
        precio: parsed.data.precio,
        categoria_id: parsed.data.categoria_id,
        ciudad: parsed.data.ciudad,
        estado: parsed.data.estado,
        whatsapp: parsed.data.whatsapp || null,
        imagenes: uploadedPaths,
      })
      .select("id")
      .single();

    setLoading(false);
    if (error) {
      toast.error(toUserMessage(error, "No se pudo publicar el anuncio. Intenta de nuevo."));
      return;
    }
    toast.success("¡Anuncio publicado!");
    nav({ to: "/producto/$id", params: { id: data.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("publish_ad")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1">
                <Label>{t("images")}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {files.length < 8 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground hover:bg-accent">
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-xs">{t("add_images")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="titulo">{t("title")}</Label>
                <Input
                  id="titulo"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  maxLength={120}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="desc">{t("description")}</Label>
                <Textarea
                  id="desc"
                  required
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  maxLength={2000}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="precio">{t("price")} (USD)</Label>
                  <Input
                    id="precio"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("condition")}</Label>
                  <Select value={estado} onValueChange={(v) => setEstado(v as "nuevo" | "usado")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">{t("new_item")}</SelectItem>
                      <SelectItem value="usado">{t("used_item")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label>{t("category")}</Label>
                <Select value={categoriaId} onValueChange={setCategoriaId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ciudad">{t("city")}</Label>
                  <Input
                    id="ciudad"
                    required
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wa">{t("phone")}</Label>
                  <Input
                    id="wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+593..."
                    maxLength={20}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("publishing")}
                  </>
                ) : (
                  t("publish_ad")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
