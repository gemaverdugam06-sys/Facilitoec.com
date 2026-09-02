import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Flag } from "lucide-react";
import { toast } from "sonner";
import { submitReport, reportReasons, type ReportReason, type ReportType } from "@/lib/reporting";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportType;
  objetoId: string;
  objectName?: string; // For display purposes
}

export function ReportDialog({
  open,
  onOpenChange,
  reportType,
  objetoId,
  objectName,
}: ReportDialogProps) {
  const { user } = useAuth();
  const [razon, setRazon] = useState<ReportReason>("otro");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }

    setLoading(true);
    const result = await submitReport(supabase, {
      reportero_id: user.id,
      tipo: reportType,
      objeto_id: objetoId,
      razon,
      descripcion: descripcion || undefined,
    });

    if (result.success) {
      toast.success("¡Reporte enviado! Nuestro equipo lo revisará pronto.");
      onOpenChange(false);
      setRazon("otro");
      setDescripcion("");
    } else {
      toast.error(result.error || "Error al enviar el reporte");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Reportar{" "}
            {reportType === "producto"
              ? "publicación"
              : reportType === "usuario"
                ? "usuario"
                : "reseña"}
          </DialogTitle>
          <DialogDescription>
            Ayúdanos a mantener WINFAST seguro reportando contenido inapropiado.
            {objectName && <p className="mt-2 font-semibold text-foreground">{objectName}</p>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="razon">Razón del reporte *</Label>
            <Select value={razon} onValueChange={(v) => setRazon(v as ReportReason)}>
              <SelectTrigger id="razon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(reportReasons).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción adicional (opcional, máximo 500 caracteres)
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Proporciona detalles específicos que ayuden a nuestro equipo a revisar tu reporte..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{descripcion.length}/500</p>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p>
              ⚠️ Los reportes falsos o de spam serán ignorados. Todos los reportes se revisan de
              forma anónima.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
