import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { h as Route, a as useAuth, u as useI18n, t as toUserMessage } from "./router-CStixWKO.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ArrowLeft, L as LoaderCircle, J as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ChatPage() {
  const {
    chatId
  } = Route.useParams();
  const {
    user
  } = useAuth();
  const {
    t
  } = useI18n();
  const nav = useNavigate();
  const [info, setInfo] = reactExports.useState(null);
  const [mensajes, setMensajes] = reactExports.useState([]);
  const [texto, setTexto] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const scrollRef = reactExports.useRef(null);
  const refrescarMensajes = async () => {
    if (!chatId) return;
    const {
      data
    } = await supabase.from("mensajes").select("*").eq("chat_id", chatId).order("created_at", {
      ascending: true
    });
    if (data) {
      setMensajes(data);
    }
  };
  reactExports.useEffect(() => {
    if (!chatId) return;
    supabase.from("chats").select("id, comprador_id, vendedor_id, productos:producto_id (id, titulo)").eq("id", chatId).maybeSingle().then(({
      data
    }) => {
      if (data) setInfo(data);
    });
    refrescarMensajes().then(() => setLoading(false));
    const ch = supabase.channel(`chat-${chatId}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "mensajes",
      filter: `chat_id=eq.${chatId}`
    }, () => {
      refrescarMensajes();
    }).subscribe();
    const intervaloRespaldo = setInterval(() => {
      refrescarMensajes();
    }, 3e3);
    return () => {
      supabase.removeChannel(ch);
      clearInterval(intervaloRespaldo);
    };
  }, [chatId]);
  reactExports.useEffect(() => {
    if (!user || !info) return;
    const readUpdate = info.comprador_id === user.id ? {
      ultimo_leido_comprador: (/* @__PURE__ */ new Date()).toISOString()
    } : {
      ultimo_leido_vendedor: (/* @__PURE__ */ new Date()).toISOString()
    };
    supabase.from("chats").update(readUpdate).eq("id", chatId).then(() => {
    });
  }, [user?.id, info?.id, mensajes.length, chatId]);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes.length]);
  const enviar = async (e) => {
    e.preventDefault();
    const v = texto.trim();
    if (!v || !user) return;
    setTexto("");
    const {
      error
    } = await supabase.from("mensajes").insert({
      chat_id: chatId,
      remitente_id: user.id,
      contenido: v
    });
    if (error) {
      toUserMessage(error, "No se pudo enviar el mensaje.");
      toast.error("No se pudo enviar el mensaje.");
      setTexto(v);
      return;
    }
    await refrescarMensajes();
    await supabase.from("chats").update({
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", chatId);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex max-w-2xl items-center gap-2 px-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => nav({
        to: "/chats"
      }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      info?.productos && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/producto/$id", params: {
        id: info.productos.id
      }, className: "truncate text-sm font-semibold hover:underline", children: info.productos.titulo })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-2xl space-y-2 px-4 py-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-muted-foreground" }) }) : mensajes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: t("no_messages") }) : mensajes.map((m) => {
      const mine = m.remitente_id === user?.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${mine ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`, children: m.contenido }) }, m.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: enviar, className: "sticky bottom-0 border-t bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex max-w-2xl gap-2 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: texto, onChange: (e) => setTexto(e.target.value), placeholder: t("type_message"), maxLength: 1e3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", className: "bg-gradient-primary", disabled: !texto.trim(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
    ] }) })
  ] });
}
export {
  ChatPage as component
};
