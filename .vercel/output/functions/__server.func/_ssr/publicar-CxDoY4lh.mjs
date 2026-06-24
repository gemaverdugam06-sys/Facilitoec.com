import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { u as useI18n, a as useAuth, t as toUserMessage } from "./router-CStixWKO.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { T as Textarea } from "./textarea-F69quoCd.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { X, p as ImagePlus, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, l as literalType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const schema = objectType({
  titulo: stringType().trim().min(3, "Mínimo 3 caracteres").max(120),
  descripcion: stringType().trim().min(10, "Describe mejor tu producto").max(2e3),
  precio: numberType().nonnegative().max(9999999),
  categoria_id: stringType().min(1),
  ciudad: stringType().trim().min(2).max(80),
  estado: enumType(["nuevo", "usado"]),
  whatsapp: stringType().trim().max(20).optional().or(literalType(""))
});
function PublicarPage() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [categorias, setCategorias] = reactExports.useState([]);
  const [titulo, setTitulo] = reactExports.useState("");
  const [descripcion, setDescripcion] = reactExports.useState("");
  const [precio, setPrecio] = reactExports.useState("");
  const [categoriaId, setCategoriaId] = reactExports.useState("");
  const [ciudad, setCiudad] = reactExports.useState("");
  const [estado, setEstado] = reactExports.useState("nuevo");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [files, setFiles] = reactExports.useState([]);
  const [previews, setPreviews] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.from("categorias").select("id, nombre").order("orden").then(({
      data
    }) => {
      if (data) setCategorias(data);
    });
  }, []);
  const addFiles = (list) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 8 - files.length);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setPreviews((prev) => [...prev, r.result]);
      r.readAsDataURL(f);
    });
  };
  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (files.length === 0) {
      toast.error("Agrega al menos una foto");
      return;
    }
    const parsed = schema.safeParse({
      titulo,
      descripcion,
      precio: parseFloat(precio || "0"),
      categoria_id: categoriaId,
      ciudad,
      estado,
      whatsapp
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const uploadedPaths = [];
    for (const f of files) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const {
        error: error2
      } = await supabase.storage.from("productos").upload(path, f, {
        cacheControl: "3600",
        upsert: false,
        contentType: f.type
      });
      if (error2) {
        toast.error(toUserMessage(error2, "Error al subir la imagen. Intenta de nuevo."));
        setLoading(false);
        return;
      }
      uploadedPaths.push(path);
    }
    const {
      data,
      error
    } = await supabase.from("productos").insert({
      user_id: user.id,
      titulo: parsed.data.titulo,
      descripcion: parsed.data.descripcion,
      precio: parsed.data.precio,
      categoria_id: parsed.data.categoria_id,
      ciudad: parsed.data.ciudad,
      estado: parsed.data.estado,
      whatsapp: parsed.data.whatsapp || null,
      imagenes: uploadedPaths
    }).select("id").single();
    setLoading(false);
    if (error) {
      toast.error(toUserMessage(error, "No se pudo publicar el anuncio. Intenta de nuevo."));
      return;
    }
    toast.success("¡Anuncio publicado!");
    nav({
      to: "/producto/$id",
      params: {
        id: data.id
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto max-w-2xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: t("publish_ad") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("images") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
            previews.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden rounded-lg border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", className: "h-full w-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeFile(i), className: "absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, i)),
            files.length < 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground hover:bg-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: t("add_images") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => addFiles(e.target.files) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "titulo", children: t("title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "titulo", required: true, value: titulo, onChange: (e) => setTitulo(e.target.value), maxLength: 120 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", children: t("description") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "desc", required: true, rows: 4, value: descripcion, onChange: (e) => setDescripcion(e.target.value), maxLength: 2e3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "precio", children: [
              t("price"),
              " (USD)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "precio", type: "number", required: true, min: "0", step: "0.01", value: precio, onChange: (e) => setPrecio(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("condition") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: estado, onValueChange: (v) => setEstado(v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nuevo", children: t("new_item") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "usado", children: t("used_item") })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("category") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoriaId, onValueChange: setCategoriaId, required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecciona una categoría" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categorias.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.nombre }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ciudad", children: t("city") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ciudad", required: true, value: ciudad, onChange: (e) => setCiudad(e.target.value), maxLength: 80 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "wa", children: t("phone") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "wa", type: "tel", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "+593...", maxLength: 20 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-gradient-primary", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          " ",
          t("publishing")
        ] }) : t("publish_ad") })
      ] }) })
    ] }) })
  ] });
}
export {
  PublicarPage as component
};
