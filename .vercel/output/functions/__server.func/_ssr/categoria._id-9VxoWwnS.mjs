import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { E as ECUADOR, C as CategoryNav, P as PROVINCIAS, a as ProductCard } from "./ecuador-5VU4O1Te.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import { d as Route$b } from "./router-CStixWKO.mjs";
import "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { b as Search, c as SlidersHorizontal, X, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function CategoriaPage() {
  const {
    id
  } = Route$b.useParams();
  const [productos, setProductos] = reactExports.useState([]);
  const [categorias, setCategorias] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [provincia, setProvincia] = reactExports.useState("Todas");
  const [ciudad, setCiudad] = reactExports.useState("Todas");
  const [minP, setMinP] = reactExports.useState("");
  const [maxP, setMaxP] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const cat = categorias.find((c) => c.id === id);
  reactExports.useEffect(() => {
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
  const hasFilters = reactExports.useMemo(() => provincia !== "Todas" || ciudad !== "Todas" || !!minP || !!maxP || !!q.trim(), [provincia, ciudad, minP, maxP, q]);
  reactExports.useEffect(() => {
    setLoading(true);
    const run = async () => {
      let query = supabase.from("productos").select("id, titulo, precio, moneda, ciudad, imagenes, es_destacado").eq("activo", true).eq("categoria_id", id).order("es_destacado", {
        ascending: false
      }).order("created_at", {
        ascending: false
      }).limit(100);
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
  }, [id, q, provincia, ciudad, minP, maxP]);
  const clear = () => {
    setProvincia("Todas");
    setCiudad("Todas");
    setMinP("");
    setMaxP("");
    setQ("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryNav, { categorias, activa: id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { className: "my-6 text-3xl font-extrabold logo-heading md:text-4xl", initial: {
        y: 8,
        opacity: 0
      }, animate: {
        y: 0,
        opacity: 1
      }, transition: {
        duration: 0.4
      }, children: cat?.nombre ?? "Categoría" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar en esta categoría...", className: "h-11 pl-10" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: hasFilters ? "default" : "outline", size: "sm", onClick: () => setShowFilters((v) => !v), className: hasFilters ? "bg-gradient-primary" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "mr-1 h-4 w-4" }),
          " Filtros"
        ] }),
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clear, children: [
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
      showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-4 glass-border soft-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-muted-foreground", children: "Provincia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: provincia, onValueChange: (v) => {
            setProvincia(v);
            setCiudad("Todas");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todas", children: "Todas" }),
              PROVINCIAS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-muted-foreground", children: "Ciudad / Cantón" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ciudad, onValueChange: setCiudad, disabled: provincia === "Todas", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: provincia === "Todas" ? "Elige provincia" : "Todas" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todas", children: "Todas" }),
              ciudadesDeProv.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-muted-foreground", children: "Precio mínimo (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: minP, onChange: (e) => setMinP(e.target.value), placeholder: "0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold text-muted-foreground", children: "Precio máximo (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: maxP, onChange: (e) => setMaxP(e.target.value), placeholder: "Sin límite" })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
        " Cargando..."
      ] }) : productos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground", children: "No hay productos con esos filtros en esta categoría." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", children: productos.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p }, p.id)) })
    ] })
  ] });
}
export {
  CategoriaPage as component
};
