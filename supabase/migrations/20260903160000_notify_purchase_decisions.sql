-- Notify the buyer when the seller decides a purchase request.

CREATE OR REPLACE FUNCTION public.notify_purchase_decision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.estado = 'PENDIENTE' AND NEW.estado IN ('CONFIRMADA', 'CANCELADA') THEN
    INSERT INTO public.notificaciones (user_id, mensaje, compra_id, tipo)
    SELECT NEW.comprador_id,
           CASE NEW.estado
             WHEN 'CONFIRMADA' THEN 'Tu compra fue aceptada: '
             ELSE 'Tu solicitud de compra fue rechazada: '
           END || COALESCE(p.titulo, 'publicación'),
           NEW.id,
           'compra_actualizada'
    FROM public.productos p
    WHERE p.id = NEW.producto_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS compras_notify_buyer_decision ON public.compras;
CREATE TRIGGER compras_notify_buyer_decision
  AFTER UPDATE OF estado ON public.compras
  FOR EACH ROW EXECUTE FUNCTION public.notify_purchase_decision();
