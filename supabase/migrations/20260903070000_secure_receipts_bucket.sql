-- Payment receipts are private documents, not public media.
UPDATE storage.buckets
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
WHERE id = 'comprobantes';

DROP POLICY IF EXISTS "comprobantes_public_read" ON storage.objects;

DROP POLICY IF EXISTS "comprobantes_owner_select" ON storage.objects;
CREATE POLICY "comprobantes_owner_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'comprobantes'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(), 'admin')
    )
  );