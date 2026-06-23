import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { toUserMessage } from "@/lib/error-messages";
import { toast } from "sonner";

interface Mensaje {
  id: string;
  chat_id: string;
  remitente_id: string;
  contenido: string;
  created_at: string;
}
interface ChatInfo {
  id: string;
  comprador_id: string;
  vendedor_id: string;
  productos: { id: string; titulo: string } | null;
}

export const Route = createFileRoute("/_authenticated/chat/$chatId")({
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const { user } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();
  const [info, setInfo] = useState<ChatInfo | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Función dedicada a traer los mensajes actualizados de la base de datos
  const refrescarMensajes = async () => {
    if (!chatId) return;
    const { data } = await supabase
      .from("mensajes")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (data) {
      setMensajes(data as Mensaje[]);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    // Cargar metadatos del chat
    supabase
      .from("chats")
      .select("id, comprador_id, vendedor_id, productos:producto_id (id, titulo)")
      .eq("id", chatId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setInfo(data as unknown as ChatInfo);
      });

    // Carga inicial de mensajes
    refrescarMensajes().then(() => setLoading(false));

    // Intento de conexión por tiempo real (si Cloudflare lo permite)
    const ch = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes", filter: `chat_id=eq.${chatId}` },
        () => {
          refrescarMensajes();
        },
      )
      .subscribe();

    // RESPALDO SEGURO: Polling activo cada 3 segundos por si el websocket falla localmente
    const intervaloRespaldo = setInterval(() => {
      refrescarMensajes();
    }, 3000);

    return () => {
      supabase.removeChannel(ch);
      clearInterval(intervaloRespaldo);
    };
  }, [chatId]);

  // Actualizar indicador de lectura
  useEffect(() => {
    if (!user || !info) return;
    const readUpdate: Database["public"]["Tables"]["chats"]["Update"] =
      info.comprador_id === user.id
        ? { ultimo_leido_comprador: new Date().toISOString() }
        : { ultimo_leido_vendedor: new Date().toISOString() };
    supabase
      .from("chats")
      .update(readUpdate)
      .eq("id", chatId)
      .then(() => {});
  }, [user?.id, info?.id, mensajes.length, chatId]);

  // Mantener scroll abajo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes.length]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = texto.trim();
    if (!v || !user) return;

    setTexto(""); // Limpieza veloz de la caja de texto

    // Inserción directa enviando el objeto plano a Supabase
    const { error } = await supabase.from("mensajes").insert({
      chat_id: chatId,
      remitente_id: user.id,
      contenido: v,
    });

    if (error) {
      toUserMessage(error, "No se pudo enviar el mensaje.");
      toast.error("No se pudo enviar el mensaje.");
      setTexto(v);
      return;
    }

    // Refrescamos inmediatamente el estado local tras guardar con éxito
    await refrescarMensajes();

    // Actualizamos estampa del chat principal
    await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="border-b bg-card">
        <div className="container mx-auto flex max-w-2xl items-center gap-2 px-4 py-2">
          <Button variant="ghost" size="icon" onClick={() => nav({ to: "/chats" })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {info?.productos && (
            <Link
              to="/producto/$id"
              params={{ id: info.productos.id }}
              className="truncate text-sm font-semibold hover:underline"
            >
              {info.productos.titulo}
            </Link>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl space-y-2 px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : mensajes.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("no_messages")}</p>
          ) : (
            mensajes.map((m) => {
              const mine = m.remitente_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {m.contenido}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <form onSubmit={enviar} className="sticky bottom-0 border-t bg-background">
        <div className="container mx-auto flex max-w-2xl gap-2 px-4 py-3">
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={t("type_message")}
            maxLength={1000}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-primary"
            disabled={!texto.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
