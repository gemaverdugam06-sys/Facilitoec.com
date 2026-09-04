-- Incremental hardening for production authorization boundaries.

-- Policies cannot reference NEW/OLD; the trigger owns these column invariants.
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.guard_chat_participants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
    AND (NEW.comprador_id IS DISTINCT FROM OLD.comprador_id
      OR NEW.vendedor_id IS DISTINCT FROM OLD.vendedor_id) THEN
    RAISE EXCEPTION 'Chat participants cannot be changed'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS chats_guard_participants ON public.chats;
CREATE TRIGGER chats_guard_participants
  BEFORE UPDATE ON public.chats
  FOR EACH ROW EXECUTE FUNCTION public.guard_chat_participants();

-- A participant may update chat timestamps, but never either participant id.
DROP POLICY IF EXISTS "chats_update_participant" ON public.chats;
CREATE POLICY "chats_update_participant" ON public.chats
  FOR UPDATE TO authenticated
  USING (auth.uid() = comprador_id OR auth.uid() = vendedor_id)
  WITH CHECK (auth.uid() = comprador_id OR auth.uid() = vendedor_id);

-- A chat must point to the product owner, and a transaction must belong to its product owner.
DROP POLICY IF EXISTS "chats_insert_buyer" ON public.chats;
CREATE POLICY "chats_insert_buyer" ON public.chats
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = comprador_id
    AND comprador_id <> vendedor_id
    AND EXISTS (
      SELECT 1 FROM public.productos p
      WHERE p.id = producto_id AND p.user_id = vendedor_id
    )
  );

DROP POLICY IF EXISTS "transacciones_insert_own" ON public.transacciones;
CREATE POLICY "transacciones_insert_own" ON public.transacciones
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.productos p
      WHERE p.id = producto_id AND p.user_id = auth.uid()
    )
  );

-- These tables were created with policies but RLS was never enabled.
ALTER TABLE public.resenas_vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politica_contenido ENABLE ROW LEVEL SECURITY;

-- Prevent users from changing review ownership or moderation state through a future UPDATE policy.
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.resenas_vendedores;
CREATE POLICY "Users can insert their own reviews" ON public.resenas_vendedores
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = comprador_id AND comprador_id <> vendedor_id);

DROP POLICY IF EXISTS "Reviews are visible" ON public.resenas_vendedores;
CREATE POLICY "Reviews are visible" ON public.resenas_vendedores
  FOR SELECT TO authenticated
  USING (estado IN ('visible', 'reportado'));

DROP POLICY IF EXISTS "Admins manage reportes" ON public.reportes;
CREATE POLICY "Admins manage reportes" ON public.reportes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can create reportes" ON public.reportes;
CREATE POLICY "Users can create reportes" ON public.reportes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reportero_id);

DROP POLICY IF EXISTS "Users can view their own reportes" ON public.reportes;
CREATE POLICY "Users can view their own reportes" ON public.reportes
  FOR SELECT TO authenticated
  USING (auth.uid() = reportero_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can read active content policy" ON public.politica_contenido;
CREATE POLICY "Public can read active content policy" ON public.politica_contenido
  FOR SELECT TO anon, authenticated
  USING (estado = true);