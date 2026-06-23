import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

export function CategoryNav({ categorias, activa }: { categorias: Categoria[]; activa?: string }) {
  const MotionLink = motion(Link as any);
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3">
      <div className="flex gap-3">
        <MotionLink
          to="/"
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition will-change-transform ${
            !activa ? "bg-gradient-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-accent"
          }`}
          whileHover={{ scale: 1.03 }}
        >
          Todas
        </MotionLink>
        {categorias.map((c) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[c.icono] ?? Icons.Tag;
          const active = activa === c.id;
          return (
            <MotionLink
              key={c.id}
              to="/categoria/$id"
              params={{ id: c.id }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition will-change-transform ${
                active ? "bg-gradient-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-accent"
              }`}
              whileHover={{ scale: 1.03 }}
            >
              <Icon className="h-4 w-4" />
              {c.nombre}
            </MotionLink>
          );
        })}
      </div>
    </div>
  );
}
