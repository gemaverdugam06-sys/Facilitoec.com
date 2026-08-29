import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { normalizeWhatsapp } from "@/lib/whatsapp";

/** Convierte entrada local ecuatoriana a formato E.164 (+593...) para Supabase Auth. */
export function toE164Phone(raw: string): string | null {
  const digits = normalizeWhatsapp(raw);
  if (!digits) return null;
  return `+${digits}`;
}

/** Cuenta verificada cuando confirma correo o teléfono. */
export function isUserVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return !!(user.email_confirmed_at || user.phone_confirmed_at);
}

export async function getUserRole(userId: string): Promise<string | null> {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .limit(50);

  if (error) {
    console.error("Error consultando el rol del usuario en user_roles:", error);
    return null;
  }

  const roles = Array.isArray(data) ? data.map((row) => row?.role).filter(Boolean) : [];
  return roles.includes("admin") ? "admin" : roles[0] ?? null;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin";
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
