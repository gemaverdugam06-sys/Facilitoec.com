import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type ModerationRow = {
  id: string;
  estado_moderacion?: string | null;
};

export function useAdminNotifications() {
  const { user, isAdmin, roleLoading } = useAuth();
  const userId = user?.id;
  const [pendingProducts, setPendingProducts] = useState(0);

  useEffect(() => {
    if (!userId || roleLoading || !isAdmin) {
      setPendingProducts(0);
      return;
    }

    let active = true;

    const loadPendingProducts = async () => {
      const { data, error } = await supabase.from("productos").select("id, estado_moderacion");

      if (!active || error) return;

      const pending = ((data as unknown as ModerationRow[]) ?? []).filter(
        (product) => product.estado_moderacion === "pendiente",
      ).length;
      setPendingProducts(pending);
    };

    loadPendingProducts();
    const interval = window.setInterval(loadPendingProducts, 30_000);
    const channel = supabase
      .channel(`admin-product-notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "productos" },
        loadPendingProducts,
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "productos" },
        loadPendingProducts,
      );
    channel.subscribe();

    return () => {
      active = false;
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin, roleLoading]);

  return { pendingProducts };
}
