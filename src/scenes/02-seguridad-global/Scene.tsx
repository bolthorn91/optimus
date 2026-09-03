import { useState } from 'react';

import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { PeriodSelector } from '@/scenes/02-seguridad-global/PeriodSelector';
import type { PeriodIndex } from '@/scenes/02-seguridad-global/risk-data';
import { RiskLegend } from '@/scenes/02-seguridad-global/RiskLegend';
import { RiskMap } from '@/scenes/02-seguridad-global/RiskMap';
import { RiskTable } from '@/scenes/02-seguridad-global/RiskTable';

import './scene.css';

function layerOpacityFor(activeIndex: PeriodIndex): readonly [number, number, number, number] {
  return [
    activeIndex === 0 ? 1 : 0,
    activeIndex === 1 ? 1 : 0,
    activeIndex === 2 ? 1 : 0,
    activeIndex === 3 ? 1 : 0,
  ];
}

export function Act2Scene() {
  const [activeIndex, setActiveIndex] = useState<PeriodIndex>(0);

  return (
    <Scene
      act={ACT2.act}
      background="var(--color-navy-mid)"
      className="on-navy"
      height="100vh"
      id="seguridad"
    >
      <div className="act2">
        <h2>
          <RomanNumeral value={ACT2.act} />. {ACT2.title}
        </h2>
        <h3>{ACT2.headingVulnerable}</h3>
        {ACT2.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <PeriodSelector
          activeIndex={activeIndex}
          label={ACT2.copy.periodSelector}
          onSelect={setActiveIndex}
          periods={ACT2.periods}
        />
        <RiskMap
          activeIndex={activeIndex}
          layerOpacity={layerOpacityFor(activeIndex)}
          periods={ACT2.periods}
          projectionNote={ACT2.copy.projectionNote}
          southAmericaGlow={0}
        />
        <RiskLegend levels={ACT2.levels} title={ACT2.copy.legendTitle} />
        <RiskTable
          copy={{
            caption: ACT2.copy.tableCaption,
            projectionNote: ACT2.copy.projectionNote,
            regionHeader: ACT2.copy.tableRegion,
          }}
          levels={ACT2.levels}
          periods={ACT2.periods}
          regions={ACT2.regions}
        />
      </div>
    </Scene>
  );
}
