-- Ensure message receipts exist even if an earlier realtime migration was interrupted.
ALTER TABLE public.mensajes
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.mark_messages_delivered(_message_ids UUID[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mensajes m
  SET delivered_at = COALESCE(m.delivered_at, now()),
      estado_envio = CASE WHEN m.read_at IS NULL THEN 'delivered' ELSE 'read' END
  FROM public.chats c
  WHERE m.id = ANY(_message_ids)
    AND m.chat_id = c.id
    AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid())
    AND m.remitente_id <> auth.uid()
    AND m.deleted_at IS NULL
    AND m.delivered_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_messages_read(_chat_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mensajes m
  SET delivered_at = COALESCE(m.delivered_at, now()),
      read_at = COALESCE(m.read_at, now()),
      estado_envio = 'read'
  FROM public.chats c
  WHERE m.chat_id = _chat_id
    AND c.id = m.chat_id
    AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid())
    AND m.remitente_id <> auth.uid()
    AND m.deleted_at IS NULL
    AND m.read_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_messages_delivered(uuid[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_messages_read(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_messages_delivered(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(uuid) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'chats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
  END IF;
END;
$$;