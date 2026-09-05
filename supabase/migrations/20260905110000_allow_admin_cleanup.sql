GRANT DELETE ON public.compras, public.resenas_vendedores, public.support_tickets TO authenticated;

DROP POLICY IF EXISTS "Admins delete compras" ON public.compras;
CREATE POLICY "Admins delete compras" ON public.compras
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete reviews" ON public.resenas_vendedores;
CREATE POLICY "Admins delete reviews" ON public.resenas_vendedores
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete support tickets" ON public.support_tickets;
CREATE POLICY "Admins delete support tickets" ON public.support_tickets
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));