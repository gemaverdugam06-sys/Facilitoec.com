import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/auth/recuperar")({
  head: () => ({
    meta: [{ title: "Recuperar contraseña — WINFAST" }, { name: "robots", content: "noindex" }],
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
    if (error) {
      const status = "status" in error ? Number(error.status) : 0;
      const fallback =
        status >= 500 || String(error.message ?? "") === "{}"
          ? "Supabase no pudo enviar el correo. Verifica el proveedor de correo de Supabase y que esta URL de Vercel esté permitida en Authentication > URL Configuration."
          : "No se pudo enviar el enlace de recuperación.";
      toast.error(
        status >= 500 || String(error.message ?? "") === "{}"
          ? fallback
          : toUserMessage(error, fallback),
      );
      return;
    }
    setSent(true);
    toast.success(t("reset_email_sent"));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_35%),linear-gradient(180deg,_#7c3aed_0%,_#3b82f6_100%)] p-4 text-white">
      <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(124,58,237,0.15)]">
        <CardHeader className="space-y-4 border-b border-slate-700/80 bg-gradient-primary/90 px-8 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white shadow-lg shadow-purple-500/20">
            <Logo className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-white">
            {t("forgot_password")}
          </CardTitle>
          <CardDescription className="text-sm text-slate-200">
            {t("forgot_password_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-8">
          {sent ? (
            <div className="space-y-4 text-center text-sm text-slate-300">
              <p>{t("reset_email_sent")}</p>
              <p>{t("check_spam")}</p>
              <Button
                variant="outline"
                className="w-full rounded-2xl border-slate-600 bg-slate-900 text-white"
                onClick={() => nav({ to: "/auth" })}
              >
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
                  className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-primary/70"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-primary/80 bg-gradient-primary/95 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_reset_link")}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-xs text-slate-400">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1 text-slate-300 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> {t("back_to_sign_in")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
