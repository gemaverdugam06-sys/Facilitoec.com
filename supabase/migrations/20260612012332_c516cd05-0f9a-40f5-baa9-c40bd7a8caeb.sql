-- Private profile data (only owner can read/write)
CREATE TABLE IF NOT EXISTS public.profiles_private (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  telefono TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles_private TO authenticated;
GRANT ALL ON public.profiles_private TO service_role;

ALTER TABLE public.profiles_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pp_select_own" ON public.profiles_private FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "pp_insert_own" ON public.profiles_private FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "pp_update_own" ON public.profiles_private FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS pp_updated_at ON public.profiles_private;
CREATE TRIGGER pp_updated_at BEFORE UPDATE ON public.profiles_private
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing phone numbers
INSERT INTO public.profiles_private (id, telefono)
SELECT id, telefono FROM public.profiles WHERE telefono IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Drop telefono from public profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS telefono;