-- Keep product visibility and moderation controlled by the database.
ALTER TABLE public.productos
  ALTER COLUMN estado_moderacion SET DEFAULT 'pendiente';

UPDATE public.productos
SET estado_moderacion = 'pendiente'
WHERE estado_moderacion IS NULL;

DROP POLICY IF EXISTS "productos_select_all" ON public.productos;

CREATE POLICY "productos_public_select_approved"
  ON public.productos
  FOR SELECT
  TO anon, authenticated
  USING (activo = true AND estado_moderacion = 'aprobado');

CREATE POLICY "productos_owner_select"
  ON public.productos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'productos'
      AND policyname = 'productos_admin_select'
  ) THEN
    CREATE POLICY "productos_admin_select"
      ON public.productos
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;