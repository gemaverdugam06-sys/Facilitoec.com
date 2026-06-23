/** Días de promoción por plan (debe coincidir con promocionar.$productoId.tsx). */
export const PROMO_PLAN_DAYS: Record<string, number> = {
  FLASH: 2,
  BASICO: 5,
  PLUS: 10,
  PRO: 20,
  MEGA: 30,
};

export function promoEndDate(plan: string, from = new Date()): string {
  const days = PROMO_PLAN_DAYS[plan] ?? 7;
  const end = new Date(from);
  end.setDate(end.getDate() + days);
  return end.toISOString();
}
