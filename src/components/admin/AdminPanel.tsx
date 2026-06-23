import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, ShieldX, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { promoEndDate } from "@/lib/promo-plans";

interface Tx {
  id: string;
  user_id: string;
  producto_id: string;
  monto: number;
  plan: string;
  estado_pago: string;
  created_at: string;
  comprobante_url: string | null;
  referencia: string | null;
  notas_admin: string | null;
  productos: { titulo: string } | null;
  profiles: { nombre_completo: string | null } | null;
}

export function AdminPanel() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadTransactions();
  }, [user?.id]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("transacciones")
        .select(
          `
          *,
          productos (titulo),
          profiles (nombre_completo)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTxs((data as unknown as Tx[]) ?? []);
    } catch {
      toast.error("Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  };

  const verComprobante = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("comprobantes")
        .createSignedUrl(path, 3600);
      if (error || !data?.signedUrl) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("No se pudo abrir el comprobante");
    }
  };

  const onAprobar = async (tx: Tx) => {
    setWorking(tx.id);
    try {
      const { error: txErr } = await supabase
        .from("transacciones")
        .update({ estado_pago: "COMPLETADO" })
        .eq("id", tx.id);
      if (txErr) throw txErr;

      const { error: prodErr } = await supabase
        .from("productos")
        .update({
          es_destacado: true,
          promocionado_hasta: promoEndDate(tx.plan),
          tipo_promocion: tx.plan,
        })
        .eq("id", tx.producto_id);
      if (prodErr) throw prodErr;

      toast.success("¡Publicidad aprobada y activada! 🎉");
      await loadTransactions();
    } catch {
      toast.error("Error al aprobar transacción");
    } finally {
      setWorking(null);
    }
  };

  const onRechazar = async (id: string) => {
    const motivo = prompt("Motivo del rechazo (Ej: Comprobante borroso):") ?? "";
    if (motivo.trim() === "") {
      toast.error("Debes indicar un motivo para el rechazo.");
      return;
    }
    setWorking(id);
    try {
      const mensajeRechazo = `Tu pago de publicidad ha sido RECHAZADO ❌. Motivo: ${motivo}`;
      const { error } = await supabase
        .from("transacciones")
        .update({ estado_pago: "RECHAZADO", notas_admin: mensajeRechazo })
        .eq("id", id);
      if (error) throw error;
      toast.success("Transacción rechazada.");
      await loadTransactions();
    } catch {
      toast.error("Error al rechazar transacción");
    } finally {
      setWorking(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-md py-20 text-center">
          <Lock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h1 className="text-xl font-bold">Acceso denegado</h1>
        </div>
      </div>
    );
  }

  const pendientes = txs.filter((t) => t.estado_pago === "PENDIENTE");
  const otras = txs.filter((t) => t.estado_pago !== "PENDIENTE");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Panel de administración</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
              Pendientes ({pendientes.length})
            </h2>
            <div className="space-y-3">
              {pendientes.length === 0 && (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Sin pagos pendientes 🎉
                </p>
              )}
              {pendientes.map((t) => (
                <Card key={t.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{t.plan}</Badge>
                      <span className="font-bold">${Number(t.monto).toFixed(2)}</span>
                      <span className="text-sm">— {t.productos?.titulo ?? "?"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.profiles?.nombre_completo ?? "Usuario"} ·{" "}
                      {new Date(t.created_at).toLocaleString()}
                      {t.referencia && <> · Ref: {t.referencia}</>}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {t.comprobante_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verComprobante(t.comprobante_url!)}
                        >
                          <Eye className="mr-1 h-4 w-4" /> Ver comprobante
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-success text-success-foreground hover:bg-success/90"
                        disabled={working === t.id}
                        onClick={() => onAprobar(t)}
                      >
                        {working === t.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="mr-1 h-4 w-4" /> Aprobar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={working === t.id}
                        onClick={() => onRechazar(t.id)}
                      >
                        <ShieldX className="mr-1 h-4 w-4" /> Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="mb-2 mt-8 text-sm font-semibold uppercase text-muted-foreground">
              Historial ({otras.length})
            </h2>
            <div className="space-y-2">
              {otras.map((t) => (
                <Card key={t.id}>
                  <CardContent className="flex flex-col gap-1 p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={t.estado_pago === "COMPLETADO" ? "default" : "destructive"}>
                        {t.estado_pago}
                      </Badge>
                      <Badge variant="outline">{t.plan}</Badge>
                      <span className="font-bold">${Number(t.monto).toFixed(2)}</span>
                      <span className="text-muted-foreground">
                        — {t.productos?.titulo ?? "?"} · {t.profiles?.nombre_completo ?? ""}
                      </span>
                    </div>
                    {t.notas_admin && (
                      <p className="mt-1 rounded bg-muted/50 px-2 py-1 text-xs italic text-muted-foreground">
                        {t.notas_admin}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
