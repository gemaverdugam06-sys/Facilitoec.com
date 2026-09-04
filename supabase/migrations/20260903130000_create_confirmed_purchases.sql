-- Separate buyer purchases from seller promotion transactions.

CREATE TABLE IF NOT EXISTS public.compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comprador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendedor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  estado TEXT NOT NULL DEFAULT 'PENDIENTE'
    CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE (comprador_id, producto_id)
);

GRANT SELECT, INSERT ON public.compras TO authenticated;
GRANT UPDATE ON public.compras TO authenticated;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compras_select_participant_or_admin" ON public.compras
  FOR SELECT TO authenticated
  USING (
    auth.uid() = comprador_id
    OR auth.uid() = vendedor_id
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "compras_insert_buyer" ON public.compras
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = comprador_id
    AND comprador_id <> vendedor_id
    AND EXISTS (
      SELECT 1 FROM public.productos p
      WHERE p.id = producto_id AND p.user_id = vendedor_id
    )
  );

CREATE POLICY "compras_update_admin" ON public.compras
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.resenas_vendedores
  ADD COLUMN IF NOT EXISTS compra_id UUID REFERENCES public.compras(id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX IF NOT EXISTS resenas_vendedores_compra_id_unique
  ON public.resenas_vendedores(compra_id)
  WHERE compra_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.guard_review_confirmed_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.compra_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.compras c
    WHERE c.id = NEW.compra_id
      AND c.comprador_id = NEW.comprador_id
      AND c.vendedor_id = NEW.vendedor_id
      AND c.estado = 'CONFIRMADA'
      AND NEW.comprador_id <> NEW.vendedor_id
  ) THEN
    RAISE EXCEPTION 'A review requires a confirmed purchase'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS resenas_vendedores_guard_confirmed_purchase ON public.resenas_vendedores;
CREATE TRIGGER resenas_vendedores_guard_confirmed_purchase
  BEFORE INSERT ON public.resenas_vendedores
  FOR EACH ROW EXECUTE FUNCTION public.guard_review_confirmed_purchase();

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.resenas_vendedores;
CREATE POLICY "Users can insert their own reviews" ON public.resenas_vendedores
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = comprador_id
    AND comprador_id <> vendedor_id
    AND EXISTS (
      SELECT 1 FROM public.compras c
      WHERE c.id = compra_id
        AND c.comprador_id = auth.uid()
        AND c.vendedor_id = vendedor_id
        AND c.estado = 'CONFIRMADA'
    )
  );

DROP POLICY IF EXISTS "active_users_only" ON public.compras;
CREATE POLICY "active_users_only" ON public.compras
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (public.is_current_user_active())
  WITH CHECK (public.is_current_user_active());
