import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const KNOWN_MESSAGES = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Confirma tu correo antes de iniciar sesión.",
  "User already registered": "Ya existe una cuenta con este correo.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 8 caracteres.",
  "Token has expired or is invalid": "El enlace expiró. Solicita uno nuevo.",
  "Phone number already registered": "Este número ya está registrado.",
  "Invalid OTP": "Código incorrecto. Intenta de nuevo.",
  "SMS sending failed": "No se pudo enviar el SMS. Intenta más tarde."
};
const TECHNICAL_PATTERN = /duplicate key|violates|constraint|relation|column|syntax|SQL|JWT|permission denied|row-level security|check_violation|PostgrestError/i;
function isTechnicalMessage(msg) {
  return TECHNICAL_PATTERN.test(msg);
}
function toUserMessage(error, fallback) {
  const msg = typeof error === "string" ? error : error && typeof error === "object" && "message" in error ? String(error.message) : null;
  if (!msg) return fallback;
  if (KNOWN_MESSAGES[msg]) return KNOWN_MESSAGES[msg];
  if (isTechnicalMessage(msg)) return fallback;
  if (msg.length <= 120 && !msg.includes("http")) return msg;
  return fallback;
}
const Ctx$1 = reactExports.createContext({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx$1.Provider, { value: { user: session?.user ?? null, session, loading, signOut }, children });
}
const useAuth = () => reactExports.useContext(Ctx$1);
const dict = {
  es: {
    app_name: "FACILITOEC",
    tagline: "Compra y vende fácil en Ecuador",
    home: "Inicio",
    publish: "Publicar",
    my_listings: "Mis publicaciones",
    profile: "Perfil",
    chats: "Mensajes",
    sign_in: "Iniciar sesión",
    sign_up: "Crear cuenta",
    sign_out: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    full_name: "Nombre completo",
    city: "Ciudad",
    phone: "Teléfono (WhatsApp)",
    google_sign_in: "Continuar con Google",
    or: "o",
    search_placeholder: "Buscar productos...",
    all_categories: "Todas las categorías",
    featured: "Destacado",
    sponsored: "Patrocinado",
    contact_seller: "Contactar vendedor",
    chat_internal: "Chat interno",
    open_whatsapp: "Abrir WhatsApp",
    publish_ad: "Publicar anuncio",
    title: "Título",
    description: "Descripción",
    price: "Precio",
    category: "Categoría",
    condition: "Estado",
    new_item: "Nuevo",
    used_item: "Usado",
    images: "Imágenes",
    add_images: "Agregar fotos",
    publishing: "Publicando...",
    promote: "Promocionar",
    promote_listing: "Promocionar publicación",
    plan_silver: "Plan Plata",
    plan_gold: "Plan Oro",
    silver_desc: "Destacado por 7 días",
    gold_desc: "Destacado por 30 días + prioridad en buscador",
    pay_now: "Pagar ahora",
    processing_payment: "Procesando pago seguro...",
    payment_success: "¡Pago exitoso! Tu anuncio ya está destacado.",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm_delete: "¿Eliminar este anuncio?",
    type_message: "Escribe un mensaje...",
    send: "Enviar",
    no_messages: "Aún no hay mensajes. ¡Sé el primero!",
    no_listings: "No tienes publicaciones todavía.",
    no_chats: "No tienes conversaciones todavía.",
    upload_avatar: "Cambiar foto",
    update_profile: "Actualizar perfil",
    profile_updated: "Perfil actualizado",
    welcome_back: "Bienvenido de nuevo",
    create_account_desc: "Crea tu cuenta gratis para empezar a vender",
    saved: "Guardado",
    error: "Error",
    promo_until: "Destacado hasta",
    no_promo: "Sin promoción activa",
    active: "Activo",
    inactive: "Pausado",
    toggle_active: "Pausar/Activar",
    with_email: "Correo",
    with_phone: "Teléfono",
    mobile_number: "Número de celular",
    phone_format_hint: "Ej: 0991234567 o +593 99 123 4567",
    phone_verify_on_signup: "Te enviaremos un código SMS para confirmar tu cuenta.",
    phone_login_hint: "Te enviaremos un código por SMS. Sirve para entrar o crear cuenta.",
    send_sms_code: "Enviar código SMS",
    otp_sent: "Código enviado a tu celular",
    otp_sent_to: "Código enviado a",
    verify_code: "Verificar código",
    verify_and_enter: "Verificar e ingresar",
    resend_code: "Reenviar código",
    change_phone: "Cambiar número",
    enter_6_digit_code: "Ingresa el código de 6 dígitos",
    invalid_phone: "Número de celular inválido",
    phone_verified: "¡Celular verificado!",
    verify_phone_title: "Verifica tu celular",
    verify_phone_desc: "Por seguridad, confirma tu número con el código SMS.",
    skip_for_now: "Verificar después",
    forgot_password: "¿Olvidaste tu contraseña?",
    forgot_password_desc: "Te enviaremos un enlace a tu correo para restablecerla.",
    send_reset_link: "Enviar enlace",
    reset_email_sent: "Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.",
    check_spam: "Si no lo ves, revisa la carpeta de spam.",
    back_to_sign_in: "Volver a iniciar sesión",
    phone_recovery_hint: "¿Entras con celular?",
    sign_in_with_phone: "Usa la pestaña Teléfono",
    new_password: "Nueva contraseña",
    new_password_desc: "Elige una contraseña segura de al menos 8 caracteres.",
    confirm_password: "Confirmar contraseña",
    save_password: "Guardar contraseña",
    password_updated: "Contraseña actualizada",
    reset_link_expired: "El enlace expiró o ya fue usado. Solicita uno nuevo.",
    password_min_8: "La contraseña debe tener al menos 8 caracteres.",
    passwords_mismatch: "Las contraseñas no coinciden.",
    name_required: "Ingresa tu nombre completo.",
    signup_check_email_then_phone: "Cuenta creada. Confirma tu correo y luego verifica tu celular.",
    optional_on_login: "Opcional al iniciar sesión",
    back_home: "Volver al inicio",
    verify_account: "Verifica tu cuenta para chatear y publicar."
  },
  en: {
    app_name: "FACILITOEC",
    tagline: "Buy and sell easily in Ecuador",
    home: "Home",
    publish: "Publish",
    my_listings: "My listings",
    profile: "Profile",
    chats: "Messages",
    sign_in: "Sign in",
    sign_up: "Create account",
    sign_out: "Sign out",
    email: "Email",
    password: "Password",
    full_name: "Full name",
    city: "City",
    phone: "Phone (WhatsApp)",
    google_sign_in: "Continue with Google",
    or: "or",
    search_placeholder: "Search products...",
    all_categories: "All categories",
    featured: "Featured",
    sponsored: "Sponsored",
    contact_seller: "Contact seller",
    chat_internal: "Internal chat",
    open_whatsapp: "Open WhatsApp",
    publish_ad: "Publish listing",
    title: "Title",
    description: "Description",
    price: "Price",
    category: "Category",
    condition: "Condition",
    new_item: "New",
    used_item: "Used",
    images: "Images",
    add_images: "Add photos",
    publishing: "Publishing...",
    promote: "Promote",
    promote_listing: "Promote listing",
    plan_silver: "Silver Plan",
    plan_gold: "Gold Plan",
    silver_desc: "Featured for 7 days",
    gold_desc: "Featured for 30 days + search priority",
    pay_now: "Pay now",
    processing_payment: "Processing secure payment...",
    payment_success: "Payment successful! Your listing is now featured.",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm_delete: "Delete this listing?",
    type_message: "Type a message...",
    send: "Send",
    no_messages: "No messages yet. Be the first!",
    no_listings: "You have no listings yet.",
    no_chats: "No conversations yet.",
    upload_avatar: "Change photo",
    update_profile: "Update profile",
    profile_updated: "Profile updated",
    welcome_back: "Welcome back",
    create_account_desc: "Create your free account to start selling",
    saved: "Saved",
    error: "Error",
    promo_until: "Featured until",
    no_promo: "No active promotion",
    active: "Active",
    inactive: "Paused",
    toggle_active: "Pause/Activate",
    with_email: "Email",
    with_phone: "Phone",
    mobile_number: "Mobile number",
    phone_format_hint: "E.g. 0991234567 or +593 99 123 4567",
    phone_verify_on_signup: "We will send an SMS code to confirm your account.",
    phone_login_hint: "We will send an SMS code. Works for sign in or sign up.",
    send_sms_code: "Send SMS code",
    otp_sent: "Code sent to your phone",
    otp_sent_to: "Code sent to",
    verify_code: "Verify code",
    verify_and_enter: "Verify and sign in",
    resend_code: "Resend code",
    change_phone: "Change number",
    enter_6_digit_code: "Enter the 6-digit code",
    invalid_phone: "Invalid mobile number",
    phone_verified: "Phone verified!",
    verify_phone_title: "Verify your phone",
    verify_phone_desc: "For security, confirm your number with the SMS code.",
    skip_for_now: "Verify later",
    forgot_password: "Forgot password?",
    forgot_password_desc: "We will email you a link to reset your password.",
    send_reset_link: "Send reset link",
    reset_email_sent: "Check your email for a password reset link.",
    check_spam: "If you don't see it, check your spam folder.",
    back_to_sign_in: "Back to sign in",
    phone_recovery_hint: "Sign in with phone?",
    sign_in_with_phone: "Use the Phone tab",
    new_password: "New password",
    new_password_desc: "Choose a secure password of at least 8 characters.",
    confirm_password: "Confirm password",
    save_password: "Save password",
    password_updated: "Password updated",
    reset_link_expired: "This link expired or was already used. Request a new one.",
    password_min_8: "Password must be at least 8 characters.",
    passwords_mismatch: "Passwords do not match.",
    name_required: "Enter your full name.",
    signup_check_email_then_phone: "Account created. Confirm your email, then verify your phone.",
    optional_on_login: "Optional when signing in",
    back_home: "Back to home",
    verify_account: "Verify your account to chat and publish."
  }
};
const Ctx = reactExports.createContext({
  lang: "es",
  setLang: () => {
  },
  t: (k) => k
});
function I18nProvider({ children }) {
  const [lang, setLangState] = reactExports.useState("es");
  reactExports.useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);
  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k) => dict[lang][k] ?? k;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { lang, setLang, t }, children });
}
const useI18n = () => reactExports.useContext(Ctx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Página no encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "La página que buscas no existe o fue movida." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Ir al inicio" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  const userMessage = toUserMessage(error, "Algo salió mal. Intenta de nuevo.");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Algo salió mal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: userMessage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Reintentar"
      }
    ) })
  ] }) });
}
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "es", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  const router2 = useRouter();
  const [supabaseDown, setSupabaseDown] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const stored = localStorage.getItem("supabase_down");
      const unavailable = Boolean(supabase.__unavailable);
      setSupabaseDown(!!stored || unavailable);
    } catch {
      setSupabaseDown(false);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") router2.navigate({ to: "/auth/nueva-contrasena" });
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router2.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  reactExports.useEffect(() => {
    function onStorage(e) {
      if (e.key === "supabase_down") setSupabaseDown(!!e.newValue);
    }
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(I18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    supabaseDown && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-yellow-50 border-y border-yellow-200 text-yellow-800 text-center py-2 text-sm", children: "Módulo de backend temporalmente no disponible — algunas funciones pueden no funcionar. Modo solo lectura activado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] }) }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "FACILITOEC — Compra y vende fácil en Ecuador" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
const $$splitComponentImporter$f = () => import("./auth-DfOGkpqC.mjs");
const Route$f = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Iniciar sesión — FACILITOEC"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
function normalizeWhatsapp(raw) {
  if (!raw) return null;
  let s = raw.trim();
  if (s.startsWith("00")) s = s.slice(2);
  if (s.startsWith("+")) s = s.slice(1);
  s = s.replace(/\D/g, "");
  if (!s) return null;
  if (s.length === 10 && s.startsWith("0")) {
    s = "593" + s.slice(1);
  } else if (s.length === 9 && s.startsWith("9")) {
    s = "593" + s;
  } else if (s.length === 8) {
    s = "593" + s;
  }
  if (s.length < 8 || s.length > 15) return null;
  return s;
}
function buildWhatsappLink(raw, message) {
  const num = normalizeWhatsapp(raw);
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
function toE164Phone(raw) {
  const digits = normalizeWhatsapp(raw);
  if (!digits) return null;
  return `+${digits}`;
}
function isUserVerified(user) {
  if (!user) return false;
  return !!user.phone_confirmed_at;
}
async function checkIsAdmin(userId) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  });
  return !error && !!data;
}
async function sendPhoneOtp(phone) {
  return supabase.auth.signInWithOtp({
    phone,
    options: { channel: "sms" }
  });
}
async function verifyPhoneOtp(phone, token) {
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms"
  });
}
async function linkPhoneToAccount(phone) {
  return supabase.auth.updateUser({ phone });
}
async function verifyPhoneLink(phone, token) {
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: "phone_change"
  });
}
const $$splitComponentImporter$e = () => import("./route-BFsOu0JM.mjs");
const Route$e = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    if (!isUserVerified(data.user)) {
      throw redirect({
        to: "/auth/verificar-telefono"
      });
    }
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-DsebUlrO.mjs");
const Route$d = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "FACILITOEC — Marketplace de Ecuador"
    }, {
      name: "description",
      content: "Compra, vende y promociona tus anuncios en Ecuador. Tecnología, vehículos, hogar, moda, inmuebles y más."
    }, {
      property: "og:title",
      content: "FACILITOEC"
    }, {
      property: "og:description",
      content: "Marketplace de Ecuador con publicaciones destacadas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./producto._id-DhyZbz5b.mjs");
const Route$c = createFileRoute("/producto/$id")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./categoria._id-9VxoWwnS.mjs");
const Route$b = createFileRoute("/categoria/$id")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./auth.verificar-telefono-CPugbiC-.mjs");
const Route$a = createFileRoute("/auth/verificar-telefono")({
  head: () => ({
    meta: [{
      title: "Verificar celular — FACILITOEC"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./auth.recuperar-tZh2Yh2o.mjs");
const Route$9 = createFileRoute("/auth/recuperar")({
  head: () => ({
    meta: [{
      title: "Recuperar contraseña — FACILITOEC"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./auth.nueva-contrasena-Cmz1fTs0.mjs");
const Route$8 = createFileRoute("/auth/nueva-contrasena")({
  head: () => ({
    meta: [{
      title: "Nueva contraseña — FACILITOEC"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./publicar-CxDoY4lh.mjs");
const Route$7 = createFileRoute("/_authenticated/publicar")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./perfil-ldGvTPzG.mjs");
const Route$6 = createFileRoute("/_authenticated/perfil")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./mis-publicaciones-Cbw6gf7Z.mjs");
const Route$5 = createFileRoute("/_authenticated/mis-publicaciones")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./chats-DgdkulDs.mjs");
const Route$4 = createFileRoute("/_authenticated/chats")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin-CN0-4le7.mjs");
const Route$3 = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const {
      data
    } = await supabase.auth.getUser();
    if (!data.user) throw redirect({
      to: "/auth"
    });
    const admin = await checkIsAdmin(data.user.id);
    if (!admin) throw redirect({
      to: "/"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./promocionar._productoId-Dx6ThEQc.mjs");
const Route$2 = createFileRoute("/_authenticated/promocionar/$productoId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./editar._id-CDJDJrqs.mjs");
const Route$1 = createFileRoute("/_authenticated/editar/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./chat._chatId-BrqSjlMD.mjs");
const Route = createFileRoute("/_authenticated/chat/$chatId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthRoute = Route$f.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$g
});
const AuthenticatedRouteRoute = Route$e.update({
  id: "/_authenticated",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const ProductoIdRoute = Route$c.update({
  id: "/producto/$id",
  path: "/producto/$id",
  getParentRoute: () => Route$g
});
const CategoriaIdRoute = Route$b.update({
  id: "/categoria/$id",
  path: "/categoria/$id",
  getParentRoute: () => Route$g
});
const AuthVerificarTelefonoRoute = Route$a.update({
  id: "/verificar-telefono",
  path: "/verificar-telefono",
  getParentRoute: () => AuthRoute
});
const AuthRecuperarRoute = Route$9.update({
  id: "/recuperar",
  path: "/recuperar",
  getParentRoute: () => AuthRoute
});
const AuthNuevaContrasenaRoute = Route$8.update({
  id: "/nueva-contrasena",
  path: "/nueva-contrasena",
  getParentRoute: () => AuthRoute
});
const AuthenticatedPublicarRoute = Route$7.update({
  id: "/publicar",
  path: "/publicar",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPerfilRoute = Route$6.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedMisPublicacionesRoute = Route$5.update({
  id: "/mis-publicaciones",
  path: "/mis-publicaciones",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedChatsRoute = Route$4.update({
  id: "/chats",
  path: "/chats",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPromocionarProductoIdRoute = Route$2.update({
  id: "/promocionar/$productoId",
  path: "/promocionar/$productoId",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedEditarIdRoute = Route$1.update({
  id: "/editar/$id",
  path: "/editar/$id",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedChatChatIdRoute = Route.update({
  id: "/chat/$chatId",
  path: "/chat/$chatId",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute,
  AuthenticatedChatsRoute,
  AuthenticatedMisPublicacionesRoute,
  AuthenticatedPerfilRoute,
  AuthenticatedPublicarRoute,
  AuthenticatedChatChatIdRoute,
  AuthenticatedEditarIdRoute,
  AuthenticatedPromocionarProductoIdRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const AuthRouteChildren = {
  AuthNuevaContrasenaRoute,
  AuthRecuperarRoute,
  AuthVerificarTelefonoRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
  CategoriaIdRoute,
  ProductoIdRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$c as R,
  useAuth as a,
  toE164Phone as b,
  buildWhatsappLink as c,
  Route$b as d,
  verifyPhoneLink as e,
  Route$2 as f,
  Route$1 as g,
  Route as h,
  isUserVerified as i,
  checkIsAdmin as j,
  linkPhoneToAccount as l,
  router as r,
  sendPhoneOtp as s,
  toUserMessage as t,
  useI18n as u,
  verifyPhoneOtp as v
};
