
-- Enable RLS on realtime.messages and restrict chat channel subscriptions
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user participates in a chat by id
CREATE OR REPLACE FUNCTION public.is_chat_participant(_chat_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chats
    WHERE id = _chat_id
      AND (comprador_id = auth.uid() OR vendedor_id = auth.uid())
  );
$$;

DROP POLICY IF EXISTS "Authenticated can read allowed realtime topics" ON realtime.messages;
CREATE POLICY "Authenticated can read allowed realtime topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    -- Private chat channels: topic format "chat:<uuid>"
    WHEN realtime.topic() LIKE 'chat:%' THEN
      public.is_chat_participant(
        NULLIF(split_part(realtime.topic(), ':', 2), '')::uuid
      )
    -- Per-user unread channels: topic format "unread:<user_id>:..."
    WHEN realtime.topic() LIKE 'unread:%' THEN
      split_part(realtime.topic(), ':', 2) = auth.uid()::text
    -- Deny all other topics by default
    ELSE false
  END
);
