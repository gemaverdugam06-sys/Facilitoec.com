
-- A) Impedir auto-promoción en productos (solo admin puede tocar campos de promo)
CREATE OR REPLACE FUNCTION public.guard_producto_promo_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.es_destacado = true
       OR NEW.tipo_promocion IS DISTINCT FROM 'NINGUNO'
       OR NEW.promocionado_hasta IS NOT NULL THEN
      RAISE EXCEPTION 'Solo un administrador puede activar promociones'
        USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.es_destacado IS DISTINCT FROM OLD.es_destacado
     OR NEW.promocionado_hasta IS DISTINCT FROM OLD.promocionado_hasta
     OR NEW.tipo_promocion IS DISTINCT FROM OLD.tipo_promocion THEN
    RAISE EXCEPTION 'Solo un administrador puede modificar la promoción'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS productos_guard_promo_ins ON public.productos;
DROP TRIGGER IF EXISTS productos_guard_promo_upd ON public.productos;
CREATE TRIGGER productos_guard_promo_ins
  BEFORE INSERT ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.guard_producto_promo_fields();
CREATE TRIGGER productos_guard_promo_upd
  BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.guard_producto_promo_fields();

-- B) Forzar transacciones legítimas en INSERT (estado PENDIENTE + monto/plan válidos)
CREATE OR REPLACE FUNCTION public.guard_transacciones_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected_monto NUMERIC(10,2);
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  NEW.estado_pago := 'PENDIENTE';
  NEW.pasarela := COALESCE(NEW.pasarela, 'DEMO');

  expected_monto := CASE NEW.plan
    WHEN 'FLASH' THEN 1
    WHEN 'BASICO' THEN 2
    WHEN 'PLUS' THEN 3.5
    WHEN 'PRO' THEN 5.99
    WHEN 'MEGA' THEN 8.99
    ELSE NULL
  END;

  IF expected_monto IS NULL THEN
    RAISE EXCEPTION 'Plan de promoción no válido'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.monto IS DISTINCT FROM expected_monto THEN
    RAISE EXCEPTION 'El monto no coincide con el plan seleccionado'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS transacciones_guard_insert ON public.transacciones;
CREATE TRIGGER transacciones_guard_insert
  BEFORE INSERT ON public.transacciones
  FOR EACH ROW EXECUTE FUNCTION public.guard_transacciones_insert();

-- C) Quitar asignación automática de admin por email hardcoded
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre_completo, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.is_admin_email(text);

-- D) Permitir expirar promociones vencidas desde la app (función de mantenimiento)
GRANT EXECUTE ON FUNCTION public.expire_promociones() TO anon, authenticated;
