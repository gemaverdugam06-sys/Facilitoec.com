import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Loader2,
  Sparkles,
  Zap,
  Rocket,
  Crown,
  Flame,
  Star,
  ExternalLink,
  Upload,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/error-messages";

const PAYPHONE_LINK = import.meta.env.VITE_PAYPHONE_LINK ?? "https://payp.page/l/FacilitoEC";

export const Route = createFileRoute("/_authenticated/promocionar/$productoId")({
  component: PromocionarPage,
});

type PlanKey = "FLASH" | "BASICO" | "PLUS" | "PRO" | "MEGA";

const PLANS: Array<{
  key: PlanKey;
  name: string;
  price: number;
  days: number;
  perks: string[];
  Icon: typeof Zap;
  highlight?: boolean;
  badge?: string;
  gradient: string;
}> = [
  {
    key: "FLASH",
    name: "Flash",
    price: 1,
    days: 2,
    perks: ["Insignia 'Destacado'", "Aparece arriba", "Ideal para probar"],
    Icon: Zap,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    key: "BASICO",
    name: "Básico",
    price: 2,
    days: 5,
    perks: ["Todo lo de Flash", "5 días destacado", "Más visitas"],
    Icon: Star,
    badge: "Recomendado",
    highlight: true,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    key: "PLUS",
    name: "Plus",
    price: 3.5,
    days: 10,
    perks: ["10 días destacado", "Prioridad en búsqueda", "Insignia premium"],
    Icon: Rocket,
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    key: "PRO",
    name: "Pro",
    price: 5.99,
    days: 20,
    perks: ["20 días destacado", "Top en categoría", "Soporte prioritario"],
    Icon: Flame,
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    key: "MEGA",
    name: "Mega",
    price: 8.99,
    days: 30,
    perks: ["30 días destacado", "Insignia dorada", "Máxima exposición"],
    Icon: Crown,
    badge: "Mejor valor",
    gradient: "from-yellow-400 via-orange-500 to-pink-500",
  },
];

function PromocionarPage() {
  const { productoId } = Route.useParams();
  const { user } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();
  const [selected, setSelected] = useState<PlanKey | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [referencia, setReferencia] = useState("");
  const [loading, setLoading] = useState(false);

  const cfg = selected ? PLANS.find((p) => p.key === selected)! : null;

  const submit = async () => {
    if (!selected || !file || !user || !cfg)
      return toast.error("Selecciona plan y sube comprobante");
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      // 1. Subir la captura del comprobante al Storage de Supabase
      const { error: upErr } = await supabase.storage.from("comprobantes").upload(path, file);
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("transacciones").insert({
        user_id: user.id,
        producto_id: productoId,
        monto: cfg.price,
        plan: selected,
        estado_pago: "PENDIENTE",
        comprobante_url: path,
        referencia: referencia.trim() !== "" ? referencia : null,
      });

      if (insErr) throw insErr;

      toast.success("¡Comprobante enviado! Aprobaremos tu promoción muy pronto.");
      setTimeout(() => nav({ to: "/mis-publicaciones" }), 800);
    } catch (e) {
      toast.error(toUserMessage(e, "Error al procesar la solicitud. Intenta de nuevo."));
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(PAYPHONE_LINK);
    toast.success("Link copiado");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 text-center">
          <Badge className="bg-gradient-featured text-warning-foreground border-0 gap-1 mb-2">
            <Sparkles className="h-3 w-3" /> Vende hasta 5x más rápido
          </Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">{t("promote_listing")}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Elige un plan y paga con PayPhone 🇪🇨
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PLANS.map(({ key, name, price, days, perks, Icon, gradient, highlight, badge }) => (
            <Card
              key={key}
              onClick={() => setSelected(key)}
              className={`relative flex flex-col overflow-hidden cursor-pointer transition hover:-translate-y-0.5 hover:shadow-hover ${
                selected === key
                  ? "ring-2 ring-primary shadow-glow"
                  : highlight
                    ? "ring-1 ring-primary/40"
                    : ""
              }`}
            >
              {badge && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0 text-[10px] uppercase tracking-wide">
                  {badge}
                </Badge>
              )}
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
              <CardContent className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold leading-none">{name}</p>
                    <p className="text-xs text-muted-foreground">{days} días</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">${price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">USD</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {cfg && (
          <Card className="mt-6 border-primary/30">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Plan {cfg.name} — ${cfg.price.toFixed(2)} USD
                </h2>
                <Badge>{cfg.days} días</Badge>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-semibold">
                  1. Paga ${cfg.price.toFixed(2)} con PayPhone
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="flex-1 bg-gradient-primary">
                    <a href={PAYPHONE_LINK} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" /> Pagar con PayPhone
                    </a>
                  </Button>
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="mr-1 h-4 w-4" /> Copiar link
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground break-all">{PAYPHONE_LINK}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">2. Sube la captura del comprobante</p>
                <Label htmlFor="ref">Número de referencia (opcional)</Label>
                <Input
                  id="ref"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej: TRX123456"
                />

                <Label htmlFor="file">Captura de pantalla del pago</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
              </div>

              <Button
                onClick={submit}
                disabled={!file || loading}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-4 w-4" /> Enviar comprobante
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Validaremos tu pago manualmente y activaremos el destacado en pocas horas.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
