/**
 * Normaliza un número de teléfono al formato internacional E.164 sin "+"
 * que requiere wa.me. Asume Ecuador (+593) cuando no se detecta otro país.
 *
 * Ejemplos:
 *   "0991234567"       -> "593991234567"
 *   "991234567"        -> "593991234567"
 *   "+593 99 123 4567" -> "593991234567"
 *   "00593991234567"   -> "593991234567"
 *   "+1 415 555 0100"  -> "14155550100"
 */
export function normalizeWhatsapp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let s = raw.trim();
  // 00 internacional -> sin nada
  if (s.startsWith("00")) s = s.slice(2);
  // quitar el "+"
  if (s.startsWith("+")) s = s.slice(1);
  // dejar solo dígitos
  s = s.replace(/\D/g, "");
  if (!s) return null;

  // Si parece ecuatoriano local (empieza con 0 y 10 dígitos: 0991234567)
  if (s.length === 10 && s.startsWith("0")) {
    s = "593" + s.slice(1);
  }
  // Móvil local sin 0 (9 dígitos empezando con 9): 991234567
  else if (s.length === 9 && s.startsWith("9")) {
    s = "593" + s;
  }
  // Fijo local sin 0 (8 dígitos, p. ej. Guayas 4xxxxxxx)
  else if (s.length === 8) {
    s = "593" + s;
  }

  // Validación mínima E.164: 8-15 dígitos
  if (s.length < 8 || s.length > 15) return null;
  return s;
}

export function buildWhatsappLink(raw: string | null | undefined, message: string): string | null {
  const num = normalizeWhatsapp(raw);
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
