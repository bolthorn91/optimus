import type { ComponentType } from 'react';

import { isAct, SECTIONS, type Section } from '@/app/sections';
import { RomanNumeral } from '@/components/RomanNumeral';
import { ActThreshold } from '@/motion/ActThreshold';
import { Scene } from '@/motion/Scene';
import { HeroScene } from '@/scenes/00-hero/Scene';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';
import { Act2Scene } from '@/scenes/02-seguridad-global/Scene';
import { Act3Scene } from '@/scenes/03-asimetria-territorial/Scene';
import { Act4Scene } from '@/scenes/04-marco-legal/Scene';

const HOME_SCENES: Partial<Record<Section['id'], ComponentType>> = {
  hero: HeroScene,
  escenario: Act1Scene,
  seguridad: Act2Scene,
  territorio: Act3Scene,
  marco: Act4Scene,
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
      {SECTIONS.flatMap((section, index) => {
        const Slot = HOME_SCENES[section.id];
        const scene = Slot ? (
          <Slot key={section.id} />
        ) : (
          <PlaceholderScene key={section.id} section={section} />
        );
        const next = SECTIONS[index + 1];
        if (!next || !isAct(next)) return [scene];
        return [
          scene,
          <ActThreshold
            act={next.act}
            key={`seal-${String(next.act)}`}
            onNavy={section.background.surface !== 'var(--color-ivory)'}
          />,
        ];
      })}
    </>
  );
}
