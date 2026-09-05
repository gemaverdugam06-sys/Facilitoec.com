ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS response_text text,
  ADD COLUMN IF NOT EXISTS responded_at timestamptz;

GRANT UPDATE ON public.support_tickets TO authenticated;