import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { u as useI18n, a as useAuth, t as toUserMessage } from "./router-CStixWKO.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { C as Card, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { u as useSignedUrl } from "./storage-CdR5AvBn.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, L as LoaderCircle, d as Sparkles, r as SquarePen, E as EyeOff, s as Eye, t as Trash2, u as Clock, v as CircleCheck, w as CircleAlert } from "../_libs/lucide-react.mjs";
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
function MisPubs() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data: prods,
        error: pErr
      } = await supabase.from("productos").select("id, titulo, precio, moneda, imagenes, es_destacado, promocionado_hasta, tipo_promocion, activo").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (pErr) throw pErr;
      const listaProductos = prods ?? [];
      if (listaProductos.length > 0) {
        const {
          data: txs
        } = await supabase.from("transacciones").select("producto_id, estado_pago, notas_admin, created_at").in("producto_id", listaProductos.map((p) => p.id)).order("created_at", {
          ascending: false
        });
        listaProductos.forEach((p) => {
          const txAsociada = txs?.find((t2) => t2.producto_id === p.id);
          if (txAsociada) {
            p.estado_pago = txAsociada.estado_pago;
            p.notas_admin = txAsociada.notas_admin;
          }
        });
      }
      setItems(listaProductos);
    } catch (err) {
      toUserMessage(err, "Error al sincronizar con el servidor");
      toast.error("Error al sincronizar con el servidor");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [user?.id]);
  const del = async (id) => {
    if (!confirm(t("confirm_delete"))) return;
    const {
      error
    } = await supabase.from("productos").delete().eq("id", id);
    if (error) return toast.error(toUserMessage(error, "No se pudo eliminar el anuncio."));
    toast.success("Eliminado");
    load();
  };
  const toggleActive = async (p) => {
    const {
      error
    } = await supabase.from("productos").update({
      activo: !p.activo
    }).eq("id", p.id);
    if (error) return toast.error(toUserMessage(error, "No se pudo actualizar el anuncio."));
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto max-w-4xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: t("my_listings") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gradient-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/publicar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " ",
          t("publish")
        ] }) })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground", children: t("no_listings") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PubRow, { p, onDelete: () => del(p.id), onToggle: () => toggleActive(p) }, p.id)) })
    ] })
  ] });
}
function PubRow({
  p,
  onDelete,
  onToggle
}) {
  const {
    t
  } = useI18n();
  const nav = useNavigate();
  const img = useSignedUrl("productos", p.imagenes?.[0]);
  const promoActiva = p.es_destacado && p.promocionado_hasta && new Date(p.promocionado_hasta) > /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
        to: "/producto/$id",
        params: {
          id: p.id
        }
      }), className: "h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted", children: img && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: "", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-sm font-semibold", children: p.titulo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-primary", children: [
          p.moneda,
          " ",
          Number(p.precio).toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: p.activo ? "default" : "secondary", className: "text-[10px]", children: p.activo ? t("active") : t("inactive") }),
          promoActiva && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-featured text-warning-foreground border-0 gap-1 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " ",
            p.tipo_promocion
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        !promoActiva && p.estado_pago !== "PENDIENTE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-gradient-featured text-warning-foreground hover:opacity-90", onClick: () => nav({
          to: "/promocionar/$productoId",
          params: {
            productoId: p.id
          }
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " ",
          t("promote")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => nav({
            to: "/editar/$id",
            params: {
              id: p.id
            }
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: onToggle, children: p.activo ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
        ] })
      ] })
    ] }),
    p.estado_pago && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      p.estado_pago === "PENDIENTE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 border-t border-amber-100 dark:border-amber-900/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tu pago para destacar este anuncio está siendo revisado por el administrador." })
      ] }),
      p.estado_pago === "COMPLETADO" && promoActiva && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 border-t border-emerald-100 dark:border-emerald-900/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.notas_admin || "¡Tu publicidad ha sido aprobada y el anuncio ya está destacado! 🎉" })
      ] }),
      p.estado_pago === "RECHAZADO" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs text-rose-700 dark:text-rose-400 border-t border-rose-100 dark:border-rose-900/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Publicidad Rechazada: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.notas_admin || "Por favor, verifica el comprobante e intenta de nuevo." })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  MisPubs as component
};
