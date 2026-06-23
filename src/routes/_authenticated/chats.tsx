import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useUnreadChats } from "@/hooks/use-unread";
import { toUserMessage } from "@/lib/error-messages";
import type { Database } from "@/integrations/supabase/types";

type ChatRealtimeRow = Pick<
  Database["public"]["Tables"]["chats"]["Row"],
  "comprador_id" | "vendedor_id"
>;

interface ChatRow {
  id: string;
  producto_id: string;
  comprador_id: string;
  vendedor_id: string;
  updated_at: string;
  productos: { titulo: string; imagenes: string[] } | null;
  comprador: { nombre_completo: string | null; avatar_url: string | null } | null;
  vendedor: { nombre_completo: string | null; avatar_url: string | null } | null;
}

export const Route = createFileRoute("/_authenticated/chats")({
  component: ChatsPage,
});

function ChatsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { unread } = useUnreadChats();
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarChats = async () => {
    if (!user) return;

    // CORREGIDO: Cambiado 'seller_id' por 'vendedor_id' para que coincida con tu tabla
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        id, producto_id, comprador_id, vendedor_id, updated_at,
        productos:producto_id (titulo, imagenes),
        comprador:profiles!chats_comprador_profile_fk (nombre_completo, avatar_url),
        vendedor:profiles!chats_vendedor_profile_fk (nombre_completo, avatar_url)
      `,
      )
      .or(`comprador_id.eq.${user.id},vendedor_id.eq.${user.id}`);

    if (error) {
      toUserMessage(error, "Error al cargar los chats.");
      setLoading(false);
      return;
    }

    // Ordenar localmente o asegurar que guarde el arreglo ordenado por fecha
    const chatsOrdenados = ((data as unknown as ChatRow[]) ?? []).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    setChats(chatsOrdenados);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    cargarChats();

    const canalChats = supabase
      .channel("actualizaciones-bandeja-chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, async (payload) => {
        const row = payload.new as ChatRealtimeRow | null;
        if (row && (row.comprador_id === user.id || row.vendedor_id === user.id)) {
          await cargarChats();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalChats);
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("chats")}</h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : chats.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground">
            {t("no_chats")}
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((c) => {
              const other = c.comprador_id === user?.id ? c.vendedor : c.comprador;
              const count = unread[c.id] ?? 0;
              return (
                <Link key={c.id} to="/chat/$chatId" params={{ chatId: c.id }}>
                  <Card
                    className={`transition hover:bg-accent ${count > 0 ? "border-primary/40 bg-primary/5" : ""}`}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <Avatar>
                        <AvatarImage src={other?.avatar_url ?? undefined} />
                        <AvatarFallback>{other?.nombre_completo?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm ${count > 0 ? "font-bold" : "font-semibold"}`}
                        >
                          {other?.nombre_completo ?? "Usuario"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.productos?.titulo}
                        </p>
                      </div>
                      {count > 0 && (
                        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
