
-- has_role como SECURITY DEFINER (evita manipulación por search_path)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Bloquear cualquier escritura desde el cliente; los roles se asignan vía trigger SECURITY DEFINER
-- o desde service_role (que ignora RLS).
DROP POLICY IF EXISTS "Block client inserts on user_roles" ON public.user_roles;
CREATE POLICY "Block client inserts on user_roles"
ON public.user_roles FOR INSERT TO authenticated, anon
WITH CHECK (false);

DROP POLICY IF EXISTS "Block client updates on user_roles" ON public.user_roles;
CREATE POLICY "Block client updates on user_roles"
ON public.user_roles FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Block client deletes on user_roles" ON public.user_roles;
CREATE POLICY "Block client deletes on user_roles"
ON public.user_roles FOR DELETE TO authenticated, anon
USING (false);
