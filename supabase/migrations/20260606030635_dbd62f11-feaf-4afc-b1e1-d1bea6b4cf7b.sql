
-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT,
  ciudad TEXT,
  telefono TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =========================================
-- CATEGORIAS
-- =========================================
CREATE TABLE public.categorias (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  icono TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.categorias TO anon, authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_select_all" ON public.categorias FOR SELECT USING (true);

INSERT INTO public.categorias (id, nombre, icono, orden) VALUES
  ('tecnologia', 'Tecnología y Electrónica', 'Laptop', 1),
  ('vehiculos', 'Vehículos', 'Car', 2),
  ('hogar', 'Hogar y Muebles', 'Sofa', 3),
  ('moda', 'Moda y Belleza', 'Shirt', 4),
  ('inmuebles', 'Inmuebles', 'Home', 5),
  ('deportes', 'Deportes y Aire Libre', 'Dumbbell', 6),
  ('empleo', 'Empleo y Servicios', 'Briefcase', 7),
  ('ninos', 'Niños y Bebés', 'Baby', 8),
  ('mascotas', 'Mascotas', 'PawPrint', 9);

-- =========================================
-- PRODUCTOS
-- =========================================
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(12,2) NOT NULL DEFAULT 0,
  moneda TEXT NOT NULL DEFAULT 'USD',
  categoria_id TEXT NOT NULL REFERENCES public.categorias(id),
  ciudad TEXT NOT NULL,
  imagenes TEXT[] NOT NULL DEFAULT '{}',
  estado TEXT NOT NULL DEFAULT 'nuevo',
  whatsapp TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  es_destacado BOOLEAN NOT NULL DEFAULT false,
  promocionado_hasta TIMESTAMPTZ,
  tipo_promocion TEXT NOT NULL DEFAULT 'NINGUNO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.productos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.productos TO authenticated;
GRANT ALL ON public.productos TO service_role;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "productos_select_all" ON public.productos FOR SELECT USING (true);
CREATE POLICY "productos_insert_own" ON public.productos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "productos_update_own" ON public.productos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "productos_delete_own" ON public.productos FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_productos_destacados ON public.productos(es_destacado) WHERE es_destacado = true;
CREATE INDEX idx_productos_categoria ON public.productos(categoria_id);
CREATE INDEX idx_productos_user ON public.productos(user_id);
CREATE INDEX idx_productos_created ON public.productos(created_at DESC);

-- =========================================
-- TRANSACCIONES
-- =========================================
CREATE TABLE public.transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  monto NUMERIC(10,2) NOT NULL,
  estado_pago TEXT NOT NULL DEFAULT 'PENDIENTE',
  pasarela TEXT NOT NULL DEFAULT 'DEMO',
  plan TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.transacciones TO authenticated;
GRANT ALL ON public.transacciones TO service_role;
ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transacciones_select_own" ON public.transacciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transacciones_insert_own" ON public.transacciones FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================
-- CHATS Y MENSAJES
-- =========================================
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  comprador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendedor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(producto_id, comprador_id)
);
GRANT SELECT, INSERT, UPDATE ON public.chats TO authenticated;
GRANT ALL ON public.chats TO service_role;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chats_select_participant" ON public.chats FOR SELECT USING (auth.uid() = comprador_id OR auth.uid() = vendedor_id);
CREATE POLICY "chats_insert_buyer" ON public.chats FOR INSERT WITH CHECK (auth.uid() = comprador_id);
CREATE POLICY "chats_update_participant" ON public.chats FOR UPDATE USING (auth.uid() = comprador_id OR auth.uid() = vendedor_id);

CREATE TABLE public.mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  remitente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.mensajes TO authenticated;
GRANT ALL ON public.mensajes TO service_role;
ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mensajes_select_chat_participant" ON public.mensajes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chats c WHERE c.id = chat_id AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid()))
);
CREATE POLICY "mensajes_insert_chat_participant" ON public.mensajes FOR INSERT WITH CHECK (
  auth.uid() = remitente_id AND
  EXISTS (SELECT 1 FROM public.chats c WHERE c.id = chat_id AND (c.comprador_id = auth.uid() OR c.vendedor_id = auth.uid()))
);

CREATE INDEX idx_mensajes_chat ON public.mensajes(chat_id, created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE public.mensajes;
ALTER TABLE public.mensajes REPLICA IDENTITY FULL;

-- =========================================
-- TRIGGERS
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_productos_updated BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_chats_updated BEFORE UPDATE ON public.chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-crea profile al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre_completo, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para expirar promociones (puede ejecutarse on-read)
CREATE OR REPLACE FUNCTION public.expire_promociones()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.productos
  SET es_destacado = false, tipo_promocion = 'NINGUNO'
  WHERE es_destacado = true AND promocionado_hasta IS NOT NULL AND promocionado_hasta < now();
END; $$;
