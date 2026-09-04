-- Repair the blocking profile policy for databases where the historical
-- migration was already applied. NEW and OLD are trigger records and cannot
-- be referenced from an RLS policy; guard_profile_block_state owns that rule.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
