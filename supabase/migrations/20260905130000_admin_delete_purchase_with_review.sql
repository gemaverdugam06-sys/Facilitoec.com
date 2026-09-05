CREATE OR REPLACE FUNCTION public.admin_delete_purchase(_purchase_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can delete purchases'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  DELETE FROM public.resenas_vendedores
  WHERE compra_id = _purchase_id;

  DELETE FROM public.compras
  WHERE id = _purchase_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_purchase(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_purchase(uuid) TO authenticated;