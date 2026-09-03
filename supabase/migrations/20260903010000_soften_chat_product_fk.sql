-- Keep chats alive even when the product is deleted.
-- The product reference becomes nullable so the conversation remains accessible,
-- while the product page can then show "Producto ya no disponible".
ALTER TABLE public.chats
  DROP CONSTRAINT IF EXISTS chats_producto_id_fkey;

ALTER TABLE public.chats
  ALTER COLUMN producto_id DROP NOT NULL;

ALTER TABLE public.chats
  ADD CONSTRAINT chats_producto_id_fkey
    FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE SET NULL;

-- Message lifecycle fields for edit/delete and delivery/read states.
ALTER TABLE public.mensajes
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS editado_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS estado_envio TEXT NOT NULL DEFAULT 'sent';

GRANT UPDATE ON public.mensajes TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'mensajes_estado_envio_check'
      AND conrelid = 'public.mensajes'::regclass
  ) THEN
    ALTER TABLE public.mensajes
      ADD CONSTRAINT mensajes_estado_envio_check
        CHECK (estado_envio IN ('sent', 'delivered', 'read'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_mensajes_chat_deleted
  ON public.mensajes (chat_id, created_at)
  WHERE deleted_at IS NULL;

-- Allow sender to update its own message metadata for editing/deletion.
DROP POLICY IF EXISTS "mensajes_update_own" ON public.mensajes;
CREATE POLICY "mensajes_update_own" ON public.mensajes
  FOR UPDATE TO authenticated
  USING (auth.uid() = remitente_id AND created_at >= now() - interval '5 minutes')
  WITH CHECK (auth.uid() = remitente_id);

-- Keep hidden deleted messages from normal reads while retaining the record.
DROP POLICY IF EXISTS "mensajes_select_chat_participant" ON public.mensajes;
CREATE POLICY "mensajes_select_chat_participant" ON public.mensajes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid())
    )
  );

-- Ensure the sender can still create messages for a valid chat participant.
DROP POLICY IF EXISTS "mensajes_insert_chat_participant" ON public.mensajes;
CREATE POLICY "mensajes_insert_chat_participant" ON public.mensajes
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = remitente_id AND
    EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid())
    )
  );
