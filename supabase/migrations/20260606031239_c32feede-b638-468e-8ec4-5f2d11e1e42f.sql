
ALTER TABLE public.productos
  ADD CONSTRAINT productos_user_profile_fk FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.chats
  ADD CONSTRAINT chats_comprador_profile_fk FOREIGN KEY (comprador_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT chats_vendedor_profile_fk  FOREIGN KEY (vendedor_id)  REFERENCES public.profiles(id) ON DELETE CASCADE;
