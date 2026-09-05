GRANT DELETE ON public.notificaciones TO authenticated;

DROP POLICY IF EXISTS "Usuarios eliminan sus propias notificaciones" ON public.notificaciones;
CREATE POLICY "Usuarios eliminan sus propias notificaciones" ON public.notificaciones
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);