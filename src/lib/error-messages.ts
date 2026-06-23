const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Confirma tu correo antes de iniciar sesión.",
  "User already registered": "Ya existe una cuenta con este correo.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 8 caracteres.",
  "Token has expired or is invalid": "El enlace expiró. Solicita uno nuevo.",
  "Phone number already registered": "Este número ya está registrado.",
  "Invalid OTP": "Código incorrecto. Intenta de nuevo.",
  "SMS sending failed": "No se pudo enviar el SMS. Intenta más tarde.",
};

const TECHNICAL_PATTERN =
  /duplicate key|violates|constraint|relation|column|syntax|SQL|JWT|permission denied|row-level security|check_violation|PostgrestError/i;

function logDevError(error: unknown) {
  if (import.meta.env.DEV && error != null) {
    console.error(error);
  }
}

function isTechnicalMessage(msg: string): boolean {
  return TECHNICAL_PATTERN.test(msg);
}

/** Convierte errores internos en mensajes seguros para mostrar al usuario. */
export function toUserMessage(error: unknown, fallback: string): string {
  logDevError(error);

  const msg =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String((error as { message: string }).message)
        : null;

  if (!msg) return fallback;
  if (KNOWN_MESSAGES[msg]) return KNOWN_MESSAGES[msg];
  if (isTechnicalMessage(msg)) return fallback;
  if (msg.length <= 120 && !msg.includes("http")) return msg;

  return fallback;
}
