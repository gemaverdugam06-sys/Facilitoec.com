-- Reviews require a confirmed buyer transaction for the reviewed product.

CREATE OR REPLACE FUNCTION public.guard_review_confirmed_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.transacciones t
    JOIN public.productos p ON p.id = t.producto_id
    WHERE t.id = NEW.transaccion_id
      AND t.user_id = NEW.comprador_id
      AND t.estado_pago = 'COMPLETADO'
      AND p.user_id = NEW.vendedor_id
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
      SELECT 1
      FROM public.transacciones t
      JOIN public.productos p ON p.id = t.producto_id
      WHERE t.id = transaccion_id
        AND t.user_id = auth.uid()
        AND t.estado_pago = 'COMPLETADO'
        AND p.user_id = vendedor_id
    )
  );
