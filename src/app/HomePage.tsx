import type { ComponentType } from 'react';

import { isAct, SECTIONS, sealOnNavy } from '@/app/sections';
import { ActThreshold } from '@/motion/ActThreshold';
import { HeroScene } from '@/scenes/00-hero/Scene';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';
import { Act2Scene } from '@/scenes/02-seguridad-global/Scene';
import { Act3Scene } from '@/scenes/03-asimetria-territorial/Scene';
import { Act4Scene } from '@/scenes/04-marco-legal/Scene';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';
import { Act67Scene } from '@/scenes/06-firma/Scene';
import { ContactScene } from '@/scenes/07-contacto/Scene';

type HomeSceneId =
  'hero' | 'escenario' | 'seguridad' | 'territorio' | 'marco' | 'activos' | 'firma' | 'contacto';

const HOME_SCENES: Record<HomeSceneId, ComponentType> = {
  hero: HeroScene,
  escenario: Act1Scene,
  seguridad: Act2Scene,
  territorio: Act3Scene,
  marco: Act4Scene,
  activos: Act5Scene,
  firma: Act67Scene,
  contacto: ContactScene,
};

function homeScene(id: string): ComponentType {
  if (Object.hasOwn(HOME_SCENES, id)) {
    return HOME_SCENES[id as HomeSceneId];
  }
  throw new Error(`La sección ${id} no monta escena`);
}

export function HomePage() {
  return (
    <>
      {SECTIONS.flatMap((section, index) => {
        if (section.hostedBy) return [];
        const Slot = homeScene(section.id);
        const scene = <Slot key={section.id} />;
        const next = SECTIONS[index + 1];
        if (!next || !isAct(next) || next.hostedBy) return [scene];
        return [
          scene,
          <ActThreshold
            act={next.act}
            key={`seal-${String(next.act)}`}
            onNavy={sealOnNavy(section, next)}
          />,
        ];
      })}
    </>
  );
}
