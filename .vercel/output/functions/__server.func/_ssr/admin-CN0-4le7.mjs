import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
const AdminPanel = reactExports.lazy(() => import("./AdminPanel-CmqnLbgc.mjs").then((m) => ({
  default: m.AdminPanel
})));
function AdminPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPanel, {}) });
}
export {
  AdminPage as component
};
