import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useSignedUrl } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarUrl = useSignedUrl("avatars", avatarPath);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nombre_completo, ciudad, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setNombre(data.nombre_completo ?? "");
          setCiudad(data.ciudad ?? "");
          setAvatarPath(data.avatar_url ?? null);
        }
      });
    supabase
      .from("profiles_private")
      .select("telefono")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setTelefono(data.telefono ?? "");
      });
  }, [user?.id]);

  const onUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type });
    if (upErr) {
      setUploading(false);
      return toast.error(toUserMessage(upErr, "No se pudo subir la foto."));
    }
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", user.id);
    setUploading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo guardar el avatar."));
    setAvatarPath(path);
    toast.success(t("saved"));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nombre_completo: nombre,
        ciudad,
      })
      .eq("id", user.id);
    const { error: pErr } = await supabase
      .from("profiles_private")
      .upsert({ id: user.id, telefono });
    setSaving(false);
    if (error || pErr)
      return toast.error(toUserMessage(error ?? pErr, "No se pudo actualizar el perfil."));
    toast.success(t("profile_updated"));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-2xl">{nombre[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:opacity-90">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1">
                <Label>{t("full_name")}</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-1">
                <Label>{t("city")}</Label>
                <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} maxLength={80} />
              </div>
              <div className="space-y-1">
                <Label>{t("phone")}</Label>
                <Input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  maxLength={20}
                  placeholder="+593..."
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-gradient-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("update_profile")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
