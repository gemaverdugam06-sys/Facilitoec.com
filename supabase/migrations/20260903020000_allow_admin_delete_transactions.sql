-- Allow administrators to remove transactions from the admin history.
GRANT DELETE ON public.transacciones TO authenticated;

DROP POLICY IF EXISTS "transacciones_admin_delete" ON public.transacciones;
CREATE POLICY "transacciones_admin_delete" ON public.transacciones
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));