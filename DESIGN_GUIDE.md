Design System - FACILITOEC

Resumen rápido
- Paleta vibrante: gradientes primarios y secundarios para CTAs y highlights.
- Tipografías: Poppins (display) + Inter (cuerpo).
- Efectos: glassmorphism, soft shadows, micro-interactions con framer-motion.

Variables (en `src/styles.css` :root)
- --color-1: #7c3aed (indigo)
- --color-2: #ff4d6d (warm pink)
- --color-3: #06b6d4 (cyan)
- --color-4: #f59e0b (amber)
- --glass-bg: base para glassmorphism
- --radius-lg: 16px

Clases y utilidades principales
- `.bg-gradient-primary` - gradiente principal (90deg) usado en CTAs y elementos destacados.
- `.bg-gradient-featured` - gradiente secundario para badges "featured".
- `.text-gradient-primary` - texto con gradiente (usa `bg-clip: text`).
- `.glass` - fondo semitransparente con `backdrop-filter: blur(8px)`.
- `.glass-border` - variante con borde sutil para cards.
- `.btn-cta` - botón principal con gradiente + sombra fuerte.
- `.card-rounded` - border-radius grande para tarjetas.
- `.soft-shadow`, `.shadow-card`, `.shadow-hover`, `.shadow-featured` - sombras para profundidad suave.
- `.will-change-transform` - optimización para elementos animados.

Patrones recomendados
- Animaciones: usar `framer-motion` con `initial` / `animate` y `whileHover` para micro-interactions. Preferir `whileInView` con `once: true` para evitar impacto en scroll.
- Imágenes: `loading="lazy"` + `decoding="async"` ya aplicado.
- CTA: colocar `btn-cta` en botones principales (publicar, chat, hero CTA).
- Grid: usar `gap-4` o mayor para espacios respirables entre tarjetas.

Performance
- Evitar animaciones pesadas (no animar layout). Animar `transform` y `opacity` preferentemente.
- Usar `will-change-transform` en elementos que cambian.
- Optimizar imágenes a WebP y servir tamaños adecuados para LCP.

Cómo extender
- Añadir más tokens en `:root` (ej. `--radius-sm`, `--space-lg`) y mapearlos en `tailwind.config.js` si se requiere integración con clases de Tailwind.
- Añadir componentes React `Motion` wrapper para patrones comunes (ej. `MotionCard`, `MotionImage`).

Ejemplo rápido de uso (React + framer-motion)

```tsx
import { motion } from 'framer-motion'

<motion.div initial={{ y:8, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.4 }}>
  <h1 className="logo-heading text-4xl">Título</h1>
</motion.div>
```

Notas
- Las clases nuevas están en `src/styles.css` y pueden coexistir con las utilidades de Tailwind.
- Para cambiar la paleta global, edita `:root` en `src/styles.css` y `backgroundImage` en `tailwind.config.js`.

Contacto
- Pide cambios de tema, contraste o accesibilidad y adaptaré el sistema según necesidades.
