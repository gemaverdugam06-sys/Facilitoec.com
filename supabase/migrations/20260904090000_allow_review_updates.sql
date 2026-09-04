-- Allow buyers to edit their own review without changing its ownership or moderation state.

GRANT INSERT, UPDATE ON public.resenas_vendedores TO authenticated;

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.resenas_vendedores;
CREATE POLICY "Users can update their own reviews" ON public.resenas_vendedores
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = comprador_id
    AND public.is_current_user_active()
  )
  WITH CHECK (
    auth.uid() = comprador_id
    AND public.is_current_user_active()
    AND comprador_id <> vendedor_id
    AND compra_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.compras c
      WHERE c.id = compra_id
        AND c.comprador_id = auth.uid()
        AND c.vendedor_id = vendedor_id
        AND c.estado = 'CONFIRMADA'
    )
  );