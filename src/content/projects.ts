import type { VehicleId } from '@/lib/projection-assumptions';

export type ProjectStatus = 'open' | 'coming-soon';

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  vehicle: VehicleId;
  assetType: string;
  location: string;
  summary: string;
  description: readonly string[];
  facts: readonly ProjectFact[];
  amenities: readonly string[];
  images: readonly ProjectImage[];
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  open: 'Abierto',
  'coming-soon': 'Próximamente',
};

/**
 * Fichas de las promociones del dossier CARBAJAL.001. Los textos y los datos técnicos salen del
 * PDF; las condiciones económicas no vienen en el documento y se comparten en la sesión privada.
 * Ninguna cifra de inversión o retorno se inventa en la interfaz.
 */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'anelo',
    name: 'Añelo',
    status: 'coming-soon',
    vehicle: 'development',
    assetType: 'Habitacional y servicios',
    location: 'Añelo, Neuquén',
    summary: 'Un desarrollo habitacional y de servicios en el corazón operativo de Vaca Muerta.',
    description: [
      'Neuquén y Añelo conforman hoy el epicentro de mayor dinamismo y proyección para la inversión inmobiliaria vinculada al desarrollo del sector energético en la región.',
      'Mientras la capital neuquina se consolida como el gran centro corporativo y financiero de la Patagonia, Añelo —en el corazón operativo de Vaca Muerta, una de las mayores reservas de gas y petróleo del mundo— presenta una demanda habitacional, logística y de servicios corporativos altamente insatisfecha, impulsada por la radicación constante de operadoras y contratistas internacionales.',
      'Juntos representan un ecosistema único de alta rentabilidad y valorización acelerada de activos, donde el déficit estructural de infraestructura ofrece oportunidades excepcionales para el desarrollo inmobiliario estratégico y la generación de flujos sólidos bajo esquemas de capital protegido.',
    ],
    facts: [
      { label: 'Ubicación', value: 'Añelo, Neuquén' },
      { label: 'Zona', value: 'Vaca Muerta' },
      { label: 'Uso', value: 'Habitacional, logística y servicios' },
    ],
    amenities: [],
    images: [
      {
        src: '/media/proyectos/anelo_1.jpg',
        alt: 'Vista aérea del complejo residencial y de servicios previsto en Añelo, Neuquén.',
      },
      {
        src: '/media/proyectos/anelo_2.jpg',
        alt: 'Render de las viviendas del desarrollo en Añelo, Neuquén.',
      },
      {
        src: '/media/proyectos/anelo_3.jpg',
        alt: 'Mapa de ubicación de Añelo en la provincia de Neuquén.',
      },
    ],
  },
  {
    slug: 'one',
    name: 'ONE',
    status: 'coming-soon',
    vehicle: 'real-estate',
    assetType: 'Comercio, oficina y vivienda',
    location: 'Canning, Buenos Aires',
    summary:
      '30.000 m² de usos mixtos entre oficinas, locales comerciales y viviendas, con terrazas verdes y amenities.',
    description: [
      'Canning se consolida hoy como uno de los polos de mayor absorción, valorización y dinamismo inmobiliario del corredor sur bonaerense. Gracias a su cercanía con la Capital Federal y su conectividad estratégica con los principales accesos y el Aeropuerto Internacional de Ezeiza, la zona atrae una demanda sostenida que impulsa tanto desarrollos residenciales de alta gama como proyectos comerciales y corporativos de primer nivel.',
      'Sobre una superficie de 30.000 m² de usos mixtos que combina oficinas, locales comerciales y apartamentos residenciales, su diseño innovador incluye terrazas verdes interconectadas y un recorrido exterior que fomenta la interacción con la naturaleza. Con una morfología irregular, el edificio ofrece una fachada humana y sorprende a medida que se explora, destacando el voladizo del quinto piso.',
      'Los niveles superiores cuentan con lujosos amenities, incluyendo piscina y spa, mientras que las terrazas ofrecen experiencias únicas con diferentes tipos de vegetación y mobiliario.',
    ],
    facts: [
      { label: 'Superficie', value: '30.000 m²' },
      { label: 'Usos', value: 'Oficinas, locales y viviendas' },
      { label: 'Diseño', value: 'Terrazas verdes y voladizo en el 5.º piso' },
      { label: 'Amenities', value: 'Piscina y spa' },
    ],
    amenities: ['Piscina', 'Spa', 'Terrazas verdes', 'Recorrido exterior'],
    images: [
      {
        src: '/media/proyectos/one_2.jpg',
        alt: 'Fachada de ONE con el acceso principal y el voladizo del quinto piso.',
      },
      {
        src: '/media/proyectos/one_1.jpg',
        alt: 'Vista aérea del complejo de usos mixtos ONE en Canning, Buenos Aires.',
      },
      {
        src: '/media/proyectos/one_3.jpg',
        alt: 'Exteriores de ONE con terrazas verdes y locales comerciales.',
      },
      {
        src: '/media/proyectos/one_4.jpg',
        alt: 'Patio central y recorrido exterior de ONE.',
      },
      {
        src: '/media/proyectos/one_5.jpg',
        alt: 'Terrazas y oficinas de ONE.',
      },
      {
        src: '/media/proyectos/one_6.jpg',
        alt: 'Piscina y lounge del nivel de amenities de ONE.',
      },
      {
        src: '/media/proyectos/one_7.jpg',
        alt: 'Interior de oficinas de ONE con vistas al entorno.',
      },
    ],
  },
  {
    slug: 'entre-pinares',
    name: 'Entre Pinares',
    status: 'coming-soon',
    vehicle: 'development',
    assetType: 'Barrio privado',
    location: 'Ruta 52, km 8,5',
    summary:
      '25 hectáreas y 263 parcelas de 600 a 900 m² en un entorno natural, con amenities y seguridad 24/7.',
    description: [
      'Este barrio privado está estratégicamente ubicado sobre el km 8,5 de la ruta 52. Se extiende a lo largo de 25 hectáreas con 263 parcelas que van desde 600 m² a 900 m².',
      'Pensado para familias jóvenes, promueve un estilo de vida social y activo en un entorno natural. Con amenities premium, como piscina, canchas y un house central, además de seguridad 24/7, se posiciona como una opción ideal para quienes buscan calidad de vida.',
    ],
    facts: [
      { label: 'Superficie', value: '25 hectáreas' },
      { label: 'Parcelas', value: '263' },
      { label: 'Lotes', value: '600–900 m²' },
      { label: 'Seguridad', value: '24/7' },
    ],
    amenities: ['Piscina', 'Canchas', 'House central', 'Seguridad 24/7'],
    images: [
      {
        src: '/media/proyectos/entre-pinares_1.jpg',
        alt: 'Casa de madera en el entorno forestal de Entre Pinares.',
      },
      {
        src: '/media/proyectos/entre-pinares_2.jpg',
        alt: 'Acceso y portal de ingreso de Entre Pinares.',
      },
      {
        src: '/media/proyectos/entre-pinares_3.jpg',
        alt: 'Avenida de árboles en el acceso a Entre Pinares.',
      },
      {
        src: '/media/proyectos/entre-pinares_4.jpg',
        alt: 'Casa de madera con galería en Entre Pinares.',
      },
    ],
  },
  {
    slug: 'edificio-m-paz',
    name: 'Edificio M. Paz',
    status: 'coming-soon',
    vehicle: 'real-estate',
    assetType: 'Residencial y comercial',
    location: 'Zona residencial y comercial',
    summary:
      'Dos locales en planta baja y viviendas con balcones privados en los niveles superiores.',
    description: [
      'Nuestro edificio M. Paz se encuentra en una zona estratégica que combina áreas residenciales y comerciales. El proyecto cuenta con dos locales comerciales en planta baja y viviendas en los niveles superiores.',
      'Los departamentos incluyen balcones privados.',
    ],
    facts: [
      { label: 'Locales', value: '2 en planta baja' },
      { label: 'Viviendas', value: 'Niveles superiores' },
      { label: 'Balcones', value: 'Privados' },
    ],
    amenities: ['Locales comerciales en planta baja', 'Balcones privados'],
    images: [
      {
        src: '/media/proyectos/edificio-m-paz_1.jpg',
        alt: 'Fachada del Edificio M. Paz.',
      },
      {
        src: '/media/proyectos/edificio-m-paz_2.jpg',
        alt: 'Vista lateral del Edificio M. Paz.',
      },
      {
        src: '/media/proyectos/edificio-m-paz_3.jpg',
        alt: 'Interior de un departamento del Edificio M. Paz.',
      },
      {
        src: '/media/proyectos/edificio-m-paz_4.jpg',
        alt: 'Balcón privado de un departamento del Edificio M. Paz.',
      },
    ],
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function projectPath(slug: string): string {
  return `/proyectos/${slug}`;
}

export const PROJECTS_COPY = {
  eyebrow: 'Cartera',
  homeTitle: 'Proyectos',
  homeIntro:
    'Cuatro promociones en Argentina. Cada ficha reúne la descripción, los datos disponibles y las imágenes del proyecto. Las condiciones económicas se comparten en la sesión privada.',
  homeCta: 'Ver todos los proyectos',
  pageTitle: 'Proyectos',
  pageIntro:
    'Promociones inmobiliarias en Argentina. Las fichas se publican con la información disponible y las condiciones económicas se revisan en la sesión privada.',
  pageCta: 'Reservar sesión privada',
  note: 'Las condiciones de inversión, el retorno estimado y el plazo se comparten en la sesión privada.',
  upcomingLabel: 'Próximamente',
} as const;
