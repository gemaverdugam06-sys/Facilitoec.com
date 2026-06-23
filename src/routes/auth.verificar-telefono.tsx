import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { isUserVerified, linkPhoneToAccount, toE164Phone, verifyPhoneLink } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OtpInput } from "@/components/auth/OtpInput";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

export const Route = createFileRoute("/auth/verificar-telefono")({
  head: () => ({
    meta: [{ title: "Verificar celular — FACILITOEC" }, { name: "robots", content: "noindex" }],
  }),
  component: VerificarTelefonoPage,
});

function VerificarTelefonoPage() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneE164, setPhoneE164] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/auth", replace: true });
    if (user && isUserVerified(user)) nav({ to: "/", replace: true });
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const tmr = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(tmr);
  }, [cooldown]);

  const sendOtp = async () => {
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));

    setLoading(true);
    const { error } = await linkPhoneToAccount(phone);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo enviar el código SMS."));

    setPhoneE164(phone);
    setStep("otp");
    setCooldown(60);
    toast.success(t("otp_sent"));
  };

  const verifyOtp = async () => {
    if (!phoneE164 || otp.length < 6) return toast.error(t("enter_6_digit_code"));

    setLoading(true);
    const { error } = await verifyPhoneLink(phoneE164, otp);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "Código incorrecto o expirado."));

    toast.success(t("phone_verified"));
    nav({ to: "/", replace: true });
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">{t("verify_phone_title")}</CardTitle>
          <CardDescription>{t("verify_phone_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="phone-verify">{t("mobile_number")}</Label>
                <Input
                  id="phone-verify"
                  type="tel"
                  required
                  placeholder="0991234567"
                  value={phoneRaw}
                  onChange={(e) => setPhoneRaw(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">{t("phone_format_hint")}</p>
              </div>
              <Button
                type="button"
                disabled={loading}
                className="w-full bg-gradient-primary"
                onClick={sendOtp}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_sms_code")}
              </Button>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                {t("otp_sent_to")} <strong>{phoneE164}</strong>
              </p>
              <div className="flex justify-center">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </div>
              <Button
                type="button"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-primary"
                onClick={verifyOtp}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("verify_code")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                disabled={loading || cooldown > 0}
                onClick={sendOtp}
              >
                {cooldown > 0 ? `${t("resend_code")} (${cooldown}s)` : t("resend_code")}
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="w-full"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
              >
                {t("change_phone")}
              </Button>
            </>
          )}
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">
              {t("skip_for_now")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
