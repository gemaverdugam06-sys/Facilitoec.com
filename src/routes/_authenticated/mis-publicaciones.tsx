import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSignedUrl } from "@/lib/storage";
import {
  Sparkles,
  Trash2,
  Edit,
  Loader2,
  Plus,
  EyeOff,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

interface TxResumen {
  producto_id: string;
  estado_pago: string;
  notas_admin: string | null;
  created_at: string;
}

interface Pub {
  id: string;
  titulo: string;
  precio: number;
  moneda: string;
  imagenes: string[];
  es_destacado: boolean;
  promocionado_hasta: string | null;
  tipo_promocion: string;
  activo: boolean;
  estado_pago?: string;
  notas_admin?: string | null;
}

export const Route = createFileRoute("/_authenticated/mis-publicaciones")({
  component: MisPubs,
});

function MisPubs() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [items, setItems] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Cargamos únicamente los productos del usuario de forma limpia
      const { data: prods, error: pErr } = await supabase
        .from("productos")
        .select(
          "id, titulo, precio, moneda, imagenes, es_destacado, promocionado_hasta, tipo_promocion, activo",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (pErr) throw pErr;

      const listaProductos = (prods as Pub[]) ?? [];

      if (listaProductos.length > 0) {
        // 2. Traemos por separado las transacciones para inyectarlas sin romper el servidor
        const { data: txs } = await supabase
          .from("transacciones")
          .select("producto_id, estado_pago, notas_admin, created_at")
          .in(
            "producto_id",
            listaProductos.map((p) => p.id),
          )
          .order("created_at", { ascending: false });

        // Asociamos cada transacción más reciente a su respectivo anuncio
        listaProductos.forEach((p) => {
          const txAsociada = (txs as TxResumen[] | null)?.find((t) => t.producto_id === p.id);
          if (txAsociada) {
            p.estado_pago = txAsociada.estado_pago;
            p.notas_admin = txAsociada.notas_admin;
          }
        });
      }

      setItems(listaProductos);
    } catch (err: unknown) {
      toUserMessage(err, "Error al sincronizar con el servidor");
      toast.error("Error al sincronizar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const del = async (id: string) => {
    if (!confirm(t("confirm_delete"))) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) return toast.error(toUserMessage(error, "No se pudo eliminar el anuncio."));
    toast.success("Eliminado");
    load();
  };

  const toggleActive = async (p: Pub) => {
    const { error } = await supabase.from("productos").update({ activo: !p.activo }).eq("id", p.id);
    if (error) return toast.error(toUserMessage(error, "No se pudo actualizar el anuncio."));
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("my_listings")}</h1>
          <Button asChild className="bg-gradient-primary">
            <Link to="/publicar">
              <Plus className="h-4 w-4" /> {t("publish")}
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground">
            {t("no_listings")}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <PubRow
                key={p.id}
                p={p}
                onDelete={() => del(p.id)}
                onToggle={() => toggleActive(p)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PubRow({ p, onDelete, onToggle }: { p: Pub; onDelete: () => void; onToggle: () => void }) {
  const { t } = useI18n();
  const nav = useNavigate();
  const img = useSignedUrl("productos", p.imagenes?.[0]);
  const promoActiva =
    p.es_destacado && p.promocionado_hasta && new Date(p.promocionado_hasta) > new Date();

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col p-0">
        <div className="flex items-center gap-3 p-3">
          <button
            onClick={() => nav({ to: "/producto/$id", params: { id: p.id } })}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            {img && <img src={img} alt="" className="h-full w-full object-cover" />}
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{p.titulo}</h3>
            <p className="text-sm font-bold text-primary">
              {p.moneda} {Number(p.precio).toFixed(2)}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant={p.activo ? "default" : "secondary"} className="text-[10px]">
                {p.activo ? t("active") : t("inactive")}
              </Badge>
              {promoActiva && (
                <Badge className="bg-gradient-featured text-warning-foreground border-0 gap-1 text-[10px]">
                  <Sparkles className="h-3 w-3" /> {p.tipo_promocion}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {!promoActiva && p.estado_pago !== "PENDIENTE" && (
              <Button
                size="sm"
                className="bg-gradient-featured text-warning-foreground hover:opacity-90"
                onClick={() =>
                  nav({ to: "/promocionar/$productoId", params: { productoId: p.id } })
                }
              >
                <Sparkles className="h-3 w-3" /> {t("promote")}
              </Button>
            )}
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => nav({ to: "/editar/$id", params: { id: p.id } })}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="outline" onClick={onToggle}>
                {p.activo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button size="icon" variant="outline" onClick={onDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* 🔔 CUADRO DE AVISO DIRECTO DE PUBLICIDAD */}
        {p.estado_pago && (
          <>
            {p.estado_pago === "PENDIENTE" && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 border-t border-amber-100 dark:border-amber-900/50">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Tu pago para destacar este anuncio está siendo revisado por el administrador.
                </span>
              </div>
            )}
            {p.estado_pago === "COMPLETADO" && promoActiva && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 border-t border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {p.notas_admin ||
                    "¡Tu publicidad ha sido aprobada y el anuncio ya está destacado! 🎉"}
                </span>
              </div>
            )}
            {p.estado_pago === "RECHAZADO" && (
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs text-rose-700 dark:text-rose-400 border-t border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Publicidad Rechazada: </span>
                  <span>
                    {p.notas_admin || "Por favor, verifica el comprobante e intenta de nuevo."}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
