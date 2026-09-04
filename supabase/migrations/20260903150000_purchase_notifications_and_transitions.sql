-- Complete buyer purchase workflow using the existing notifications table.

ALTER TABLE public.compras
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.notificaciones
  ADD COLUMN IF NOT EXISTS compra_id UUID REFERENCES public.compras(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'general';

CREATE INDEX IF NOT EXISTS notificaciones_user_created_idx
  ON public.notificaciones(user_id, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notificaciones'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notificaciones;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_purchase_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    IF NEW.comprador_id IS DISTINCT FROM OLD.comprador_id
       OR NEW.vendedor_id IS DISTINCT FROM OLD.vendedor_id
       OR NEW.producto_id IS DISTINCT FROM OLD.producto_id THEN
      RAISE EXCEPTION 'Purchase participants cannot be changed'
        USING ERRCODE = 'check_violation';
    END IF;

    IF OLD.estado <> 'PENDIENTE'
       OR auth.uid() IS DISTINCT FROM OLD.vendedor_id
       OR NEW.estado NOT IN ('CONFIRMADA', 'CANCELADA') THEN
      RAISE EXCEPTION 'Only the seller can decide a pending purchase'
        USING ERRCODE = 'insufficient_privilege';
    END IF;

    IF NEW.estado = 'CONFIRMADA' THEN
      NEW.confirmed_at := COALESCE(NEW.confirmed_at, now());
    ELSE
      NEW.confirmed_at := NULL;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS compras_guard_transition ON public.compras;
CREATE TRIGGER compras_guard_transition
  BEFORE UPDATE ON public.compras
  FOR EACH ROW EXECUTE FUNCTION public.guard_purchase_transition();

DROP POLICY IF EXISTS "compras_update_seller_pending" ON public.compras;
CREATE POLICY "compras_update_seller_pending" ON public.compras
  FOR UPDATE TO authenticated
  USING (auth.uid() = vendedor_id AND estado = 'PENDIENTE')
  WITH CHECK (auth.uid() = vendedor_id);

CREATE OR REPLACE FUNCTION public.notify_purchase_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notificaciones (user_id, mensaje, compra_id, tipo)
  SELECT NEW.vendedor_id,
         'Nueva solicitud de compra: ' || COALESCE(p.titulo, 'publicación'),
         NEW.id,
         'compra_solicitada'
  FROM public.productos p
  WHERE p.id = NEW.producto_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS compras_notify_seller ON public.compras;
CREATE TRIGGER compras_notify_seller
  AFTER INSERT ON public.compras
  FOR EACH ROW EXECUTE FUNCTION public.notify_purchase_request();
