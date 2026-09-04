import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type PurchaseNotification = {
  id: string;
  compra_id: string | null;
  mensaje: string;
  tipo: string;
  leido: boolean | null;
  created_at: string | null;
};

export function usePurchaseNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("notificaciones")
        .select("id, compra_id, mensaje, tipo, leido, created_at")
        .eq("user_id", user.id)
        .in("tipo", ["compra_solicitada", "compra_actualizada"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (active) setNotifications((data as PurchaseNotification[]) ?? []);
    };

    void load();
    const channel = supabase
      .channel(`purchase-notifications:${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificaciones", filter: `user_id=eq.${user.id}` },
        () => void load(),
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const decidePurchase = async (notification: PurchaseNotification, estado: "CONFIRMADA" | "CANCELADA") => {
    if (!notification.compra_id) return;
    const { error } = await supabase
      .from("compras")
      .update({ estado, confirmed_at: estado === "CONFIRMADA" ? new Date().toISOString() : null })
      .eq("id", notification.compra_id);

    if (error) {
      toast.error("No se pudo actualizar la solicitud");
      return;
    }

    setNotifications((current) => current.filter((item) => item.id !== notification.id));
    toast.success(estado === "CONFIRMADA" ? "Compra aceptada" : "Solicitud rechazada");
  };

  return { notifications, decidePurchase };
}
