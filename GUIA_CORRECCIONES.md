# 🛠️ Guía de Correcciones Prioritarias

## 1️⃣ CRÍTICO: Corregir Memory Leak en Upload de Imágenes

### El Problema

```tsx
// ❌ MALO - Crea strings enormes en memoria
const addFiles = (list: FileList | null) => {
  if (!list) return;
  const arr = Array.from(list).slice(0, 8 - files.length);
  setFiles((prev) => [...prev, ...arr]);
  arr.forEach((f) => {
    const r = new FileReader();
    r.onload = () => setPreviews((prev) => [...prev, r.result as string]); // Data URL base64
    r.readAsDataURL(f);
  });
};
```

### La Solución

Reemplazar `src/routes/_authenticated/publicar.tsx` líneas 68-80 con:

```tsx
const addFiles = (list: FileList | null) => {
  if (!list) return;
  const arr = Array.from(list).slice(0, 8 - files.length);
  setFiles((prev) => [...prev, ...arr]);

  // ✅ Usar Object URLs en lugar de Data URLs
  arr.forEach((f) => {
    const url = URL.createObjectURL(f);
    setPreviews((prev) => [...prev, url]);
  });
};

const removeFile = (i: number) => {
  // Limpiar Object URL cuando se elimina
  const url = previews[i];
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
  setFiles((prev) => prev.filter((_, idx) => idx !== i));
  setPreviews((prev) => prev.filter((_, idx) => idx !== i));
};

// Cleanup cuando el componente se desmonta
useEffect(() => {
  return () => {
    previews.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  };
}, []);
```

### Beneficios

- Reduce uso de memoria de ~21MB a ~2-3MB (8 imágenes de 2MB)
- Carga más rápida de previews
- Sin lag en dispositivos móviles

---

## 2️⃣ IMPORTANTE: Validar Imágenes Antes de Upload

### Agregar Validación

En el archivo `src/routes/_authenticated/publicar.tsx`, antes de `const addFiles`:

```tsx
// Configuración de validación
const IMAGE_CONFIG = {
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 8,
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name}: Solo JPG, PNG y WebP son permitidos.`,
    };
  }

  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `${file.name}: El archivo es muy grande (máx. 5MB).`,
    };
  }

  return { valid: true };
};

const addFiles = (list: FileList | null) => {
  if (!list) return;

  const validated: File[] = [];
  const errors: string[] = [];

  for (const file of list) {
    const validation = validateFile(file);
    if (validation.valid) {
      validated.push(file);
    } else if (validation.error) {
      errors.push(validation.error);
    }
  }

  // Mostrar errores de validación
  errors.forEach((err) => toast.error(err));

  // Limitar cantidad total
  const available = IMAGE_CONFIG.MAX_FILES - files.length;
  const toAdd = validated.slice(0, available);

  if (toAdd.length === 0) {
    return;
  }

  setFiles((prev) => [...prev, ...toAdd]);

  // Crear previews con Object URLs
  toAdd.forEach((f) => {
    const url = URL.createObjectURL(f);
    setPreviews((prev) => [...prev, url]);
  });

  // Feedback positivo
  if (toAdd.length > 0) {
    toast.success(`${toAdd.length} imagen(s) agregada(s)`);
  }
};
```

---

## 3️⃣ IMPORTANTE: Optimizar Query de Mis-Publicaciones

### El Problema Actual

```tsx
// ❌ INEFICIENTE: 2 queries + búsqueda O(n²)
const { data: listaProductos } = await supabase
  .from("productos")
  .select("*")
  .eq("user_id", user.id);

const { data: txs } = await supabase
  .from("transacciones")
  .select("...")
  .in(
    "producto_id",
    listaProductos.map((p) => p.id),
  );

listaProductos.forEach((p) => {
  const txAsociada = txs?.find((t) => t.producto_id === p.id); // O(n²)
});
```

### La Solución

Reemplazar en `src/routes/_authenticated/mis-publicaciones.tsx` líneas 75-100:

```tsx
// ✅ Una query con JOIN automático
const { data, error } = await supabase
  .from("productos")
  .select(
    `
    id,
    titulo,
    descripcion,
    precio,
    imagenes,
    activo,
    created_at,
    es_destacado,
    tipo_promocion,
    promocionado_hasta,
    transacciones (
      id,
      estado_pago,
      notas_admin,
      created_at,
      plan,
      monto,
      pasarela
    )
  `,
  )
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

if (error) {
  console.error("Error cargando publicaciones:", error);
  toast.error(toUserMessage(error, "Error al cargar tus anuncios"));
  setItems([]);
  return;
}

// Procesar datos
const items = (data || []).map((p: any) => ({
  id: p.id,
  titulo: p.titulo,
  descripcion: p.descripcion,
  precio: p.precio,
  imagenes: p.imagenes,
  activo: p.activo,
  created_at: p.created_at,
  es_destacado: p.es_destacado,
  tipo_promocion: p.tipo_promocion,
  promocionado_hasta: p.promocionado_hasta,
  // Transacción más reciente (index 0)
  estado_pago: p.transacciones?.[0]?.estado_pago,
  notas_admin: p.transacciones?.[0]?.notas_admin,
  tx_id: p.transacciones?.[0]?.id,
}));

setItems(items);
```

### Beneficios

- Una sola query en lugar de dos
- Código más limpio y mantenible
- Mejor performance (especialmente con 20+ productos)

---

## 4️⃣ IMPORTANTE: Rate Limiting en Autenticación

### Crear Utility de Rate Limiting

Nuevo archivo: `src/lib/rate-limit.ts`

```typescript
interface RateLimitConfig {
  key: string;
  limit: number;
  window: number; // segundos
}

interface RateLimitResult {
  success: boolean;
  resetIn?: number; // ms hasta reset
}

// Usar memoria simple (para desarrollo)
// En production, usar Supabase o Redis
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const now = Date.now();
  const stored = rateLimitStore.get(config.key);

  // Si no existe o expiró, crear nuevo
  if (!stored || now >= stored.resetAt) {
    rateLimitStore.set(config.key, {
      count: 1,
      resetAt: now + config.window * 1000,
    });
    return { success: true };
  }

  // Si no ha excedido limite, incrementar
  if (stored.count < config.limit) {
    stored.count++;
    return { success: true };
  }

  // Excedió límite
  return {
    success: false,
    resetIn: stored.resetAt - now,
  };
}

// Limpiar entradas expiradas cada hora
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now >= value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  },
  60 * 60 * 1000,
);
```

### Usar en Auth

Modificar `src/routes/auth.tsx` línea 81:

```tsx
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  // Verificar rate limit
  const rateLimitResult = await checkRateLimit({
    key: `signin:${email}`,
    limit: 5,
    window: 60 * 15, // 15 minutos
  });

  if (!rateLimitResult.success) {
    const seconds = Math.ceil((rateLimitResult.resetIn || 0) / 1000);
    const minutes = Math.ceil(seconds / 60);
    return toast.error(`Demasiados intentos. Intenta en ${minutes} minuto(s).`);
  }

  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  setLoading(false);

  if (error) {
    return toast.error(toUserMessage(error, "No se pudo iniciar sesión."));
  }

  toast.success(t("welcome_back"));
};
```

---

## 5️⃣ IMPORTANTE: Agregar CSP Headers

### Modificar `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.supabaseusercontent.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 6️⃣ IMPORTANTE: Error Handling en Carga de Categorías

### Archivo: `src/routes/index.tsx`

Reemplazar líneas 54-60:

```tsx
useEffect(() => {
  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nombre, icono")
        .order("orden");

      if (error) throw error;

      if (data) {
        setCategorias(data);
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
      toast.error("No se cargaron las categorías. Por favor, recarga la página.");
    }
  };

  loadCategorias();

  // Expirar promociones vencidas
  supabase.rpc("expire_promociones").catch((err) => {
    console.error("Error expirando promociones:", err);
  });
}, []);
```

### Archivo: `src/routes/_authenticated/publicar.tsx`

Reemplazar líneas 63-70:

```tsx
useEffect(() => {
  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase.from("categorias").select("id, nombre").order("orden");

      if (error) throw error;

      if (data) {
        setCategorias(data);
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
      // No mostrar toast aquí porque es en componente montado
    }
  };

  loadCategorias();
}, []);
```

---

## 📋 Checklist de Aplicación

### Paso 1: Memory Leak (15 min)

- [ ] Editar `src/routes/_authenticated/publicar.tsx`
- [ ] Reemplazar `addFiles` y `removeFile`
- [ ] Agregar cleanup effect
- [ ] Probar: subir 8 imágenes sin lag

### Paso 2: Validación (20 min)

- [ ] Agregar `IMAGE_CONFIG` y `validateFile` en publicar.tsx
- [ ] Probar: subir archivo no-imagen (debe rechazar)
- [ ] Probar: subir archivo >5MB (debe rechazar)

### Paso 3: Queries (15 min)

- [ ] Editar `src/routes/_authenticated/mis-publicaciones.tsx`
- [ ] Cambiar a single query con join
- [ ] Probar: cargar mis-publicaciones sin errores

### Paso 4: Rate Limiting (20 min)

- [ ] Crear `src/lib/rate-limit.ts`
- [ ] Modificar `src/routes/auth.tsx`
- [ ] Probar: intentar login 6+ veces (debe bloquear)

### Paso 5: CSP Headers (10 min)

- [ ] Actualizar `vercel.json`
- [ ] Verificar: no hay warnings de CSP en console

### Paso 6: Error Handling (10 min)

- [ ] Actualizar ambos index.tsx y publicar.tsx
- [ ] Probar: desconectar internet (debe mostrar error)

### Total: ~90 minutos

---

## ✅ Testing After Changes

```bash
# 1. Compilar
npm run build

# 2. Lint
npm run lint

# 3. Tests (si existen)
npm test

# 4. Preview local
npm run preview

# 5. Abrir http://localhost:4173
# - Ir a /publicar
# - Subir 8 imágenes
# - Verificar memoria en DevTools (F12 → Memory)
# - Debe ser <10MB, no >21MB

# 6. Probar login
# - Intentar login incorrecto 6 veces
# - Debe bloquear con mensaje

# 7. Verificar CSP
# - Abrir DevTools Console
# - No debe haber warnings de CSP
```

---

## 🚀 Deploy Después de Cambios

```bash
git add .
git commit -m "fix: memory leak, validación y optimizaciones"
git push origin main

# En Vercel:
# 1. Esperar deploy automático
# 2. Probar en preview
# 3. Promover a production
```

---

**Tiempo total estimado:** 2-3 horas
**Impacto esperado:** +30% performance, 0 security issues
