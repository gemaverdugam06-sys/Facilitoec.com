-- Make reporting views respect the permissions of the querying user.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'perfil_vendedor_stats'
      AND c.relkind = 'v'
  ) THEN
    ALTER VIEW public.perfil_vendedor_stats SET (security_invoker = true);
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'publicidad'
      AND c.relkind = 'v'
  ) THEN
    ALTER VIEW public.publicidad SET (security_invoker = true);
  END IF;
END
$$;