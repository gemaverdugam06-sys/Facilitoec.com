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
      const { data: rows } = await supabase
        .from("notificaciones")
        .select("id, compra_id, mensaje, tipo, leido, created_at")
        .eq("user_id", user.id)
        .in("tipo", ["compra_solicitada", "compra_actualizada"])
        .order("created_at", { ascending: false })
        .limit(20);

      const notificationsRows = (rows as PurchaseNotification[]) ?? [];
      const compraIds = notificationsRows
        .map((item) => item.compra_id)
        .filter((value): value is string => Boolean(value));

      let purchaseStateById = new Map<string, string>();
      if (compraIds.length > 0) {
        const { data: compras } = await supabase
          .from("compras")
          .select("id, estado")
          .in("id", compraIds);

        for (const compra of compras ?? []) {
          purchaseStateById.set(compra.id, compra.estado);
        }
      }

      const filtered = notificationsRows.filter((item) => {
        if (!item.compra_id) return true;
        const compraEstado = purchaseStateById.get(item.compra_id);
        return !compraEstado || compraEstado === "PENDIENTE";
      });

      if (active) setNotifications(filtered);
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

    await supabase.from("notificaciones").update({ leido: true }).eq("id", notification.id);

    setNotifications((current) => current.filter((item) => item.id !== notification.id));
    toast.success(estado === "CONFIRMADA" ? "Compra aceptada" : "Solicitud rechazada");
  };

  return { notifications, decidePurchase };
}
