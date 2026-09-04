-- Reconcile the existing remote schema with the blocked-user security model.
-- This migration assumes the existing public tables and is safe to rerun.

CREATE OR REPLACE FUNCTION public.guard_profile_block_state()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF (NEW.is_blocked IS TRUE OR NEW.motivo_bloqueo IS NOT NULL)
       AND auth.uid() IS NOT NULL
       AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only administrators can set user blocking state'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF auth.uid() IS NOT NULL AND (
      NEW.is_blocked IS DISTINCT FROM OLD.is_blocked
      OR NEW.motivo_bloqueo IS DISTINCT FROM OLD.motivo_bloqueo
    ) AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Only administrators can modify user blocking state'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_guard_block_state_ins ON public.profiles;
DROP TRIGGER IF EXISTS profiles_guard_block_state_upd ON public.profiles;
CREATE TRIGGER profiles_guard_block_state_ins
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_block_state();
CREATE TRIGGER profiles_guard_block_state_upd
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_block_state();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
$$;

REVOKE ALL ON FUNCTION public.is_current_user_active() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_active() TO authenticated, service_role;

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'profiles', 'profiles_private', 'productos', 'transacciones',
    'chats', 'mensajes', 'user_roles', 'chat_user_states',
    'resenas_vendedores', 'reportes', 'politica_contenido', 'support_tickets'
  ] LOOP
    IF to_regclass(format('public.%I', target_table)) IS NULL THEN
      CONTINUE;
    END IF;

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
