import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useI18n, a as useAuth, i as isUserVerified, b as toE164Phone, l as linkPhoneToAccount, t as toUserMessage, e as verifyPhoneLink } from "./router-CStixWKO.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { O as OtpInput } from "./OtpInput-B5cgdUUj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/input-otp.mjs";
import { L as LoaderCircle, o as ShoppingBag } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-Bvdk7TO_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function VerificarTelefonoPage() {
  const {
    t
  } = useI18n();
  const {
    user,
    loading: authLoading
  } = useAuth();
  const nav = useNavigate();
  const [phoneRaw, setPhoneRaw] = reactExports.useState("");
  const [phoneE164, setPhoneE164] = reactExports.useState(null);
  const [otp, setOtp] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("phone");
  const [loading, setLoading] = reactExports.useState(false);
  const [cooldown, setCooldown] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!authLoading && !user) nav({
      to: "/auth",
      replace: true
    });
    if (user && isUserVerified(user)) nav({
      to: "/",
      replace: true
    });
  }, [user, authLoading, nav]);
  reactExports.useEffect(() => {
    if (cooldown <= 0) return;
    const tmr = setTimeout(() => setCooldown((c) => c - 1), 1e3);
    return () => clearTimeout(tmr);
  }, [cooldown]);
  const sendOtp = async () => {
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));
    setLoading(true);
    const {
      error
    } = await linkPhoneToAccount(phone);
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
    const {
      error
    } = await verifyPhoneLink(phoneE164, otp);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "Código incorrecto o expirado."));
    toast.success(t("phone_verified"));
    nav({
      to: "/",
      replace: true
    });
  };
  if (authLoading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-primary p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-7 w-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: t("verify_phone_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: t("verify_phone_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      step === "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone-verify", children: t("mobile_number") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone-verify", type: "tel", required: true, placeholder: "0991234567", value: phoneRaw, onChange: (e) => setPhoneRaw(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: t("phone_format_hint") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", disabled: loading, className: "w-full bg-gradient-primary", onClick: sendOtp, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("send_sms_code") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
          t("otp_sent_to"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: phoneE164 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OtpInput, { value: otp, onChange: setOtp, disabled: loading }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", disabled: loading || otp.length < 6, className: "w-full bg-gradient-primary", onClick: verifyOtp, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("verify_code") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "w-full", disabled: loading || cooldown > 0, onClick: sendOtp, children: cooldown > 0 ? `${t("resend_code")} (${cooldown}s)` : t("resend_code") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "link", size: "sm", className: "w-full", onClick: () => {
          setStep("phone");
          setOtp("");
        }, children: t("change_phone") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:underline", children: t("skip_for_now") }) })
    ] })
  ] }) });
}
export {
  VerificarTelefonoPage as component
};
