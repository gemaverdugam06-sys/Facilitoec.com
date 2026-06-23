CREATE OR REPLACE FUNCTION public.check_contenido_prohibido()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  texto TEXT;
  prohibidas TEXT[] := ARRAY[
    -- armas
    'arma','armas','pistola','pistolas','revolver','revólver','rifle','escopeta',
    'fusil','municion','munición','municiones','bala','balas','cartucho','granada',
    'explosivo','explosivos','dinamita','silenciador','ak47','ak-47','glock','uzi',
    -- sexual / explícito
    'porno','pornografia','pornografía','xxx','sexo','sexual','escort','escorts',
    'prostitucion','prostitución','prostituta','prepago','servicios sexuales',
    'desnudo','desnuda','desnudos','desnudas','nude','nudes','onlyfans',
    'pene','vagina','masturbacion','masturbación',
    -- violencia / drogas / ilegal
    'matar','asesinar','asesinato','tortura','violacion','violación','violar',
    'pedofilia','menor de edad sexual','zoofilia',
    'cocaina','cocaína','marihuana','heroina','heroína','crack','metanfetamina',
    'lsd','éxtasis','extasis','drogas ilegales'
  ];
  palabra TEXT;
BEGIN
  texto := lower(coalesce(NEW.titulo,'') || ' ' || coalesce(NEW.descripcion,''));
  FOREACH palabra IN ARRAY prohibidas LOOP
    IF position(palabra IN texto) > 0 THEN
      RAISE EXCEPTION 'Contenido prohibido detectado ("%"). No se permiten armas, contenido sexual, violencia ni drogas ilegales.', palabra
        USING ERRCODE = 'check_violation';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS productos_contenido_prohibido_ins ON public.productos;
DROP TRIGGER IF EXISTS productos_contenido_prohibido_upd ON public.productos;

CREATE TRIGGER productos_contenido_prohibido_ins
  BEFORE INSERT ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.check_contenido_prohibido();

CREATE TRIGGER productos_contenido_prohibido_upd
  BEFORE UPDATE OF titulo, descripcion ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.check_contenido_prohibido();