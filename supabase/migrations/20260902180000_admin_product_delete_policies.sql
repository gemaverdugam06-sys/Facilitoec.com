-- Allow administrators to remove moderated listings and their product images.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'productos'
      AND policyname = 'productos_admin_delete'
  ) THEN
    CREATE POLICY "productos_admin_delete"
      ON public.productos
      FOR DELETE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'productos_admin_delete'
  ) THEN
    CREATE POLICY "productos_admin_delete"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'productos'
        AND public.has_role(auth.uid(), 'admin')
      );
  END IF;
END
$$;