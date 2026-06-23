DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='user_roles_select_own'
  ) THEN
    CREATE POLICY "user_roles_select_own" ON public.user_roles
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER TABLE public.chats
  ADD COLUMN IF NOT EXISTS ultimo_leido_comprador timestamptz,
  ADD COLUMN IF NOT EXISTS ultimo_leido_vendedor timestamptz;

ALTER TABLE public.transacciones
  ADD COLUMN IF NOT EXISTS comprobante_url text,
  ADD COLUMN IF NOT EXISTS referencia text,
  ADD COLUMN IF NOT EXISTS notas_admin text;

GRANT UPDATE ON public.transacciones TO authenticated;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transacciones' AND policyname='transacciones_admin_select'
  ) THEN
    CREATE POLICY "transacciones_admin_select" ON public.transacciones
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transacciones' AND policyname='transacciones_admin_update'
  ) THEN
    CREATE POLICY "transacciones_admin_update" ON public.transacciones
      FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='productos' AND policyname='productos_admin_update'
  ) THEN
    CREATE POLICY "productos_admin_update" ON public.productos
      FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='comprobantes_owner_insert'
  ) THEN
    CREATE POLICY "comprobantes_owner_insert" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'comprobantes' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='comprobantes_owner_select'
  ) THEN
    CREATE POLICY "comprobantes_owner_select" ON storage.objects
      FOR SELECT TO authenticated
      USING (bucket_id = 'comprobantes' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='comprobantes_owner_update'
  ) THEN
    CREATE POLICY "comprobantes_owner_update" ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'comprobantes' AND (storage.foldername(name))[1] = auth.uid()::text)
      WITH CHECK (bucket_id = 'comprobantes' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='comprobantes_owner_delete'
  ) THEN
    CREATE POLICY "comprobantes_owner_delete" ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'comprobantes' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='comprobantes_admin_select'
  ) THEN
    CREATE POLICY "comprobantes_admin_select" ON storage.objects
      FOR SELECT TO authenticated
      USING (bucket_id = 'comprobantes' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;