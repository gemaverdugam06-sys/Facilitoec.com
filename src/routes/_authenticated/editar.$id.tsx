import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/_authenticated/editar/$id")({
  component: EditarPage,
});

function EditarPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const nav = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("productos")
      .select("titulo, descripcion, precio, ciudad, whatsapp")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setTitulo(data.titulo);
          setDescripcion(data.descripcion);
          setPrecio(String(data.precio));
          setCiudad(data.ciudad);
          setWhatsapp(data.whatsapp ?? "");
        }
        setLoading(false);
      });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("productos")
      .update({
        titulo,
        descripcion,
        precio: parseFloat(precio),
        ciudad,
        whatsapp: whatsapp || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo guardar el anuncio."));
    toast.success(t("saved"));
    nav({ to: "/mis-publicaciones" });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("edit")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1">
                <Label>{t("title")}</Label>
                <Input required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("description")}</Label>
                <Textarea
                  required
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>{t("price")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("city")}</Label>
                  <Input required value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>{t("phone")}</Label>
                <Input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-gradient-primary">
                {saving ? <Loader2 className="animate-spin h-4 w-4" /> : t("save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
