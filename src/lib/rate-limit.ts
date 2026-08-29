/**
 * Simple in-memory rate limiting utility
 * Prevents brute force attacks on authentication endpoints
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  key: string;
  limit: number;
  window: number; // segundos
}

interface RateLimitResult {
  success: boolean;
  resetIn?: number; // ms hasta reset
}

// Almacenamiento en memoria
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Verifica y aplica rate limit
 * @example
 * const result = await checkRateLimit({
 *   key: `signin:${email}`,
 *   limit: 5,
 *   window: 60 * 15
 * });
 */
export async function checkRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const now = Date.now();
  const stored = rateLimitStore.get(config.key);

  // Si no existe o expiró, crear nuevo
  if (!stored || now >= stored.resetAt) {
    rateLimitStore.set(config.key, {
      count: 1,
      resetAt: now + config.window * 1000,
    });
    return { success: true };
  }

  // Si no ha excedido límite, incrementar
  if (stored.count < config.limit) {
    stored.count++;
    return { success: true };
  }

  // Excedió límite
  return {
    success: false,
    resetIn: stored.resetAt - now,
  };
}

// Limpiar entradas expiradas cada hora
if (typeof window === "undefined") {
  // Solo en servidor
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now >= value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 60 * 1000);

  // Cleanup en shutdown
  if (global.process) {
    process.on("exit", () => clearInterval(cleanupInterval));
  }
}
