-- Restore names for profiles that were created without the required signup name.
INSERT INTO public.profiles (id, nombre_completo, avatar_url)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

UPDATE public.profiles p
SET nombre_completo = COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
FROM auth.users u
WHERE p.id = u.id
  AND NULLIF(BTRIM(p.nombre_completo), '') IS NULL
  AND COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name') IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre_completo, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
    SET nombre_completo = COALESCE(NULLIF(BTRIM(public.profiles.nombre_completo), ''), EXCLUDED.nombre_completo);
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;