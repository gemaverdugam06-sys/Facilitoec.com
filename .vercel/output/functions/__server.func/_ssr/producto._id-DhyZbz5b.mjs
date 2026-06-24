import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { R as Route$c, u as useI18n, a as useAuth, i as isUserVerified, c as buildWhatsappLink, t as toUserMessage } from "./router-CStixWKO.mjs";
import { a as useSignedUrls } from "./storage-CdR5AvBn.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { C as Card } from "./card-B2WPZ-Hv.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-FlEjym4Y.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, A as ArrowLeft, d as Sparkles, k as MapPin, e as MessageCircle, n as Phone } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "./Logo-Dar0Ngh0.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
function ProductoPage() {
  const {
    id
  } = Route$c.useParams();
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [p, setP] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [idx, setIdx] = reactExports.useState(0);
  const images = useSignedUrls("productos", p?.imagenes ?? []);
  reactExports.useEffect(() => {
    supabase.from("productos").select("*, profiles!productos_user_profile_fk(nombre_completo, avatar_url, ciudad)").eq("id", id).single().then(({
      data
    }) => {
      setP(data);
      setLoading(false);
    });
  }, [id]);
  const isVerified = isUserVerified(user);
  const startChat = async () => {
    if (!user) {
      toast.error("Inicia sesión para chatear");
      nav({
        to: "/auth"
      });
      return;
    }
    if (!isVerified) {
      toast.error("Verifica tu correo electrónico para poder chatear");
      return;
    }
    if (!p) return;
    if (user.id === p.user_id) {
      toast.error("Es tu propio anuncio");
      return;
    }
    const {
      data: existing
    } = await supabase.from("chats").select("id").eq("producto_id", p.id).eq("comprador_id", user.id).maybeSingle();
    let chatId = existing?.id;
    if (!chatId) {
      const {
        data: nuevo,
        error
      } = await supabase.from("chats").insert({
        producto_id: p.id,
        comprador_id: user.id,
        vendedor_id: p.user_id
      }).select("id").single();
      if (error) {
        toast.error(toUserMessage(error, "No se pudo iniciar el chat."));
        return;
      }
      chatId = nuevo.id;
    }
    nav({
      to: "/chat/$chatId",
      params: {
        chatId
      }
    });
  };
  const handleWhatsapp = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error("Inicia sesión para ver WhatsApp");
      nav({
        to: "/auth"
      });
      return;
    }
    if (!isVerified) {
      e.preventDefault();
      toast.error("Verifica tu correo electrónico para contactar por WhatsApp");
      return;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
        " Cargando..."
      ] })
    ] });
  }
  if (!p) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto p-8 text-center", children: "Producto no encontrado." })
    ] });
  }
  const waLink = buildWhatsappLink(p.whatsapp, `Hola, vi tu anuncio "${p.titulo}" en FACILITOEC y me interesa. ¿Sigue disponible?`);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto max-w-5xl px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => nav({
        to: "/"
      }), className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
        " Volver"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "aspect-square overflow-hidden rounded-xl bg-muted", initial: {
            scale: 0.995,
            opacity: 0
          }, animate: {
            scale: 1,
            opacity: 1
          }, transition: {
            duration: 0.45
          }, whileHover: {
            scale: 1.02
          }, children: images[idx] && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: images[idx], alt: p.titulo, width: 800, height: 800, loading: "lazy", decoding: "async", className: "h-full w-full object-cover" }) }),
          images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-2 overflow-x-auto", children: images.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx(i), className: `h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${i === idx ? "border-primary" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", width: 64, height: 64, loading: "lazy", decoding: "async", className: "h-full w-full object-cover" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            p.es_destacado && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-featured text-warning-foreground border-0 gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
              " ",
              t("featured")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: p.estado === "nuevo" ? t("new_item") : t("used_item") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold leading-tight md:text-3xl", children: p.titulo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-primary", children: [
            p.moneda,
            " ",
            Number(p.precio).toLocaleString(void 0, {
              minimumFractionDigits: 2
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            " ",
            p.ciudad
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 glass-border soft-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: p.profiles?.avatar_url ?? void 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: p.profiles?.nombre_completo?.[0] ?? "?" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: p.profiles?.nombre_completo ?? "Vendedor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: p.profiles?.ciudad ?? p.ciudad })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: {
              scale: 1.02
            }, className: "flex-1 will-change-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: startChat, className: "flex-1 btn-cta", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1 h-4 w-4" }),
              " ",
              t("chat_internal")
            ] }) }),
            p.whatsapp && (user && isVerified && waLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: {
              scale: 1.02
            }, className: "flex-1 will-change-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mr-1 h-4 w-4" }),
              " ",
              t("open_whatsapp")
            ] }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: {
              scale: 1.02
            }, className: "flex-1 will-change-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1", onClick: handleWhatsapp, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mr-1 h-4 w-4" }),
              " ",
              t("open_whatsapp")
            ] }) }))
          ] }),
          (!user || !isVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: !user ? "Inicia sesión con una cuenta verificada para ver WhatsApp y chatear." : "Verifica tu correo electrónico para ver WhatsApp y chatear." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-1 text-sm font-semibold uppercase text-muted-foreground", children: t("description") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed", children: p.descripcion })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProductoPage as component
};
