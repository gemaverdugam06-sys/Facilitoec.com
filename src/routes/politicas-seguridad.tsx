import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/politicas-seguridad")({
  head: () => ({
    meta: [{ title: "Políticas de Seguridad | WINFAST" }],
  }),
  component: PoliticasSeguridad,
});

function PoliticasSeguridad() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-violet-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-violet-500/5 md:p-10">
          <header className="mb-8 border-b border-slate-800 pb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              <AlertTriangle className="h-4 w-4" />
              Seguridad
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Políticas de Seguridad y Contenido Prohibido
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              En WINFAST nos comprometemos a mantener una plataforma segura y legal para todos
              nuestros usuarios.
            </p>
          </header>

          <div className="space-y-8 text-base leading-8 text-slate-200">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                Contenido Prohibido
              </h2>
              <p className="mb-4">
                Las siguientes categorías de productos, servicios y contenido NO están permitidos en
                WINFAST. Las publicaciones que incumplan estas políticas serán rechazadas
                automáticamente y podrán resultar en la suspensión de tu cuenta.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {prohibitedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
                  >
                    <h3 className="mb-2 font-bold text-red-300">{category.title}</h3>
                    <p className="text-sm text-slate-300">{category.description}</p>
                    {category.examples && (
                      <p className="mt-2 text-xs text-slate-400">
                        <span className="font-semibold">Ejemplos:</span> {category.examples}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">Validación de Contenido</h2>
              <p className="mb-4">
                Implementamos un sistema de validación automática y manual para detectar y prevenir
                contenido prohibido:
              </p>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Validación Automática en Tiempo Real</p>
                    <p className="text-sm text-slate-400">
                      Nuestro sistema analiza el título y descripción de tu publicación en busca de
                      palabras clave prohibidas.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Revisión Manual por Moderadores</p>
                    <p className="text-sm text-slate-400">
                      Cada publicación se revisa manualmente para asegurar que cumple con nuestras
                      políticas.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Sistema de Reportes de Usuarios</p>
                    <p className="text-sm text-slate-400">
                      Los usuarios pueden reportar contenido sospechoso o inapropiado para revisión
                      inmediata.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                    4
                  </span>
                  <div>
                    <p className="font-semibold">Validación de Archivos</p>
                    <p className="text-sm text-slate-400">
                      Las imágenes se analizan para detectar malware, y se bloquean extensiones de
                      archivo peligrosas.
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">
                ¿Qué Sucede si Publico Contenido Prohibido?
              </h2>
              <div className="space-y-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-5">
                <div>
                  <p className="mb-2 font-semibold text-orange-300">Primera Vez:</p>
                  <p className="text-sm">
                    Tu publicación será rechazada y recibirás una notificación explicando la razón.
                    Podrás intentar nuevamente con contenido que cumpla las políticas.
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-orange-300">Múltiples Violaciones:</p>
                  <p className="text-sm">
                    Si continúas publicando contenido prohibido, tu cuenta será suspendida
                    temporalmente o permanentemente.
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-orange-300">Reporte a Autoridades:</p>
                  <p className="text-sm">
                    En casos de actividades claramente ilegales, WINFAST se reserva el derecho de
                    reportar el asunto a las autoridades competentes.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">Cumplimiento Legal</h2>
              <p>
                WINFAST cumple con todas las leyes y regulaciones de la República del Ecuador,
                incluyendo:
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-300">
                <li>Código Orgánico Integral Penal (COIP)</li>
                <li>Ley de Protección de Derechos del Consumidor</li>
                <li>Normas de Seguridad y Comercio Electrónico</li>
                <li>Regulaciones sobre Protección de Datos Personales</li>
              </ul>
            </section>

            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">¿Tienes Dudas?</h2>
              <p>
                Si tienes preguntas sobre si tu contenido cumple con nuestras políticas, te
                recomendamos:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>✓ Leer esta política completamente antes de publicar</li>
                <li>✓ Revisar el título y descripción para palabras sospechosas</li>
                <li>✓ Asegurar que los archivos sean imágenes legítimas de tu producto</li>
                <li>✓ Contactar al equipo de soporte si no estás seguro</li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

const prohibitedCategories = [
  {
    id: "drogas",
    title: "🚫 Drogas y Sustancias Ilegales",
    description:
      "Se prohíbe completamente la venta de drogas, sustancias controladas, y cualquier artículo relacionado con su consumo.",
    examples: "Marihuana, cocaína, heroína, metanfetamina, éxtasis, LSD, fentanilo",
  },
  {
    id: "armas",
    title: "🔫 Armas, Municiones y Explosivos",
    description:
      "No se permite la comercialización de armas de fuego, armas blancas prohibidas, municiones o explosivos de ningún tipo.",
    examples: "Pistolas, rifles, explosivos, granadas, detonadores",
  },
  {
    id: "robado",
    title: "🚗 Productos Robados o Ilícitos",
    description:
      "Está prohibido vender productos que sean robados o que provengan de actividades ilícitas.",
    examples: "Electrónicos robados, vehículos sin documentación, bienes de procedencia dudosa",
  },
  {
    id: "falsificado",
    title: "📄 Documentos Falsificados",
    description:
      "No se permite la oferta de documentación falsificada, modificada o fraudulenta de ningún tipo.",
    examples:
      "Cédulas falsas, pasaportes falsificados, títulos académicos falsos, licencias falsificadas",
  },
  {
    id: "fraude",
    title: "💰 Fraudes y Estafas",
    description:
      "Se prohíben esquemas de fraude, estafas, dinero falsificado y actividades fraudulentas.",
    examples: "Esquemas Ponzi, dinero falso, servicios que no se prestarán",
  },
  {
    id: "servicios",
    title: "⛔ Servicios Ilegales",
    description: "No se permiten servicios cuya prestación sea ilegal en Ecuador.",
    examples: "Tráfico de personas, servicios sexuales ilegales, actividades de explotación",
  },
  {
    id: "malware",
    title: "🦠 Malware y Archivos Peligrosos",
    description:
      "Se prohíbe distribuir archivos maliciosos, código dañino, virus o cualquier software malévolo.",
    examples: "Virus, ransomware, spyware, troyanos, keyloggers",
  },
  {
    id: "menores",
    title: "👶 Explotación de Menores",
    description:
      "Cualquier contenido que explote, abuse o sexualice a menores de edad está completamente prohibido.",
    examples: "Material sexual infantil, explotación de menores",
  },
];
