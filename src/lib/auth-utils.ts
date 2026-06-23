import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { normalizeWhatsapp } from "@/lib/whatsapp";

/** Convierte entrada local ecuatoriana a formato E.164 (+593...) para Supabase Auth. */
export function toE164Phone(raw: string): string | null {
  const digits = normalizeWhatsapp(raw);
  if (!digits) return null;
  return `+${digits}`;
}

/** Cuenta verificada por SMS (confirmación obligatoria vía celular). */
export function isUserVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return !!user.phone_confirmed_at;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  return !error && !!data;
}

/** Envía OTP SMS al teléfono (login o registro). */
export async function sendPhoneOtp(phone: string) {
  return supabase.auth.signInWithOtp({
    phone,
    options: { channel: "sms" },
  });
}

/** Verifica código SMS recibido en el celular. */
export async function verifyPhoneOtp(phone: string, token: string) {
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
}

/** Vincula teléfono a cuenta existente (correo/OAuth) y envía OTP. */
export async function linkPhoneToAccount(phone: string) {
  return supabase.auth.updateUser({ phone });
}

/** Confirma cambio/vinculación de teléfono con OTP. */
export async function verifyPhoneLink(phone: string, token: string) {
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: "phone_change",
  });
}
