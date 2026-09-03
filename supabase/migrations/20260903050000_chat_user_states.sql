-- Store archive and delete state independently for each chat participant.
CREATE TABLE IF NOT EXISTS public.chat_user_states (
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  archived_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY (chat_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_user_states TO authenticated;
ALTER TABLE public.chat_user_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_user_states_select_own" ON public.chat_user_states;
CREATE POLICY "chat_user_states_select_own" ON public.chat_user_states
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_user_states_insert_participant" ON public.chat_user_states;
CREATE POLICY "chat_user_states_insert_participant" ON public.chat_user_states
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.chats c
      WHERE c.id = chat_id AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "chat_user_states_update_own" ON public.chat_user_states;
CREATE POLICY "chat_user_states_update_own" ON public.chat_user_states
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_user_states_delete_own" ON public.chat_user_states;
CREATE POLICY "chat_user_states_delete_own" ON public.chat_user_states
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);