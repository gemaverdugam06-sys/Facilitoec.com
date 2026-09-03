export const SUPPORT_CATEGORIES = [
  { value: "problema_tecnico", label: "Problema técnico" },
  { value: "cuenta", label: "Cuenta" },
  { value: "inicio_sesion", label: "Inicio de sesión" },
  { value: "pagos", label: "Pagos" },
  { value: "funcionalidad", label: "Funcionalidad" },
  { value: "reportar_error", label: "Reportar un error" },
  { value: "otro", label: "Otro" },
] as const;

export type SupportCategoryValue = (typeof SUPPORT_CATEGORIES)[number]["value"];
