import { lazy, Suspense, useCallback, useState } from 'react';

import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { ACT3, type CountryFigures } from '@/scenes/03-asimetria-territorial/content';
import { CountryFigureStack } from '@/scenes/03-asimetria-territorial/CountryFigureStack';
import { NightfallFallback } from '@/scenes/03-asimetria-territorial/NightfallFallback';
import type { Act3State } from '@/scenes/03-asimetria-territorial/timeline';
import { detectWebgl } from '@/three/detectWebgl';

const NightfallCanvas = lazy(() => import('./NightfallCanvas'));

export function NightfallStage({
  state,
  countries,
}: {
  state: Act3State;
  countries: readonly CountryFigures[];
}) {
  const reduced = useReducedMotionSafe();
  const [lost, setLost] = useState(false);
  const [webgl] = useState(() => detectWebgl());
  const onContextLost = useCallback(() => {
    setLost(true);
  }, []);
  const canCanvas = webgl && !reduced && !lost;
  const figureProgress = canCanvas
    ? state
    : { areaProgress: 1, popProgress: 1, densityProgress: 1 };

  return (
    <div
      className="act3-nightfall"
      {...(canCanvas ? { 'data-nightfall-stage': '' } : { 'data-nightfall-fallback': '' })}
    >
      {canCanvas ? (
        <>
          <p className="visually-hidden">{ACT3.copy.canvasAlt}</p>
          <Suspense fallback={<NightfallFallback />}>
            <div className="act3-nightfall-visual">
              <NightfallCanvas countries={countries} onContextLost={onContextLost} state={state} />
            </div>
          </Suspense>
        </>
      ) : (
        <NightfallFallback />
      )}
      {!webgl || lost ? <p className="act3-nightfall-note">{ACT3.copy.fallbackNote}</p> : null}
      <div className="act3-nightfall-figures">
        {countries.map((country) => (
          <CountryFigureStack
            key={country.id}
            areaProgress={figureProgress.areaProgress}
            country={country}
            densityProgress={figureProgress.densityProgress}
            popProgress={figureProgress.popProgress}
          />
        ))}
      </div>
    </div>
  );
}
