import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">WINFAST</p>
            <p className="text-sm text-slate-400">© 2026 WINFAST. Plataforma digital independiente.</p>
          </div>

          <nav aria-label="Enlaces legales" className="flex flex-wrap items-center gap-3 text-sm">
            <Link to="/terminos" className="transition-colors hover:text-white">
              Términos y condiciones
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/privacidad" className="transition-colors hover:text-white">
              Política de privacidad
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/politicas-seguridad" className="transition-colors hover:text-white">
              Políticas de seguridad
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
