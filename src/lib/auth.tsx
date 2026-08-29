import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  roleLoading: false,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      setIsAdmin(false);
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
      setIsAdmin(false);
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
        setIsAdmin(false);
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

  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    let active = true;
    setRoleLoading(true);

    const refreshRole = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .limit(50);

        if (!active) return;

        const roles = Array.isArray(data)
          ? data.map((row) => row?.role).filter((role): role is string => Boolean(role))
          : [];

        setIsAdmin(!error && roles.includes("admin"));
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setRoleLoading(false);
      }
    };

    refreshRole();

    return () => {
      active = false;
    };
  }, [session?.user?.id, session?.access_token]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        roleLoading,
        isAdmin,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
