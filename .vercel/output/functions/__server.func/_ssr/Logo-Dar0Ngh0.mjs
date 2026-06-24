import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function Logo({ className = "h-9 w-9" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 48 48", className, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "facilito-logo-grad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#a78bfa" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#7c3aed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#5b21b6" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "2", width: "44", height: "44", rx: "12", fill: "url(#facilito-logo-grad)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M27 9 L15 27 H22 L20 39 L33 20 H26 L29 9 Z",
        fill: "white",
        stroke: "white",
        strokeWidth: "0.6",
        strokeLinejoin: "round"
      }
    )
  ] });
}
export {
  Logo as L
};
