import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { u as useSignedUrl } from "./storage-CdR5AvBn.mjs";
import { u as useI18n } from "./router-CStixWKO.mjs";
import { I as Icons, T as Tag, j as ImageOff, d as Sparkles, k as MapPin } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function ProductCard({ p }) {
  const { t } = useI18n();
  const img = useSignedUrl("productos", p.imagenes?.[0]);
  const MotionLink = motion(Link);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MotionLink,
    {
      to: "/producto/$id",
      params: { id: p.id },
      initial: { y: 12, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: true, amount: 0.2 },
      whileHover: { translateY: -4, scale: 1.01 },
      transition: { duration: 0.45, ease: "easeOut" },
      className: `group relative flex flex-col overflow-hidden card-rounded border bg-card shadow-card transition-all will-change-transform ${p.es_destacado ? "shadow-featured ring-1 ring-warning/30" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden bg-muted glass-border", children: [
          img ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img,
              alt: p.titulo,
              width: 400,
              height: 400,
              loading: "lazy",
              decoding: "async",
              className: "h-full w-full object-cover transition-transform group-hover:scale-105"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "h-10 w-10" }) }),
          p.es_destacado && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute left-2 top-2 bg-gradient-featured text-warning-foreground border-0 gap-1 shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " ",
            t("featured")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-1 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-primary", children: [
            p.moneda,
            " ",
            Number(p.precio).toLocaleString(void 0, { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "line-clamp-2 text-sm font-medium leading-tight", children: p.titulo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-auto flex items-center gap-1 pt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
            p.ciudad
          ] })
        ] })
      ]
    }
  );
}
function CategoryNav({ categorias, activa }) {
  const MotionLink = motion(Link);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-4 overflow-x-auto px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MotionLink,
      {
        to: "/",
        className: `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition will-change-transform ${!activa ? "bg-gradient-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-accent"}`,
        whileHover: { scale: 1.03 },
        children: "Todas"
      }
    ),
    categorias.map((c) => {
      const Icon = Icons[c.icono] ?? Tag;
      const active = activa === c.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        MotionLink,
        {
          to: "/categoria/$id",
          params: { id: c.id },
          className: `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition will-change-transform ${active ? "bg-gradient-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-accent"}`,
          whileHover: { scale: 1.03 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            c.nombre
          ]
        },
        c.id
      );
    })
  ] }) });
}
const ECUADOR = {
  Azuay: [
    "Cuenca",
    "Gualaceo",
    "Paute",
    "Sigsig",
    "Girón",
    "Santa Isabel",
    "Chordeleg",
    "Nabón",
    "Camilo Ponce Enríquez"
  ],
  Bolívar: ["Guaranda", "San Miguel", "Chillanes", "Echeandía", "Caluma", "Las Naves"],
  Cañar: ["Azogues", "La Troncal", "Cañar", "Biblián", "El Tambo", "Déleg", "Suscal"],
  Carchi: ["Tulcán", "Montúfar", "Bolívar", "Espejo", "Mira", "San Pedro de Huaca"],
  Chimborazo: [
    "Riobamba",
    "Alausí",
    "Guano",
    "Chambo",
    "Colta",
    "Cumandá",
    "Guamote",
    "Pallatanga",
    "Penipe",
    "Chunchi"
  ],
  Cotopaxi: ["Latacunga", "La Maná", "Pujilí", "Salcedo", "Saquisilí", "Sigchos", "Pangua"],
  "El Oro": [
    "Machala",
    "Pasaje",
    "Santa Rosa",
    "Huaquillas",
    "Arenillas",
    "El Guabo",
    "Piñas",
    "Zaruma",
    "Atahualpa",
    "Balsas",
    "Chilla",
    "Las Lajas",
    "Marcabelí",
    "Portovelo"
  ],
  Esmeraldas: [
    "Esmeraldas",
    "Atacames",
    "Quinindé",
    "Muisne",
    "Eloy Alfaro",
    "Río Verde",
    "San Lorenzo"
  ],
  Galápagos: ["Puerto Ayora", "Puerto Baquerizo Moreno", "Puerto Villamil"],
  Guayas: [
    "Guayaquil",
    "Daule",
    "Durán",
    "Samborondón",
    "Milagro",
    "Salinas",
    "Playas",
    "Naranjal",
    "Naranjito",
    "El Triunfo",
    "Yaguachi",
    "Balzar",
    "Salitre",
    "Colimes",
    "Pedro Carbo",
    "Santa Lucía",
    "Simón Bolívar",
    "Lomas de Sargentillo",
    "Nobol",
    "General Villamil",
    "Isidro Ayora",
    "Balao"
  ],
  Imbabura: ["Ibarra", "Otavalo", "Cotacachi", "Antonio Ante", "Pimampiro", "Urcuquí"],
  Loja: [
    "Loja",
    "Catamayo",
    "Cariamanga",
    "Macará",
    "Saraguro",
    "Celica",
    "Alamor",
    "Calvas",
    "Chaguarpamba",
    "Espíndola",
    "Gonzanamá",
    "Olmedo",
    "Paltas",
    "Pindal",
    "Puyango",
    "Quilanga",
    "Sozoranga",
    "Zapotillo"
  ],
  "Los Ríos": [
    "Babahoyo",
    "Quevedo",
    "Ventanas",
    "Vinces",
    "Buena Fe",
    "Valencia",
    "Mocache",
    "Montalvo",
    "Palenque",
    "Puebloviejo",
    "Quinsaloma",
    "Urdaneta",
    "Baba"
  ],
  Manabí: [
    "Portoviejo",
    "Manta",
    "Chone",
    "Jipijapa",
    "Bahía de Caráquez",
    "Pedernales",
    "El Carmen",
    "Calceta",
    "Montecristi",
    "Rocafuerte",
    "Santa Ana",
    "Sucre",
    "Tosagua",
    "24 de Mayo",
    "Flavio Alfaro",
    "Jama",
    "Junín",
    "Olmedo",
    "Paján",
    "Pichincha",
    "Puerto López",
    "San Vicente",
    "Jaramijó"
  ],
  "Morona Santiago": [
    "Macas",
    "Sucúa",
    "Gualaquiza",
    "Limón Indanza",
    "Palora",
    "Santiago",
    "Logroño",
    "Pablo Sexto",
    "Huamboya",
    "San Juan Bosco",
    "Taisha",
    "Tiwintza"
  ],
  Napo: ["Tena", "Archidona", "El Chaco", "Quijos", "Carlos Julio Arosemena Tola"],
  Orellana: ["Francisco de Orellana (Coca)", "La Joya de los Sachas", "Loreto", "Aguarico"],
  Pastaza: ["Puyo", "Mera", "Santa Clara", "Arajuno"],
  Pichincha: [
    "Quito",
    "Cayambe",
    "Mejía (Machachi)",
    "Pedro Moncayo (Tabacundo)",
    "Rumiñahui (Sangolquí)",
    "San Miguel de los Bancos",
    "Pedro Vicente Maldonado",
    "Puerto Quito"
  ],
  "Santa Elena": ["Santa Elena", "La Libertad", "Salinas"],
  "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia"],
  Sucumbíos: [
    "Nueva Loja (Lago Agrio)",
    "Shushufindi",
    "Cascales",
    "Cuyabeno",
    "Gonzalo Pizarro",
    "Putumayo",
    "Sucumbíos"
  ],
  Tungurahua: [
    "Ambato",
    "Baños de Agua Santa",
    "Pelileo",
    "Píllaro",
    "Cevallos",
    "Mocha",
    "Patate",
    "Quero",
    "Tisaleo"
  ],
  "Zamora Chinchipe": [
    "Zamora",
    "Yantzaza",
    "Zumba",
    "El Pangui",
    "Centinela del Cóndor",
    "Chinchipe",
    "Nangaritza",
    "Palanda",
    "Paquisha",
    "Yacuambi"
  ]
};
const PROVINCIAS = Object.keys(ECUADOR).sort();
Array.from(new Set(Object.values(ECUADOR).flat())).sort();
export {
  CategoryNav as C,
  ECUADOR as E,
  PROVINCIAS as P,
  ProductCard as a
};
