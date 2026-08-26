export interface IntroCard {
  label: string;
  body: string;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroContent {
  headline: string;
  headlineEmphasis: readonly string[];
  claim: string;
  intro: readonly IntroCard[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  scrollHint: string;
  downloadNote: string;
  logoAlt: string;
  logoSrc: string;
}

/** Literales de `content/secciones/00-hero-portada.md`. Nada suelto en el JSX. */
export const HERO: HeroContent = {
  headline: 'Proteja su patrimonio, su libertad financiera y su integridad ciudadana',
  headlineEmphasis: ['patrimonio', 'libertad financiera', 'integridad ciudadana'],
  claim: 'Inversión estratégica y protección financiera',
  intro: [
    {
      label: 'Dirigido a',
      body: 'Inversores de toda escala en diferentes niveles y patrimonios privados.',
    },
    {
      label: 'Propuesta',
      body: 'Estrategia anticipatoria de inversión en activos inmobiliarios y financieros en Argentina.',
    },
    {
      label: 'Estructura',
      body: 'OPTIMVS Capital Protegido, firma Hispano - Argentina (España - Argentina).',
    },
  ],
  primaryCta: { label: 'Reservar sesión privada', href: '#contacto' },
  secondaryCta: { label: 'Descargar dossier', href: '/dossier.pdf' },
  scrollHint: 'Desplácese para continuar',
  downloadNote: 'PDF · 5,6 MB',
  logoAlt: 'OPTIMVS Capital Protegido',
  logoSrc: '/assets-origen/p12-X47.png',
};
