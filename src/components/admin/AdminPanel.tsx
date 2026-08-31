import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, ShieldX, Eye, Lock, Trash2, AlertCircle, Flag, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { promoEndDate } from "@/lib/promo-plans";
import { reportReasons } from "@/lib/reporting";

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

interface ProductoPendiente {
  id: string;
  titulo: string;
  descripcion: string;
  estado_moderacion: string;
  razon_rechazo: string | null;
  created_at: string;
  profiles: { nombre_completo: string | null } | null;
}

interface Reporte {
  id: string;
  reportero_id: string;
  tipo: string;
  objeto_id: string;
  razon: string;
  descripcion: string | null;
  estado: string;
  accion_tomada: string | null;
  created_at: string;
}

interface ReportedReview {
  id: string;
  calificacion: number;
  comentario: string | null;
  estado: string;
  vendedor_id: string;
  comprador_id: string;
  created_at: string;
}

const normalizePaymentState = (value: string | null | undefined) => {
  const raw = String(value ?? "").trim().toUpperCase();
  return raw.replace(/[-_\s]+/g, " ").replace(/\s+/g, " ").trim();
};

const isPendingState = (value?: string | null) => {
  const normalized = normalizePaymentState(value);
  return [
    "PENDIENTE",
    "PENDING",
    "EN REVISION",
    "EN REVISIÓN",
    "REVISION",
    "REVISIÓN",
    "EN PROCESO",
  ].includes(normalized);
};

const isCompletedState = (value?: string | null) => {
  const normalized = normalizePaymentState(value);
  return ["COMPLETADO", "COMPLETED", "APROBADO", "APPROVED", "ACEPTADO"].includes(normalized);
};

const isRejectedState = (value?: string | null) => {
  const normalized = normalizePaymentState(value);
  return ["RECHAZADO", "REJECTED", "CANCELADO", "RECHAZADA"].includes(normalized);
};

const isHistoryState = (value?: string | null) => isCompletedState(value) || isRejectedState(value);

export function AdminPanel() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [productosPendientes, setProductosPendientes] = useState<ProductoPendiente[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [reseniasReportadas, setReseniasReportadas] = useState<ReportedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadProductosPendientes();
      loadReportes();
      loadReseniasReportadas();
    }
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

  const loadProductosPendientes = async () => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(
          `
          id,
          titulo,
          descripcion,
          estado_moderacion,
          razon_rechazo,
          created_at,
          profiles (nombre_completo)
        `,
        )
        .eq("estado_moderacion", "pendiente")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setProductosPendientes((data as unknown as ProductoPendiente[]) ?? []);
    } catch (err) {
      console.error("Error al cargar productos pendientes:", err);
    }
  };

  const loadReportes = async () => {
    try {
      const { data, error } = await supabase
        .from("reportes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReportes((data as unknown as Reporte[]) ?? []);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
    }
  };

  const loadReseniasReportadas = async () => {
    try {
      const { data, error } = await supabase
        .from("reseñas_vendedores")
        .select("*")
        .eq("estado", "reportado")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReseniasReportadas((data as unknown as ReportedReview[]) ?? []);
    } catch (err) {
      console.error("Error al cargar reseñas reportadas:", err);
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

  const onEliminarComprobante = async (tx: Tx) => {
    if (!tx.comprobante_url) return;

    const ok = window.confirm("¿Deseas eliminar este comprobante adjunto?");
    if (!ok) return;

    try {
      const { error: removeError } = await supabase.storage
        .from("comprobantes")
        .remove([tx.comprobante_url]);
      if (removeError) throw removeError;

      const { error: updateError } = await supabase
        .from("transacciones")
        .update({ comprobante_url: null })
        .eq("id", tx.id);
      if (updateError) throw updateError;

      setTxs((prev) =>
        prev.map((item) => (item.id === tx.id ? { ...item, comprobante_url: null } : item)),
      );

      toast.success("Comprobante eliminado");
      await loadTransactions();
    } catch (error) {
      console.error("Error al eliminar comprobante:", error);
      toast.error("No se pudo eliminar el comprobante");
    }
  };

  const onAprobar = async (tx: Tx) => {
    setWorking(tx.id);
    const mensajeAprobado = "Tu pago ha sido aprobado correctamente.";
    const nuevoEstado = "COMPLETADO";

    setTxs((prev) =>
      prev.map((item) =>
        item.id === tx.id
          ? { ...item, estado_pago: nuevoEstado, notas_admin: mensajeAprobado }
          : item,
      ),
    );

    try {
      const { error: txErr } = await supabase
        .from("transacciones")
        .update({
          estado_pago: nuevoEstado,
          notas_admin: mensajeAprobado,
        })
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
    } catch (error) {
      console.error("Error al aprobar transacción:", error);
      setTxs((prev) =>
        prev.map((item) =>
          item.id === tx.id ? { ...item, estado_pago: tx.estado_pago, notas_admin: tx.notas_admin } : item,
        ),
      );
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
    const mensajeRechazo = `Tu pago ha sido rechazado. Revisa los detalles de tu pago. Motivo: ${motivo}`;
    const nuevoEstado = "RECHAZADO";

    setTxs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado_pago: nuevoEstado, notas_admin: mensajeRechazo } : item,
      ),
    );

    try {
      const { error } = await supabase
        .from("transacciones")
        .update({ estado_pago: nuevoEstado, notas_admin: mensajeRechazo })
        .eq("id", id);
      if (error) throw error;
      toast.success("Transacción rechazada.");
      await loadTransactions();
    } catch (error) {
      console.error("Error al rechazar transacción:", error);
      setTxs((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, estado_pago: "PENDIENTE", notas_admin: mensajeRechazo } : item,
        ),
      );
      toast.error("Error al rechazar transacción");
    } finally {
      setWorking(null);
    }
  };

  const onAprobarProducto = async (productoId: string) => {
    setWorking(productoId);
    try {
      const { error } = await supabase
        .from("productos")
        .update({ estado_moderacion: "aprobado" })
        .eq("id", productoId);

      if (error) throw error;
      toast.success("Producto aprobado");
      await loadProductosPendientes();
    } catch (err) {
      console.error("Error al aprobar producto:", err);
      toast.error("Error al aprobar producto");
    } finally {
      setWorking(null);
    }
  };

  const onRechazarProducto = async (productoId: string) => {
    const razon = prompt("Razón del rechazo:") ?? "";
    if (!razon.trim()) {
      toast.error("Debes indicar una razón");
      return;
    }

    setWorking(productoId);
    try {
      const { error } = await supabase
        .from("productos")
        .update({ estado_moderacion: "rechazado", razon_rechazo: razon })
        .eq("id", productoId);

      if (error) throw error;
      toast.success("Producto rechazado");
      await loadProductosPendientes();
    } catch (err) {
      console.error("Error al rechazar producto:", err);
      toast.error("Error al rechazar producto");
    } finally {
      setWorking(null);
    }
  };

  const onMarcarReporte = async (reporteId: string, nuevoEstado: "revisado" | "resuelto") => {
    setWorking(reporteId);
    try {
      const { error } = await supabase
        .from("reportes")
        .update({ estado: nuevoEstado })
        .eq("id", reporteId);

      if (error) throw error;
      toast.success(`Reporte marcado como ${nuevoEstado}`);
      await loadReportes();
    } catch (err) {
      console.error("Error al actualizar reporte:", err);
      toast.error("Error al actualizar reporte");
    } finally {
      setWorking(null);
    }
  };

  const onOcultarResena = async (resenaId: string) => {
    setWorking(resenaId);
    try {
      const { error } = await supabase
        .from("reseñas_vendedores")
        .update({ estado: "oculto" })
        .eq("id", resenaId);

      if (error) throw error;
      toast.success("Reseña ocultada");
      await loadReseniasReportadas();
    } catch (err) {
      console.error("Error al ocultarreseña:", err);
      toast.error("Error al ocultar reseña");
    } finally {
      setWorking(null);
    }
  };

  const onEliminarProducto = async (productoId: string, titulo: string) => {
    const ok = window.confirm(`¿Deseas eliminar permanentemente la publicación "${titulo}"?`);
    if (!ok) return;

    setWorking(productoId);
    try {
      const { error } = await supabase.from("productos").delete().eq("id", productoId);
      if (error) throw error;
      toast.success("Producto eliminado");
      await loadProductosPendientes();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      toast.error("No se pudo eliminar el producto");
    } finally {
      setWorking(null);
    }
  };

  const onEliminarResena = async (resenaId: string) => {
    const ok = window.confirm("¿Deseas eliminar esta reseña?");
    if (!ok) return;

    setWorking(resenaId);
    try {
      const { error } = await supabase.from("reseñas_vendedores").delete().eq("id", resenaId);
      if (error) throw error;
      toast.success("Reseña eliminada");
      await loadReseniasReportadas();
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
      toast.error("No se pudo eliminar la reseña");
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

  const pendientes = txs.filter((t) => isPendingState(t.estado_pago) && !isHistoryState(t.estado_pago));
  const otras = txs.filter((t) => !isPendingState(t.estado_pago) || isHistoryState(t.estado_pago));

  const reportesPendientes = reportes.filter((r) => r.estado === "pendiente");
  const reportesResueltos = reportes.filter((r) => r.estado !== "pendiente");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Panel de administración</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="transacciones" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transacciones">
                Transacciones ({pendientes.length})
              </TabsTrigger>
              <TabsTrigger value="moderacion">
                Productos ({productosPendientes.length})
              </TabsTrigger>
              <TabsTrigger value="reportes">
                Reportes ({reportesPendientes.length})
              </TabsTrigger>
              <TabsTrigger value="resenias">
                Reseñas ({reseniasReportadas.length})
              </TabsTrigger>
            </TabsList>

            {/* TRANSACCIONES TAB */}
            <TabsContent value="transacciones" className="space-y-4">
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
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verComprobante(t.comprobante_url!)}
                            >
                              <Eye className="mr-1 h-4 w-4" /> Ver comprobante
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => onEliminarComprobante(t)}
                            >
                              <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                            </Button>
                          </>
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
            </TabsContent>

            {/* MODERACIÓN TAB */}
            <TabsContent value="moderacion" className="space-y-4">
              {productosPendientes.length === 0 ? (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Sin productos pendientes de moderación 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {productosPendientes.map((p) => (
                    <Card key={p.id}>
                      <CardContent className="space-y-2 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{p.estado_moderacion}</Badge>
                          <span className="font-bold flex-1">{p.titulo}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(p.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{p.descripcion?.substring(0, 100)}...</p>
                        <p className="text-xs text-muted-foreground">
                          Por: {p.profiles?.nombre_completo ?? "Usuario"}
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            disabled={working === p.id}
                            onClick={() => onAprobarProducto(p.id)}
                          >
                            {working === p.id ? (
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
                            disabled={working === p.id}
                            onClick={() => onRechazarProducto(p.id)}
                          >
                            <ShieldX className="mr-1 h-4 w-4" /> Rechazar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            disabled={working === p.id}
                            onClick={() => onEliminarProducto(p.id, p.titulo)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* REPORTES TAB */}
            <TabsContent value="reportes" className="space-y-4">
              <div className="mb-4 flex gap-2">
                <Badge>{reportesPendientes.length} pendientes</Badge>
                <Badge variant="outline">{reportesResueltos.length} resueltos</Badge>
              </div>

              {reportes.length === 0 ? (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Sin reportes 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {reportes.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="space-y-2 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Flag className="h-4 w-4 text-destructive" />
                          <Badge variant={r.estado === "pendiente" ? "destructive" : "outline"}>
                            {r.estado}
                          </Badge>
                          <Badge variant="secondary">{r.tipo}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-semibold">Razón:</span> {reportReasons[r.razon as keyof typeof reportReasons] || r.razon}
                        </p>
                        {r.descripcion && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Detalles:</span> {r.descripcion}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          {r.estado === "pendiente" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={working === r.id}
                                onClick={() => onMarcarReporte(r.id, "revisado")}
                              >
                                {working === r.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>Marcar revisado</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-success text-success-foreground hover:bg-success/90"
                                disabled={working === r.id}
                                onClick={() => onMarcarReporte(r.id, "resuelto")}
                              >
                                {working === r.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>Marcar resuelto</>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* RESEÑAS REPORTADAS TAB */}
            <TabsContent value="resenias" className="space-y-4">
              {reseniasReportadas.length === 0 ? (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Sin reseñas reportadas 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {reseniasReportadas.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="space-y-2 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < r.calificacion
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline">{r.estado}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                        </div>
                        {r.comentario && (
                          <p className="text-sm italic">{r.comentario}</p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={working === r.id}
                            onClick={() => onOcultarResena(r.id)}
                          >
                            {working === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>Ocultar reseña</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            disabled={working === r.id}
                            onClick={() => onEliminarResena(r.id)}
                          >
                            {working === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>Eliminar</>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
