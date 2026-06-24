import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { a as useAuth, u as useI18n, t as toUserMessage } from "./router-CStixWKO.mjs";
import { u as useUnreadChats, H as Header } from "./Header-C9Nt1IUt.mjs";
import { C as Card, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-FlEjym4Y.mjs";
import "../_libs/sonner.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "./button-DjOZMqFS.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./Logo-Dar0Ngh0.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/radix-ui__react-avatar.mjs";
function ChatsPage() {
  const {
    user
  } = useAuth();
  const {
    t
  } = useI18n();
  const {
    unread
  } = useUnreadChats();
  const [chats, setChats] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const cargarChats = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from("chats").select(`
        id, producto_id, comprador_id, vendedor_id, updated_at,
        productos:producto_id (titulo, imagenes),
        comprador:profiles!chats_comprador_profile_fk (nombre_completo, avatar_url),
        vendedor:profiles!chats_vendedor_profile_fk (nombre_completo, avatar_url)
      `).or(`comprador_id.eq.${user.id},vendedor_id.eq.${user.id}`);
    if (error) {
      toUserMessage(error, "Error al cargar los chats.");
      setLoading(false);
      return;
    }
    const chatsOrdenados = (data ?? []).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    setChats(chatsOrdenados);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    if (!user) return;
    cargarChats();
    const canalChats = supabase.channel("actualizaciones-bandeja-chats").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "chats"
    }, async (payload) => {
      const row = payload.new;
      if (row && (row.comprador_id === user.id || row.vendedor_id === user.id)) {
        await cargarChats();
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(canalChats);
    };
  }, [user?.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto max-w-2xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4 text-2xl font-bold", children: t("chats") }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-muted-foreground" }) }) : chats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground", children: t("no_chats") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: chats.map((c) => {
        const other = c.comprador_id === user?.id ? c.vendedor : c.comprador;
        const count = unread[c.id] ?? 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chat/$chatId", params: {
          chatId: c.id
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `transition hover:bg-accent ${count > 0 ? "border-primary/40 bg-primary/5" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: other?.avatar_url ?? void 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: other?.nombre_completo?.[0] ?? "?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `truncate text-sm ${count > 0 ? "font-bold" : "font-semibold"}`, children: other?.nombre_completo ?? "Usuario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: c.productos?.titulo })
          ] }),
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground", children: count > 99 ? "99+" : count })
        ] }) }) }, c.id);
      }) })
    ] })
  ] });
}
export {
  ChatsPage as component
};
