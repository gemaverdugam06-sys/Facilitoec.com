import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { f as Route$2, a as useAuth, u as useI18n, t as toUserMessage } from "./router-CStixWKO.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { C as Card, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Z as Zap, x as Star, R as Rocket, F as Flame, y as Crown, d as Sparkles, h as Check, z as ExternalLink, D as Copy, L as LoaderCircle, H as Upload } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
const PAYPHONE_LINK = "https://payp.page/l/FacilitoEC";
const PLANS = [{
  key: "FLASH",
  name: "Flash",
  price: 1,
  days: 2,
  perks: ["Insignia 'Destacado'", "Aparece arriba", "Ideal para probar"],
  Icon: Zap,
  gradient: "from-amber-400 to-orange-500"
}, {
  key: "BASICO",
  name: "Básico",
  price: 2,
  days: 5,
  perks: ["Todo lo de Flash", "5 días destacado", "Más visitas"],
  Icon: Star,
  badge: "Recomendado",
  highlight: true,
  gradient: "from-pink-500 to-rose-500"
}, {
  key: "PLUS",
  name: "Plus",
  price: 3.5,
  days: 10,
  perks: ["10 días destacado", "Prioridad en búsqueda", "Insignia premium"],
  Icon: Rocket,
  gradient: "from-fuchsia-500 to-purple-600"
}, {
  key: "PRO",
  name: "Pro",
  price: 5.99,
  days: 20,
  perks: ["20 días destacado", "Top en categoría", "Soporte prioritario"],
  Icon: Flame,
  gradient: "from-violet-500 to-indigo-600"
}, {
  key: "MEGA",
  name: "Mega",
  price: 8.99,
  days: 30,
  perks: ["30 días destacado", "Insignia dorada", "Máxima exposición"],
  Icon: Crown,
  badge: "Mejor valor",
  gradient: "from-yellow-400 via-orange-500 to-pink-500"
}];
function PromocionarPage() {
  const {
    productoId
  } = Route$2.useParams();
  const {
    user
  } = useAuth();
  const {
    t
  } = useI18n();
  const nav = useNavigate();
  const [selected, setSelected] = reactExports.useState(null);
  const [file, setFile] = reactExports.useState(null);
  const [referencia, setReferencia] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const cfg = selected ? PLANS.find((p) => p.key === selected) : null;
  const submit = async () => {
    if (!selected || !file || !user || !cfg) return toast.error("Selecciona plan y sube comprobante");
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("comprobantes").upload(path, file);
      if (upErr) throw upErr;
      const {
        error: insErr
      } = await supabase.from("transacciones").insert({
        user_id: user.id,
        producto_id: productoId,
        monto: cfg.price,
        plan: selected,
        estado_pago: "PENDIENTE",
        comprobante_url: path,
        referencia: referencia.trim() !== "" ? referencia : null
      });
      if (insErr) throw insErr;
      toast.success("¡Comprobante enviado! Aprobaremos tu promoción muy pronto.");
      setTimeout(() => nav({
        to: "/mis-publicaciones"
      }), 800);
    } catch (e) {
      toast.error(toUserMessage(e, "Error al procesar la solicitud. Intenta de nuevo."));
      setLoading(false);
    }
  };
  const copyLink = () => {
    navigator.clipboard.writeText(PAYPHONE_LINK);
    toast.success("Link copiado");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto max-w-6xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-featured text-warning-foreground border-0 gap-1 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Vende hasta 5x más rápido"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold sm:text-3xl", children: t("promote_listing") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground sm:text-base", children: "Elige un plan y paga con PayPhone 🇪🇨" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: PLANS.map(({
        key,
        name,
        price,
        days,
        perks,
        Icon,
        gradient,
        highlight,
        badge
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick: () => setSelected(key), className: `relative flex flex-col overflow-hidden cursor-pointer transition hover:-translate-y-0.5 hover:shadow-hover ${selected === key ? "ring-2 ring-primary shadow-glow" : highlight ? "ring-1 ring-primary/40" : ""}`, children: [
        badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0 text-[10px] uppercase tracking-wide", children: badge }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-full bg-gradient-to-r ${gradient}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-1 flex-col gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold leading-none", children: name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                days,
                " días"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-extrabold", children: [
              "$",
              price.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "USD" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 text-xs", children: perks.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p })
          ] }, p)) })
        ] })
      ] }, key)) }),
      cfg && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-6 border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold", children: [
            "Plan ",
            cfg.name,
            " — $",
            cfg.price.toFixed(2),
            " USD"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { children: [
            cfg.days,
            " días"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-muted/30 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
            "1. Paga $",
            cfg.price.toFixed(2),
            " con PayPhone"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "flex-1 bg-gradient-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: PAYPHONE_LINK, target: "_blank", rel: "noopener noreferrer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "mr-1 h-4 w-4" }),
              " Pagar con PayPhone"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: copyLink, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-4 w-4" }),
              " Copiar link"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground break-all", children: PAYPHONE_LINK })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "2. Sube la captura del comprobante" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ref", children: "Número de referencia (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ref", value: referencia, onChange: (e) => setReferencia(e.target.value), placeholder: "Ej: TRX123456" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "file", children: "Captura de pantalla del pago" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "file", type: "file", accept: "image/*", onChange: (e) => setFile(e.target.files?.[0] ?? null) }),
          file && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: file.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: !file || loading, className: "w-full bg-gradient-primary", size: "lg", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }),
          " Enviando..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-1 h-4 w-4" }),
          " Enviar comprobante"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Validaremos tu pago manualmente y activaremos el destacado en pocas horas." })
      ] }) })
    ] })
  ] });
}
export {
  PromocionarPage as component
};
