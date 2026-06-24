import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { C as Card, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useAuth } from "./router-CStixWKO.mjs";
import { K as Lock, f as ShieldCheck, L as LoaderCircle, s as Eye, N as ShieldX } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const PROMO_PLAN_DAYS = {
  FLASH: 2,
  BASICO: 5,
  PLUS: 10,
  PRO: 20,
  MEGA: 30
};
function promoEndDate(plan, from = /* @__PURE__ */ new Date()) {
  const days = PROMO_PLAN_DAYS[plan] ?? 7;
  const end = new Date(from);
  end.setDate(end.getDate() + days);
  return end.toISOString();
}
function AdminPanel() {
  const { user } = useAuth();
  const [txs, setTxs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [working, setWorking] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user) loadTransactions();
  }, [user?.id]);
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("transacciones").select(
        `
          *,
          productos (titulo),
          profiles (nombre_completo)
        `
      ).order("created_at", { ascending: false });
      if (error) throw error;
      setTxs(data ?? []);
    } catch {
      toast.error("Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  };
  const verComprobante = async (path) => {
    try {
      const { data, error } = await supabase.storage.from("comprobantes").createSignedUrl(path, 3600);
      if (error || !data?.signedUrl) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("No se pudo abrir el comprobante");
    }
  };
  const onAprobar = async (tx) => {
    setWorking(tx.id);
    try {
      const { error: txErr } = await supabase.from("transacciones").update({ estado_pago: "COMPLETADO" }).eq("id", tx.id);
      if (txErr) throw txErr;
      const { error: prodErr } = await supabase.from("productos").update({
        es_destacado: true,
        promocionado_hasta: promoEndDate(tx.plan),
        tipo_promocion: tx.plan
      }).eq("id", tx.producto_id);
      if (prodErr) throw prodErr;
      toast.success("¡Publicidad aprobada y activada! 🎉");
      await loadTransactions();
    } catch {
      toast.error("Error al aprobar transacción");
    } finally {
      setWorking(null);
    }
  };
  const onRechazar = async (id) => {
    const motivo = prompt("Motivo del rechazo (Ej: Comprobante borroso):") ?? "";
    if (motivo.trim() === "") {
      toast.error("Debes indicar un motivo para el rechazo.");
      return;
    }
    setWorking(id);
    try {
      const mensajeRechazo = `Tu pago de publicidad ha sido RECHAZADO ❌. Motivo: ${motivo}`;
      const { error } = await supabase.from("transacciones").update({ estado_pago: "RECHAZADO", notas_admin: mensajeRechazo }).eq("id", id);
      if (error) throw error;
      toast.success("Transacción rechazada.");
      await loadTransactions();
    } catch {
      toast.error("Error al rechazar transacción");
    } finally {
      setWorking(null);
    }
  };
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-md py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Acceso denegado" })
      ] })
    ] });
  }
  const pendientes = txs.filter((t) => t.estado_pago === "PENDIENTE");
  const otras = txs.filter((t) => t.estado_pago !== "PENDIENTE");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto max-w-4xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Panel de administración" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 text-sm font-semibold uppercase text-muted-foreground", children: [
          "Pendientes (",
          pendientes.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          pendientes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground", children: "Sin pagos pendientes 🎉" }),
          pendientes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: t.plan }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                "$",
                Number(t.monto).toFixed(2)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                "— ",
                t.productos?.titulo ?? "?"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              t.profiles?.nombre_completo ?? "Usuario",
              " ·",
              " ",
              new Date(t.created_at).toLocaleString(),
              t.referencia && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                " · Ref: ",
                t.referencia
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
              t.comprobante_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => verComprobante(t.comprobante_url),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-4 w-4" }),
                    " Ver comprobante"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-success text-success-foreground hover:bg-success/90",
                  disabled: working === t.id,
                  onClick: () => onAprobar(t),
                  children: working === t.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mr-1 h-4 w-4" }),
                    " Aprobar"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "destructive",
                  disabled: working === t.id,
                  onClick: () => onRechazar(t.id),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "mr-1 h-4 w-4" }),
                    " Rechazar"
                  ]
                }
              )
            ] })
          ] }) }, t.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 mt-8 text-sm font-semibold uppercase text-muted-foreground", children: [
          "Historial (",
          otras.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: otras.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-1 p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: t.estado_pago === "COMPLETADO" ? "default" : "destructive", children: t.estado_pago }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: t.plan }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
              "$",
              Number(t.monto).toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "— ",
              t.productos?.titulo ?? "?",
              " · ",
              t.profiles?.nombre_completo ?? ""
            ] })
          ] }),
          t.notas_admin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 rounded bg-muted/50 px-2 py-1 text-xs italic text-muted-foreground", children: t.notas_admin })
        ] }) }, t.id)) })
      ] })
    ] })
  ] });
}
export {
  AdminPanel
};
