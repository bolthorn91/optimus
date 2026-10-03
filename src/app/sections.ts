export interface SectionBackground {
  surface: string;
  ink: string;
  focus: string;
}

/** Par aplicado al documento: el foco del acto es opcional para no tapar S5. */
export interface DocumentPair {
  surface: string;
  ink: string;
  focus?: string;
}

export interface MilestoneMark {
  id: string;
  href: string;
  label: string;
  act: number;
  reached: boolean;
}

export interface Section {
  id: string;
  act: number | null;
  label: string;
  href: string;
  order: number;
  navGroup: string | null;
  background: SectionBackground;
  /** Si está, esta fila no monta escena propia: vive dentro de la escena `hostedBy` (C5). */
  hostedBy?: string;
}

export type ActSection = Section & { act: number };

const NAVY_INK = 'var(--color-ivory)';
const NAVY_FOCUS = 'var(--color-gold-high)';
const IVORY_INK = 'var(--color-navy-deep)';
const IVORY_FOCUS = 'var(--color-navy-deep)';

function navyPair(surface: string): SectionBackground {
  return { surface, ink: NAVY_INK, focus: NAVY_FOCUS };
}

export const TERRITORIO_PAIR = navyPair('var(--color-navy-ink)');

function ivoryPair(surface: string): SectionBackground {
  return { surface, ink: IVORY_INK, focus: IVORY_FOCUS };
}

export const NAVY_DEEP_PAIR = navyPair('var(--color-navy-deep)');
export const IVORY_PAIR = ivoryPair('var(--color-ivory)');

/** Par del documento fuera de la home: el tema de página, sin tapar `--focus` de S5. */
export const DOCUMENT_PAIR_OFF_HOME: DocumentPair = {
  surface: 'var(--surface)',
  ink: 'var(--ink)',
};

export function applyDocumentPair(background: DocumentPair): void {
  const root = document.documentElement.style;
  root.setProperty('--doc-surface', background.surface);
  root.setProperty('--doc-ink', background.ink);
  if (background.focus) {
    root.setProperty('--doc-focus', background.focus);
  } else {
    root.removeProperty('--doc-focus');
  }
}

export function clearDocumentPair(): void {
  const root = document.documentElement.style;
  root.removeProperty('--doc-surface');
  root.removeProperty('--doc-ink');
  root.removeProperty('--doc-focus');
}

/** Manifiesto de la home. Añadir un acto es añadir una fila (D4). */
export const SECTIONS: readonly Section[] = [
  {
    id: 'hero',
    act: null,
    label: 'Inicio',
    href: '/#hero',
    order: 0,
    navGroup: null,
    background: navyPair('var(--color-navy-deep)'),
  },
  {
    id: 'escenario',
    act: 1,
    label: 'Escenario europeo',
    href: '/#escenario',
    order: 1,
    navGroup: 'Escenario',
    background: navyPair('var(--color-navy-deep)'),
  },
  {
    id: 'seguridad',
    act: 2,
    label: 'Seguridad global',
    href: '/#seguridad',
    order: 2,
    navGroup: 'Seguridad',
    background: navyPair('var(--color-navy-mid)'),
  },
  {
    id: 'territorio',
    act: 3,
    label: 'Asimetría territorial',
    href: '/#territorio',
    order: 3,
    navGroup: 'Estrategia',
    background: TERRITORIO_PAIR,
  },
  {
    id: 'marco',
    act: 4,
    label: 'Marco legal',
    href: '/#marco',
    order: 4,
    navGroup: 'Estrategia',
    background: NAVY_DEEP_PAIR,
  },
  {
    id: 'activos',
    act: 5,
    label: 'Activos',
    href: '/#activos',
    order: 5,
    navGroup: 'Activos',
    background: IVORY_PAIR,
  },
  {
    id: 'firma',
    act: 6,
    label: 'La firma',
    href: '/#firma',
    order: 6,
    navGroup: 'Nosotros',
    background: navyPair('var(--color-navy-mid)'),
  },
  {
    id: 'asesoramiento',
    act: 7,
    label: 'Asesoramiento',
    href: '/#asesoramiento',
    order: 7,
    navGroup: 'Nosotros',
    background: navyPair('var(--color-navy-deep)'),
    hostedBy: 'firma',
  },
  {
    id: 'contacto',
    act: null,
    label: 'Reserva',
    href: '/#contacto',
    order: 8,
    navGroup: null,
    background: navyPair('var(--color-navy-deep)'),
  },
];

export function isAct(section: Section): section is ActSection {
  return section.act !== null;
}

/** El sello entre actos va sobre navy solo si ninguno de los dos lados es marfil. */
export function sealOnNavy(from: Section, to: Section): boolean {
  return (
    from.background.surface !== IVORY_PAIR.surface && to.background.surface !== IVORY_PAIR.surface
  );
}

export function sectionAt(progress: number, sections: readonly Section[] = SECTIONS): Section {
  const first = sections[0];
  if (!first) {
    throw new Error('El manifiesto de secciones está vacío');
  }
  const index = Math.min(sections.length - 1, Math.max(0, Math.floor(progress * sections.length)));
  return sections[index] ?? first;
}

export function navEntries(
  sections: readonly Section[] = SECTIONS,
): { label: string; href: string }[] {
  const seen = new Set<string>();
  const entries: { label: string; href: string }[] = [];
  for (const section of sections) {
    if (section.navGroup === null || seen.has(section.navGroup)) continue;
    seen.add(section.navGroup);
    entries.push({ label: section.navGroup, href: section.href });
  }
  return entries;
}

export function milestoneMarks(
  current: Section,
  sections: readonly Section[] = SECTIONS,
): MilestoneMark[] {
  return sections.filter(isAct).map((section) => ({
    id: section.id,
    href: section.href,
    label: section.label,
    act: section.act,
    reached: current.order >= section.order,
  }));
}
