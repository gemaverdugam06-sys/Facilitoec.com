import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/auth/recuperar")({
  head: () => ({
    meta: [{ title: "Recuperar contraseña — FACILITOEC" }, { name: "robots", content: "noindex" }],
  }),
  component: RecuperarPage,
});

function RecuperarPage() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/nueva-contrasena`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo enviar el enlace de recuperación."));
    setSent(true);
    toast.success(t("reset_email_sent"));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">{t("forgot_password")}</CardTitle>
          <CardDescription>{t("forgot_password_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center text-sm text-muted-foreground">
              <p>{t("reset_email_sent")}</p>
              <p>{t("check_spam")}</p>
              <Button variant="outline" className="w-full" onClick={() => nav({ to: "/auth" })}>
                {t("back_to_sign_in")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email-reset">{t("email")}</Label>
                <Input
                  id="email-reset"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_reset_link")}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/auth" className="inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-3 w-3" /> {t("back_to_sign_in")}
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("phone_recovery_hint")}{" "}
            <Link to="/auth" className="underline">
              {t("sign_in_with_phone")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
