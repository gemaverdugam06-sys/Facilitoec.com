# Instrucciones de publicación y administración

## 1. Publicar la app

### Variables de entorno obligatorias
Agrega estas variables en Vercel o en el hosting que uses:

- `VITE_SUPABASE_URL` = la URL de tu proyecto Supabase, por ejemplo `https://<tu-proyecto>.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = la clave pública/anónima de Supabase
- `VITE_SUPABASE_ANON_KEY` = puedes usar el mismo valor que `VITE_SUPABASE_PUBLISHABLE_KEY` si tu proyecto lo usa así
- `SUPABASE_URL` = la misma URL que `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` = la clave de service role de Supabase (solo servidor)
- `VITE_OG_IMAGE_URL` = la URL pública de tu imagen Open Graph
- `NODE_ENV` = `production`

### Configuración de Vercel
- Framework preset: `Vite` o `Other`
- Build command: `npm run build`
- Output directory: `dist`

### Pasos finales
1. Sube el proyecto a GitHub/Git.
2. Conecta el repositorio en Vercel.
3. Añade las variables de entorno anteriores.
4. Haz deploy.
5. Prueba la URL pública.

## 2. Verificar Supabase antes de abrir la web

Asegúrate de que en Supabase estén listas estas cosas:
- La migración de roles ya aplicada.
- La autenticación activa (email/phone si la usas).
- El bucket `comprobantes` creado si vas a subir comprobantes de pago.
- Los redirects de auth configurados si usas recuperación de contraseña o verificación.

## 3. Dar permisos de administrador

Ejecuta este SQL en el SQL Editor de Supabase una vez que ya estés logueado con la cuenta que quieres convertir en admin:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower('tu-correo@dominio.com')
ON CONFLICT (user_id, role) DO NOTHING;
```

Cambia `tu-correo@dominio.com` por el correo real de la cuenta.

### Qué pasa después
- Al iniciar sesión, la app comprobará si ese usuario tiene rol `admin`.
- Si tiene permiso, aparecerá el botón de Panel Admin en el header y podrá entrar a `/admin`.

## 4. Qué puede hacer el admin

En el panel de administración puedes:
- Ver los pagos pendientes.
- Aprobar una promoción/pago.
- Rechazar una promoción/pago con motivo.
- Ver el comprobante cargado por el usuario.

Al aprobar, la app marca la transacción como `COMPLETADA` y activa la promoción del producto.

## 5. Nota importante

Si las variables de Supabase no están configuradas, la app puede quedar en modo de lectura temporal. Para que funcione todo el flujo completo (publicar, login, pagos, admin), deben estar definidas correctamente en producción.
