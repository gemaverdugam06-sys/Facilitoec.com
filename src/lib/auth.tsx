import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let settled = false;

    const finish = () => {
      if (!active || settled) return;
      settled = true;
      setLoading(false);
    };

    if ((supabase as typeof supabase & { __unavailable?: boolean }).__unavailable) {
      setSession(null);
      finish();
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      finish();
    });

    const timer = window.setTimeout(() => {
      if (!active) return;
      setSession(null);
      finish();
    }, 4000);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
        finish();
      })
      .catch(() => {
        if (!active) return;
        setSession(null);
        finish();
      })
      .finally(() => {
        if (typeof window !== "undefined") window.clearTimeout(timer);
      });

    return () => {
      active = false;
      if (typeof window !== "undefined") window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
