-- Trigger-only functions must not be callable as public RPC endpoints.
DO $$
BEGIN
  IF to_regprocedure('public.handle_new_user()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
  END IF;

  IF to_regprocedure('public.guard_producto_moderation()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.guard_producto_moderation() FROM PUBLIC, anon, authenticated;
  END IF;

  IF to_regprocedure('public.guard_resena_insert()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.guard_resena_insert() FROM PUBLIC, anon, authenticated;
  END IF;

  IF to_regprocedure('public.update_resena_timestamp()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.update_resena_timestamp() FROM PUBLIC, anon, authenticated;
  END IF;
END
$$;