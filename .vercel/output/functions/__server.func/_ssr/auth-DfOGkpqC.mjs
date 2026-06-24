import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { u as useI18n, a as useAuth, i as isUserVerified, t as toUserMessage, b as toE164Phone, l as linkPhoneToAccount, s as sendPhoneOtp, v as verifyPhoneOtp } from "./router-CStixWKO.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { L as Logo } from "./Logo-Dar0Ngh0.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { O as OtpInput } from "./OtpInput-B5cgdUUj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/input-otp.mjs";
import { M as Mail, S as Smartphone, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function AuthPage() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [method, setMethod] = reactExports.useState("email");
  const [emailTab, setEmailTab] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [phoneRaw, setPhoneRaw] = reactExports.useState("");
  const [phoneE164, setPhoneE164] = reactExports.useState(null);
  const [phoneStep, setPhoneStep] = reactExports.useState("input");
  const [otp, setOtp] = reactExports.useState("");
  const [phoneSignupName, setPhoneSignupName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [cooldown, setCooldown] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (user) {
      if (isUserVerified(user)) nav({
        to: "/",
        replace: true
      });
      else nav({
        to: "/auth/verificar-telefono",
        replace: true
      });
    }
  }, [user, nav]);
  reactExports.useEffect(() => {
    if (cooldown <= 0) return;
    const tmr = setTimeout(() => setCooldown((c) => c - 1), 1e3);
    return () => clearTimeout(tmr);
  }, [cooldown]);
  const handleGoogle = async () => {
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/verificar-telefono`
      }
    });
    setLoading(false);
    if (error) {
      toast.error(toUserMessage(error, "No se pudo iniciar sesión con Google."));
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error(t("password_min_8"));
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo iniciar sesión."));
    toast.success(t("welcome_back"));
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error(t("name_required"));
    if (password.length < 8) return toast.error(t("password_min_8"));
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));
    setLoading(true);
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verificar-telefono`,
        data: {
          full_name: name.trim()
        }
      }
    });
    if (error) {
      setLoading(false);
      return toast.error(toUserMessage(error, "No se pudo crear la cuenta."));
    }
    if (data.session) {
      const linkErr = await linkPhoneToAccount(phone);
      setLoading(false);
      if (linkErr.error) return toast.error(toUserMessage(linkErr.error, "No se pudo vincular el teléfono."));
      toast.success(t("otp_sent"));
      nav({
        to: "/auth/verificar-telefono",
        replace: true
      });
      return;
    }
    setLoading(false);
    toast.success(t("signup_check_email_then_phone"));
    nav({
      to: "/auth/verificar-telefono"
    });
  };
  const sendPhoneCode = async () => {
    const phone = toE164Phone(phoneRaw);
    if (!phone) return toast.error(t("invalid_phone"));
    setLoading(true);
    const {
      error
    } = await sendPhoneOtp(phone);
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
    const {
      data,
      error
    } = await verifyPhoneOtp(phoneE164, otp);
    setLoading(false);
    if (error) return toast.error(toUserMessage(error, "Código incorrecto o expirado."));
    if (phoneSignupName.trim().length >= 2 && data.user) {
      await supabase.from("profiles").update({
        nombre_completo: phoneSignupName.trim()
      }).eq("id", data.user.id);
    }
    toast.success(t("phone_verified"));
    nav({
      to: "/",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_35%),linear-gradient(180deg,_#7c3aed_0%,_#3b82f6_100%)] p-4 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/95 shadow-[0_24px_80px_rgba(124,58,237,0.15)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-4 border-b border-slate-700/80 px-8 py-8 text-center bg-gradient-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white shadow-lg shadow-purple-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-10 w-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "flex items-center justify-center gap-3 text-3xl font-semibold tracking-tight text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FACILITOEC" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm text-slate-200", children: t("tagline") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: method, onValueChange: (v) => setMethod(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "email", className: "gap-1 border-r border-slate-700/80 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            " ",
            t("with_email")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "phone", className: "gap-1 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
            " ",
            t("with_phone")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "email", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: emailTab, onValueChange: (v) => setEmailTab(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mt-2 grid w-full grid-cols-2 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", className: "border-r border-slate-700/80 bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg", children: t("sign_in") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", className: "bg-slate-950/90 text-slate-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg", children: t("sign_up") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignIn, className: "space-y-3 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email-in", children: t("email") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email-in", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pwd-in", children: t("password") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/recuperar", className: "text-xs text-primary hover:underline", children: t("forgot_password") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pwd-in", type: "password", required: true, minLength: 8, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("sign_in") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignUp, className: "space-y-3 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name-up", children: t("full_name") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name-up", required: true, autoComplete: "name", value: name, onChange: (e) => setName(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email-up", children: t("email") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email-up", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone-up", children: t("mobile_number") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone-up", type: "tel", required: true, placeholder: "0991234567", value: phoneRaw, onChange: (e) => setPhoneRaw(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: t("phone_verify_on_signup") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pwd-up", children: t("password") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pwd-up", type: "password", required: true, minLength: 8, autoComplete: "new-password", value: password, onChange: (e) => setPassword(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("sign_up") })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "phone", children: phoneStep === "input" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone-in", children: t("mobile_number") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone-in", type: "tel", required: true, placeholder: "0991234567", value: phoneRaw, onChange: (e) => setPhoneRaw(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: t("phone_format_hint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name-phone", children: t("full_name") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name-phone", placeholder: t("optional_on_login"), value: phoneSignupName, onChange: (e) => setPhoneSignupName(e.target.value), className: "bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", disabled: loading, className: "w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary", onClick: sendPhoneCode, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("send_sms_code") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: t("phone_login_hint") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
            t("otp_sent_to"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: phoneE164 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OtpInput, { value: otp, onChange: setOtp, disabled: loading }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", disabled: loading || otp.length < 6, className: "w-full rounded-2xl bg-gradient-primary/95 border border-primary/80 text-white shadow-lg shadow-primary/10 hover:bg-gradient-primary", onClick: verifyPhoneCode, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("verify_and_enter") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "w-full", disabled: loading || cooldown > 0, onClick: sendPhoneCode, children: cooldown > 0 ? `${t("resend_code")} (${cooldown}s)` : t("resend_code") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "link", size: "sm", className: "w-full", onClick: () => {
            setPhoneStep("input");
            setOtp("");
          }, children: t("change_phone") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
        " ",
        t("or"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", disabled: loading, onClick: handleGoogle, className: "w-full rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-100 hover:bg-slate-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
        ] }),
        t("google_sign_in")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "hover:underline", children: [
        "← ",
        t("back_home")
      ] }) })
    ] })
  ] }) });
}
export {
  AuthPage as component
};
