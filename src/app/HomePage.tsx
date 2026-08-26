import type { ComponentType } from 'react';

import { SECTIONS, type Section } from '@/app/sections';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { HeroScene } from '@/scenes/00-hero/Scene';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';

const HOME_SCENES: Partial<Record<Section['id'], ComponentType>> = {
  hero: HeroScene,
  escenario: Act1Scene,
};

function PlaceholderScene({ section }: { section: Section }) {
  return (
    <Scene act={section.act} background={section.background.surface} height="100vh" id={section.id}>
      <h2>
        {section.act === null ? null : <RomanNumeral decorative value={section.act} />}{' '}
        {section.label}
      </h2>
      <p>Marcador de acto. El contenido lo montan los documentos 01 a 08.</p>
    </Scene>
  );
}

export function HomePage() {
  return (
    <>
      {SECTIONS.map((section) => {
        const Slot = HOME_SCENES[section.id];
        return Slot ? (
          <Slot key={section.id} />
        ) : (
          <PlaceholderScene key={section.id} section={section} />
        );
      })}
    </>
  );
}
