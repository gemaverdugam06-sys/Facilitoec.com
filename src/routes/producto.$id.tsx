import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useSignedUrls } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, Phone, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { isUserVerified } from "@/lib/auth-utils";

interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: string;
  ciudad: string;
  imagenes: string[];
  estado: string;
  whatsapp: string | null;
  es_destacado: boolean;
  user_id: string;
  categoria_id: string;
  profiles: {
    nombre_completo: string | null;
    avatar_url: string | null;
    ciudad: string | null;
  } | null;
}

export const Route = createFileRoute("/producto/$id")({
  component: ProductoPage,
});

function ProductoPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const images = useSignedUrls("productos", p?.imagenes ?? []);

  useEffect(() => {
    supabase
      .from("productos")
      .select("*, profiles!productos_user_profile_fk(nombre_completo, avatar_url, ciudad)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setP(data as unknown as Producto);
        setLoading(false);
      });
  }, [id]);

  const isVerified = isUserVerified(user);

  const startChat = async () => {
    if (!user) {
      toast.error("Inicia sesión para chatear");
      nav({ to: "/auth" });
      return;
    }
    if (!isVerified) {
      toast.error("Verifica tu correo electrónico para poder chatear");
      return;
    }
    if (!p) return;
    if (user.id === p.user_id) {
      toast.error("Es tu propio anuncio");
      return;
    }
    const { data: existing } = await supabase
      .from("chats")
      .select("id")
      .eq("producto_id", p.id)
      .eq("comprador_id", user.id)
      .maybeSingle();
    let chatId = existing?.id;
    if (!chatId) {
      const { data: nuevo, error } = await supabase
        .from("chats")
        .insert({ producto_id: p.id, comprador_id: user.id, vendedor_id: p.user_id })
        .select("id")
        .single();
      if (error) {
        toast.error(toUserMessage(error, "No se pudo iniciar el chat."));
        return;
      }
      chatId = nuevo.id;
    }
    nav({ to: "/chat/$chatId", params: { chatId } });
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.error("Inicia sesión para ver WhatsApp");
      nav({ to: "/auth" });
      return;
    }
    if (!isVerified) {
      e.preventDefault();
      toast.error("Verifica tu correo electrónico para contactar por WhatsApp");
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando...
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-8 text-center">Producto no encontrado.</div>
      </div>
    );
  }

  const waLink = buildWhatsappLink(
    p.whatsapp,
    `Hola, vi tu anuncio "${p.titulo}" en FACILITOEC y me interesa. ¿Sigue disponible?`,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-4">
        <Button variant="ghost" size="sm" onClick={() => nav({ to: "/" })} className="mb-3">
          <ArrowLeft className="mr-1 h-4 w-4" /> Volver
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <motion.div
              className="aspect-square overflow-hidden rounded-xl bg-muted"
              initial={{ scale: 0.995, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
            >
              {images[idx] && (
                <img
                  src={images[idx]}
                  alt={p.titulo}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {images.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${i === idx ? "border-primary" : "border-transparent"}`}
                  >
                    <img
                      src={u}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {p.es_destacado && (
                <Badge className="bg-gradient-featured text-warning-foreground border-0 gap-1">
                  <Sparkles className="h-3 w-3" /> {t("featured")}
                </Badge>
              )}
              <Badge variant="secondary">
                {p.estado === "nuevo" ? t("new_item") : t("used_item")}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight md:text-3xl">{p.titulo}</h1>
            <p className="text-3xl font-bold text-primary">
              {p.moneda} {Number(p.precio).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {p.ciudad}
            </p>
            <Card className="p-4 glass-border soft-shadow">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={p.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>{p.profiles?.nombre_completo?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {p.profiles?.nombre_completo ?? "Vendedor"}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.profiles?.ciudad ?? p.ciudad}</p>
                </div>
              </div>
            </Card>
            <div className="flex flex-col gap-2 sm:flex-row">
              <motion.div whileHover={{ scale: 1.02 }} className="flex-1 will-change-transform">
                <Button onClick={startChat} className="flex-1 btn-cta">
                  <MessageCircle className="mr-1 h-4 w-4" /> {t("chat_internal")}
                </Button>
              </motion.div>
              {p.whatsapp &&
                (user && isVerified && waLink ? (
                  <motion.div whileHover={{ scale: 1.02 }} className="flex-1 will-change-transform">
                    <Button asChild variant="outline" className="flex-1">
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <Phone className="mr-1 h-4 w-4" /> {t("open_whatsapp")}
                      </a>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} className="flex-1 will-change-transform">
                    <Button variant="outline" className="flex-1" onClick={handleWhatsapp}>
                      <Phone className="mr-1 h-4 w-4" /> {t("open_whatsapp")}
                    </Button>
                  </motion.div>
                ))}
            </div>
            {(!user || !isVerified) && (
              <p className="text-xs text-muted-foreground">
                {!user
                  ? "Inicia sesión con una cuenta verificada para ver WhatsApp y chatear."
                  : "Verifica tu correo electrónico para ver WhatsApp y chatear."}
              </p>
            )}
            <div>
              <h2 className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
                {t("description")}
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.descripcion}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
