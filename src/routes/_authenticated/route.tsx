import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isUserVerified } from "@/lib/auth-utils";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    if (!isUserVerified(data.user)) {
      throw redirect({ to: "/auth/verificar-telefono" });
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
