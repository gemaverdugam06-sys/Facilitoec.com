-- New reviews use compra_id; legacy promotion transaction references remain intact.

ALTER TABLE public.resenas_vendedores
  ALTER COLUMN transaccion_id DROP NOT NULL;
