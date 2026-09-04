-- Enforce blocked-user restrictions at the database boundary.
-- Existing permissive policies remain unchanged; these restrictive policies
-- add an active-user requirement while allowing administrators to operate.

CREATE OR REPLACE FUNCTION public.is_current_user_active()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
    AND (
      NOT public.is_user_blocked(auth.uid())
      OR public.has_role(auth.uid(), 'admin')
    );
$$;

REVOKE ALL ON FUNCTION public.is_current_user_active() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_active() TO authenticated, service_role;

-- SECURITY DEFINER RPCs must enforce the same rule before changing message state.
CREATE OR REPLACE FUNCTION public.mark_messages_delivered(_message_ids UUID[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_current_user_active() THEN
    RAISE EXCEPTION 'Blocked users cannot update message receipts'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

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
  IF NOT public.is_current_user_active() THEN
    RAISE EXCEPTION 'Blocked users cannot update message receipts'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

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

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'profiles',
    'profiles_private',
    'productos',
    'transacciones',
    'chats',
    'mensajes',
    'user_roles',
    'chat_user_states',
    'resenas_vendedores',
    'reportes',
    'politica_contenido',
    'support_tickets'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
    EXECUTE format('DROP POLICY IF EXISTS "active_users_only" ON public.%I', target_table);
    EXECUTE format(
      'CREATE POLICY "active_users_only" ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (public.is_current_user_active()) WITH CHECK (public.is_current_user_active())',
      target_table
    );
  END LOOP;
END $$;

DROP POLICY IF EXISTS "active_users_only" ON storage.objects;
CREATE POLICY "active_users_only" ON storage.objects
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (public.is_current_user_active())
  WITH CHECK (public.is_current_user_active());

DROP POLICY IF EXISTS "active_users_only" ON realtime.messages;
CREATE POLICY "active_users_only" ON realtime.messages
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (public.is_current_user_active())
  WITH CHECK (public.is_current_user_active());
