import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createUnavailableSupabaseClient() {
  const unavailableMessage = "Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY para habilitar el backend.";
  const createQueryBuilder = () => {
    const promise = Promise.resolve({ data: [], error: { message: unavailableMessage } });
    return Object.assign(promise, {
      select() {
        return this;
      },
      order() {
        return this;
      },
      eq() {
        return this;
      },
      ilike() {
        return this;
      },
      gte() {
        return this;
      },
      lte() {
        return this;
      },
      in() {
        return this;
      },
      limit() {
        return this;
      }
    });
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("supabase_down", "1");
    } catch {
    }
  }
  const authMethods = {
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe() {
            }
          }
        }
      };
    },
    getSession() {
      return Promise.resolve({ data: { session: null }, error: null });
    },
    getUser() {
      return Promise.resolve({ data: { user: null }, error: null });
    },
    getClaims() {
      return Promise.resolve({ data: { claims: null }, error: null });
    },
    signOut() {
      return Promise.resolve({ error: null });
    },
    signInWithOAuth() {
      return Promise.resolve({ data: { provider: null }, error: null });
    },
    signInWithPassword() {
      return Promise.resolve({ data: { session: null, user: null }, error: null });
    },
    signInWithOtp() {
      return Promise.resolve({ data: { session: null, user: null }, error: null });
    },
    signUp() {
      return Promise.resolve({ data: { session: null, user: null }, error: null });
    },
    resetPasswordForEmail() {
      return Promise.resolve({ data: null, error: null });
    },
    verifyOtp() {
      return Promise.resolve({ data: { session: null, user: null }, error: null });
    },
    updateUser() {
      return Promise.resolve({ data: { user: null }, error: null });
    }
  };
  return {
    auth: authMethods,
    rpc() {
      return Promise.resolve({ data: null, error: { message: unavailableMessage } });
    },
    from() {
      return createQueryBuilder();
    },
    channel() {
      return {
        subscribe() {
          return {
            unsubscribe() {
            }
          };
        }
      };
    },
    removeChannel() {
    },
    getSession() {
      return Promise.resolve({ data: { session: null }, error: null });
    },
    signOut() {
      return Promise.resolve({ error: null });
    },
    __unavailable: true
  };
}
function createSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Set them in your deployment environment.`;
    console.warn(`[Supabase] ${message}`);
    return createUnavailableSupabaseClient();
  }
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
