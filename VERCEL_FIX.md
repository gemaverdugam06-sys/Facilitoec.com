# Guía de Despliegue en Vercel — Corrección de Errores

## Resumen del problema

Tu app compila correctamente, pero Vercel no sabía cómo servir el servidor SSR generado por TanStack Start. He agregado un handler de Node.js que Vercel puede ejecutar para servir la app dinámicamente.

## Cambios realizados

1. **api/index.js** — Punto de entrada que Vercel ejecuta para todas las peticiones
2. **vercel.json** — Configuración que dice a Vercel:
   - Servir assets estáticos desde `dist/client`
   - Ejecutar el handler para rutas dinámicas
3. **.vercelignore** — Archivos a excluir del despliegue (reduce tamaño)

## Pasos en Vercel para que funcione

### 1. Actualizar configuración del proyecto

En tu proyecto de Vercel:

1. Ve a **Settings** → **Build & Deployment**
2. Verifica que muestre:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (esto puede dejar vacío, Vercel lo detecta)
   - **Install Command**: `npm install`

3. En **Settings** → **Environment Variables**, agrega TODAS estas variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxx...
VITE_SUPABASE_ANON_KEY=eyJxx... (o el mismo publishable key)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...
VITE_PAYPHONE_LINK=https://payp.page/l/FacilitoEC
VITE_OG_IMAGE_URL=https://tu-dominio.com/og-image.png
NODE_ENV=production
```

**⚠️ Importante**: Sin `SUPABASE_SERVICE_ROLE_KEY`, el servidor no podrá hacer queries admin.

### 2. Triggerear nuevo deploy

1. Ve a **Deployments** en Vercel
2. Haz clic en los 3 puntos (...) del último deploy
3. Selecciona **Redeploy**

O usa Git: haz commit y push, Vercel redesplegará automáticamente.

### 3. Monitorear el build

1. En **Deployments**, abre el deploy en progreso
2. Ve a **Logs** → **Build**
3. Busca errores como:
   - "npm install" falla → problema con dependencias
   - "npm run build" falla → problema en la compilación
   - Errores de variables de entorno

4. Ve a **Logs** → **Runtime** después de que el build termine
5. Busca errores de ejecución

### 4. Verificar la app

Una vez que el deploy esté completo:

- Abre la URL de tu proyecto en Vercel
- Debería cargar la página principal
- Prueba login, crear publicaciones, etc.

## Si sigue fallando

### Síntoma: "Build failed"

**Posible causa**: Falta una variable de entorno en tiempo de build.

**Solución**: 
- Revisa los logs de build en Vercel
- Asegúrate de que TODAS las variables VITE_* estén agregadas

### Síntoma: "Deploy succeeded" pero página en blanco o 500 error

**Posible causa**: Error en runtime (Supabase offline, variable de entorno faltante, etc).

**Solución**:
- Revisa los logs de runtime en Vercel → **Function Logs**
- Busca mensajes como "SUPABASE_SERVICE_ROLE_KEY" missing

### Síntoma: Assets (CSS, JS) no cargan, solo HTML

**Posible causa**: vercel.json no está sirviendo assets correctamente.

**Solución**:
- Verifica que `dist/client/assets/` exista localmente (ejecuta `npm run build`)
- Reinicia el deploy

## Testing local antes de Vercel (opcional)

Puedes simular el handler de Vercel localmente:

```bash
node --input-type=module -e "
import handler from './api/index.js';
const req = {
  method: 'GET',
  headers: { host: 'localhost', 'x-forwarded-proto': 'https' },
  url: '/',
  on() {}
};
const res = {
  statusCode: 200,
  setHeader() {},
  end(v) { console.log(v.slice(0, 300)); }
};
await handler(req, res);
"
```

Si imprime HTML válido, significa que el handler está funcionando.

## Próximos pasos

1. Haz `git add .` y `git commit -m "Fix Vercel SSR deployment"`
2. Haz `git push`
3. Vercel desplegará automáticamente
4. Espera a que termine el build (5-10 min típicamente)
5. Si ves algún error en los logs, cuéntame qué dice exactamente
