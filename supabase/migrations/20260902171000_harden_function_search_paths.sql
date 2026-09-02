-- Pin SECURITY DEFINER function search paths to avoid role-dependent resolution.
DO $$
BEGIN
  IF to_regprocedure('public.update_resena_timestamp()') IS NOT NULL THEN
    ALTER FUNCTION public.update_resena_timestamp() SET search_path = public;
  END IF;

  IF to_regprocedure('public.handle_new_user()') IS NOT NULL THEN
    ALTER FUNCTION public.handle_new_user() SET search_path = public;
  END IF;

  IF to_regprocedure('public.disparar_notificacion_publicidad()') IS NOT NULL THEN
    ALTER FUNCTION public.disparar_notificacion_publicidad() SET search_path = public;
  END IF;

  IF to_regprocedure('public.guard_producto_moderation()') IS NOT NULL THEN
    ALTER FUNCTION public.guard_producto_moderation() SET search_path = public;
  END IF;

  IF to_regprocedure('public.guard_resena_insert()') IS NOT NULL THEN
    ALTER FUNCTION public.guard_resena_insert() SET search_path = public;
  END IF;

  IF to_regprocedure('public.is_user_blocked(uuid)') IS NOT NULL THEN
    ALTER FUNCTION public.is_user_blocked(uuid) SET search_path = public;
  END IF;

  IF to_regprocedure('public.has_role(uuid,public.app_role)') IS NOT NULL THEN
    ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
  END IF;

  IF to_regprocedure('public.has_role(uuid,text)') IS NOT NULL THEN
    ALTER FUNCTION public.has_role(uuid, text) SET search_path = public;
  END IF;
END
$$;