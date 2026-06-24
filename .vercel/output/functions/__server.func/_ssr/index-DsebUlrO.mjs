import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { L as Logo } from "./Logo-Dar0Ngh0.mjs";
import { E as ECUADOR, C as CategoryNav, P as PROVINCIAS, a as ProductCard } from "./ecuador-5VU4O1Te.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import { u as useI18n } from "./router-CStixWKO.mjs";
import "../_libs/sonner.mjs";
import { b as Search, P as Plus, c as SlidersHorizontal, X, d as Sparkles, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "./badge-YM7oB01y.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./storage-CdR5AvBn.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function Home() {
  const {
    t
  } = useI18n();
  const [productos, setProductos] = reactExports.useState([]);
  const [categorias, setCategorias] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [provincia, setProvincia] = reactExports.useState("Todas");
  const [ciudad, setCiudad] = reactExports.useState("Todas");
  const [minP, setMinP] = reactExports.useState("");
  const [maxP, setMaxP] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    supabase.rpc("expire_promociones").then(() => {
    });
    supabase.from("categorias").select("id, nombre, icono").order("orden").then(({
      data
    }) => {
      if (data) setCategorias(data);
    });
  }, []);
  const ciudadesDeProv = reactExports.useMemo(() => {
    if (provincia === "Todas") return [];
    return ECUADOR[provincia] ?? [];
  }, [provincia]);
  const hasFilters = reactExports.useMemo(() => provincia !== "Todas" || ciudad !== "Todas" || !!minP || !!maxP, [provincia, ciudad, minP, maxP]);
  reactExports.useEffect(() => {
    setLoading(true);
    const run = async () => {
      let query = supabase.from("productos").select("id, titulo, precio, moneda, ciudad, imagenes, es_destacado").eq("activo", true).order("es_destacado", {
        ascending: false
      }).order("created_at", {
        ascending: false
      }).limit(60);
      if (q.trim()) query = query.ilike("titulo", `%${q.trim()}%`);
      if (ciudad && ciudad !== "Todas") {
        query = query.eq("ciudad", ciudad);
      } else if (provincia !== "Todas") {
        const cities = ECUADOR[provincia] ?? [];
        if (cities.length) query = query.in("ciudad", cities);
      }
      const min = parseFloat(minP);
      if (!isNaN(min)) query = query.gte("precio", min);
      const max = parseFloat(maxP);
      if (!isNaN(max)) query = query.lte("precio", max);
      const {
        data
      } = await query;
      setProductos(data ?? []);
      setLoading(false);
    };
    const tm = setTimeout(run, 250);
    return () => clearTimeout(tm);
  }, [q, provincia, ciudad, minP, maxP]);
  const clear = () => {
    setProvincia("Todas");
    setCiudad("Todas");
    setMinP("");
    setMaxP("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_40%),linear-gradient(180deg,_#f0ebff_0%,_#e9e0ff_100%)] text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden border-b bg-gradient-hero text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-[2.5rem] border border-slate-600 shadow-lg bg-slate-900 p-10 md:p-14 shadow-card ring-1 ring-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-3 rounded-full border border-primary bg-primary text-primary-foreground px-4 py-2 text-sm shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-8 w-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "FACILITOEC" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-extrabold tracking-tight md:text-7xl md:leading-tight logo-heading text-white drop-shadow-lg", children: t("tagline") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-3xl text-slate-200 text-xl md:text-2xl leading-relaxed drop-shadow-lg", children: "Compra y vende en Ecuador de manera simple. Encuentra productos cerca de ti y publica tu anuncio gratis en segundos." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col gap-4 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: t("search_placeholder"), className: "h-12 rounded-2xl bg-white px-4 pl-10 text-foreground placeholder-slate-400 shadow-sm shadow-black/10 border-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "secondary", className: "h-12 rounded-2xl px-8 btn-cta font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/publicar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-5 w-5" }),
          t("publish")
        ] }) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryNav, { categorias }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 mt-6 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: hasFilters ? "default" : "outline", size: "sm", onClick: () => setShowFilters((v) => !v), className: hasFilters ? "bg-gradient-primary" : "border border-violet-200 bg-white text-slate-900 shadow-[0_8px_20px_rgba(124,58,237,0.08)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "mr-1 h-4 w-4" }),
          " Filtros",
          " ",
          hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 rounded-full bg-primary px-1.5 text-[10px]", children: "●" })
        ] }),
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clear, className: "border border-violet-200 bg-white text-slate-900 shadow-[0_8px_20px_rgba(124,58,237,0.08)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-4 w-4" }),
          " Limpiar"
        ] }),
        provincia !== "Todas" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs", children: [
          "🗺️ ",
          provincia
        ] }),
        ciudad !== "Todas" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs", children: [
          "📍 ",
          ciudad
        ] }),
        (minP || maxP) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs", children: [
          "$",
          minP || "0",
          " - $",
          maxP || "∞"
        ] })
      ] }),
      showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-3 rounded-[1.25rem] border border-violet-100 bg-white p-4 shadow-[0_10px_30px_rgba(124,58,237,0.08)] sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-violet-700", children: "Provincia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: provincia, onValueChange: (v) => {
            setProvincia(v);
            setCiudad("Todas");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-violet-200 bg-white text-slate-900 shadow-[0_6px_16px_rgba(124,58,237,0.06)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-violet-100 bg-white text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.12)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todas", className: "text-slate-900 focus:bg-violet-50 focus:text-violet-900", children: "Todas" }),
              PROVINCIAS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, className: "text-slate-900 focus:bg-violet-50 focus:text-violet-900", children: p }, p))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-violet-700", children: "Ciudad / Cantón" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ciudad, onValueChange: setCiudad, disabled: provincia === "Todas", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-violet-200 bg-white text-slate-900 shadow-[0_6px_16px_rgba(124,58,237,0.06)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: provincia === "Todas" ? "Elige provincia" : "Todas" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-violet-100 bg-white text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.12)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todas", className: "text-slate-900 focus:bg-violet-50 focus:text-violet-900", children: "Todas" }),
              ciudadesDeProv.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, className: "text-slate-900 focus:bg-violet-50 focus:text-violet-900", children: c }, c))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-violet-700", children: "Precio mínimo (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: minP, onChange: (e) => setMinP(e.target.value), placeholder: "0", className: "border-violet-200 bg-white text-slate-900 shadow-[0_6px_16px_rgba(124,58,237,0.06)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-violet-700", children: "Precio máximo (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: maxP, onChange: (e) => setMaxP(e.target.value), placeholder: "Sin límite", className: "border-violet-200 bg-white text-slate-900 shadow-[0_6px_16px_rgba(124,58,237,0.06)]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Recomendados para ti" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
        " Cargando..."
      ] }) : productos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground", children: "No hay productos con esos filtros. Prueba con otros." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", children: productos.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t py-8 text-center text-sm text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " FACILITOEC"
    ] })
  ] });
}
export {
  Home as component
};
