import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  isUserVerified,
  linkPhoneToAccount,
  sendPhoneOtp,
  toE164Phone,
  verifyPhoneOtp,
} from "@/lib/auth-utils";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OtpInput } from "@/components/auth/OtpInput";
import { ShoppingBag, Loader2, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Iniciar sesión — FACILITOEC" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();

  const [method, setMethod] = useState<"email" | "phone">("email");
  const [emailTab, setEmailTab] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");

  const [phoneE164, setPhoneE164] = useState<string | null>(null);
  const [phoneStep, setPhoneStep] = useState<"input" | "otp">("input");
  const [otp, setOtp] = useState("");
  const [phoneSignupName, setPhoneSignupName] = useState("");

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user) {
      if (isUserVerified(user)) nav({ to: "/", replace: true });
      else nav({ to: "/auth/verificar-telefono", replace: true });
    }
  }, [user, nav]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const tmr = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(tmr);
  }, [cooldown]);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/verificar-telefono`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(toUserMessage(error, "No se pudo iniciar sesión con Google."));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error(t("password_min_8"));
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo iniciar sesión."));
    toast.success(t("welcome_back"));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error(t("name_required"));
    if (password.length < 8) return toast.error(t("password_min_8"));
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verificar-telefono`,
        data: { full_name: name.trim() },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error(toUserMessage(error, "No se pudo crear la cuenta."));
    }

    if (data.session) {
      const linkErr = await linkPhoneToAccount(phone);
      setLoading(false);
      if (linkErr.error)
        return toast.error(toUserMessage(linkErr.error, "No se pudo vincular el teléfono."));
      toast.success(t("otp_sent"));
      nav({ to: "/auth/verificar-telefono", replace: true });
      return;
    }

    setLoading(false);
    toast.success(t("signup_check_email_then_phone"));
    nav({ to: "/auth/verificar-telefono" });
  };

  const sendPhoneCode = async () => {
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));

    setLoading(true);
    const { error } = await sendPhoneOtp(phone);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo enviar el código SMS."));

    setPhoneE164(phone);
    setPhoneStep("otp");
    setCooldown(60);
    toast.success(t("otp_sent"));
  };

  const verifyPhoneCode = async () => {
    if (!phoneE164 || otp.length < 6) return toast.error(t("enter_6_digit_code"));

    setLoading(true);
    const { data, error } = await verifyPhoneOtp(phoneE164, otp);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "Código incorrecto o expirado."));

    if (phoneSignupName.trim().length >= 2 && data.user) {
      await supabase
        .from("profiles")
        .update({ nombre_completo: phoneSignupName.trim() })
        .eq("id", data.user.id);
    }

    toast.success(t("phone_verified"));
    nav({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_35%),linear-gradient(180deg,_#7c3aed_0%,_#3b82f6_100%)] p-4 text-white">
      <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(124,58,237,0.15)]">
        <CardHeader className="space-y-4 border-b border-slate-700/80 px-8 py-8 text-center bg-gradient-primary/90">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white shadow-lg shadow-purple-500/20">
            <Logo className="h-10 w-10" />
          </div>
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-semibold tracking-tight text-white">
            <span>FACILITOEC</span>
          </CardTitle>
          <CardDescription className="text-sm text-slate-200">
            {t("tagline")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-8">
          <Tabs value={method} onValueChange={(v) => setMethod(v as "email" | "phone")}> 
            <TabsList className="grid w-full grid-cols-2 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-sm">
              <TabsTrigger
                value="email"
                className="gap-1 border-r border-slate-700/80 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
              >
                <Mail className="h-4 w-4" /> {t("with_email")}
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="gap-1 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
              >
                <Smartphone className="h-4 w-4" /> {t("with_phone")}
              </TabsTrigger>
            </TabsList>

            {/* ── Correo ── */}
            <TabsContent value="email">
              <Tabs value={emailTab} onValueChange={(v) => setEmailTab(v as "signin" | "signup")}>
                <TabsList className="mt-2 grid w-full grid-cols-2 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-sm">
                  <TabsTrigger
                    value="signin"
                    className="border-r border-slate-700/80 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    {t("sign_in")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    {t("sign_up")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-3 pt-3">
                    <div className="space-y-1">
                      <Label htmlFor="email-in">{t("email")}</Label>
                      <Input
                        id="email-in"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pwd-in">{t("password")}</Label>
                        <Link to="/auth/recuperar" className="text-xs text-primary hover:underline">
                          {t("forgot_password")}
                        </Link>
                      </div>
                      <Input
                        id="pwd-in"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("sign_in")}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-3 pt-3">
                    <div className="space-y-1">
                      <Label htmlFor="name-up">{t("full_name")}</Label>
                      <Input
                        id="name-up"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email-up">{t("email")}</Label>
                      <Input
                        id="email-up"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone-up">{t("mobile_number")}</Label>
                      <Input
                        id="phone-up"
                        type="tel"
                        required
                        placeholder="0991234567"
                        value={phoneRaw}
                        onChange={(e) => setPhoneRaw(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {t("phone_verify_on_signup")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pwd-up">{t("password")}</Label>
                      <Input
                        id="pwd-up"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("sign_up")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* ── Teléfono (SMS) ── */}
            <TabsContent value="phone">
              {phoneStep === "input" ? (
                <div className="space-y-3 pt-3">
                  <div className="space-y-1">
                    <Label htmlFor="phone-in">{t("mobile_number")}</Label>
                    <Input
                      id="phone-in"
                      type="tel"
                      required
                      placeholder="0991234567"
                      value={phoneRaw}
                      onChange={(e) => setPhoneRaw(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                    />
                    <p className="text-[11px] text-slate-400">{t("phone_format_hint")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="name-phone">{t("full_name")}</Label>
                    <Input
                      id="name-phone"
                      placeholder={t("optional_on_login")}
                      value={phoneSignupName}
                      onChange={(e) => setPhoneSignupName(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary"
                    onClick={sendPhoneCode}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_sms_code")}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    {t("phone_login_hint")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-3">
                  <p className="text-center text-sm text-muted-foreground">
                    {t("otp_sent_to")} <strong>{phoneE164}</strong>
                  </p>
                  <div className="flex justify-center">
                    <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                  </div>
                  <Button
                    type="button"
                    disabled={loading || otp.length < 6}
                    className="w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary"
                    onClick={verifyPhoneCode}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("verify_and_enter")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    disabled={loading || cooldown > 0}
                    onClick={sendPhoneCode}
                  >
                    {cooldown > 0 ? `${t("resend_code")} (${cooldown}s)` : t("resend_code")}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setPhoneStep("input");
                      setOtp("");
                    }}
                  >
                    {t("change_phone")}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> {t("or")}{" "}
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-100 hover:bg-slate-900"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("google_sign_in")}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">
              ← {t("back_home")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
