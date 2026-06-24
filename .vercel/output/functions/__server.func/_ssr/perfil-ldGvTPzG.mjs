import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { a as useAuth, u as useI18n, t as toUserMessage } from "./router-CStixWKO.mjs";
import { u as useSignedUrl } from "./storage-CdR5AvBn.mjs";
import { H as Header } from "./Header-C9Nt1IUt.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-B2WPZ-Hv.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-FlEjym4Y.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, q as Camera } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
function PerfilPage() {
  const {
    user
  } = useAuth();
  const {
    t
  } = useI18n();
  const [nombre, setNombre] = reactExports.useState("");
  const [ciudad, setCiudad] = reactExports.useState("");
  const [telefono, setTelefono] = reactExports.useState("");
  const [avatarPath, setAvatarPath] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const avatarUrl = useSignedUrl("avatars", avatarPath);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("nombre_completo, ciudad, avatar_url").eq("id", user.id).single().then(({
      data
    }) => {
      if (data) {
        setNombre(data.nombre_completo ?? "");
        setCiudad(data.ciudad ?? "");
        setAvatarPath(data.avatar_url ?? null);
      }
    });
    supabase.from("profiles_private").select("telefono").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data) setTelefono(data.telefono ?? "");
    });
  }, [user?.id]);
  const onUpload = async (file) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const {
      error: upErr
    } = await supabase.storage.from("avatars").upload(path, file, {
      contentType: file.type
    });
    if (upErr) {
      setUploading(false);
      return toast.error(toUserMessage(upErr, "No se pudo subir la foto."));
    }
    const {
      error
    } = await supabase.from("profiles").update({
      avatar_url: path
    }).eq("id", user.id);
    setUploading(false);
    if (error) return toast.error(toUserMessage(error, "No se pudo guardar el avatar."));
    setAvatarPath(path);
    toast.success(t("saved"));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      nombre_completo: nombre,
      ciudad
    }).eq("id", user.id);
    const {
      error: pErr
    } = await supabase.from("profiles_private").upsert({
      id: user.id,
      telefono
    });
    setSaving(false);
    if (error || pErr) return toast.error(toUserMessage(error ?? pErr, "No se pudo actualizar el perfil."));
    toast.success(t("profile_updated"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto max-w-xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: t("profile") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-24 w-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl ?? void 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-2xl", children: nombre[0] ?? "?" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:opacity-90", children: [
              uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => e.target.files?.[0] && onUpload(e.target.files[0]) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user?.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("full_name") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: nombre, onChange: (e) => setNombre(e.target.value), required: true, maxLength: 100 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("city") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: ciudad, onChange: (e) => setCiudad(e.target.value), maxLength: 80 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("phone") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", value: telefono, onChange: (e) => setTelefono(e.target.value), maxLength: 20, placeholder: "+593..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, className: "w-full bg-gradient-primary", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : t("update_profile") })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PerfilPage as component
};
