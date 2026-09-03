-- Persist server timestamps for delivery and read receipts.
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

GRANT EXECUTE ON FUNCTION public.mark_messages_delivered(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(uuid) TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;