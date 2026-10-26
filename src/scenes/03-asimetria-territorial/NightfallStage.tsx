import { lazy, Suspense, useCallback, useState } from 'react';

import { MOBILE_COPY } from '@/app/mobileCopy';
import { useResolvedPolicy } from '@/motion/useScenePolicy';
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
  const policy = useResolvedPolicy('territorio');
  const [lost, setLost] = useState(false);
  const [webgl] = useState(() => detectWebgl());
  const onContextLost = useCallback(() => {
    setLost(true);
  }, []);
  const canCanvas = policy?.mode === 'scrub' && webgl && !lost;
  /*
   * Las cifras no van montadas al progreso del scroll: con el mapa a media vista
   * mostraban ceros y la comparación se leía mal. Se sirven completas y el bloque
   * entra con la animación de `view()` del CSS; el mapa conserva su recorrido día/noche.
   */
  const figureProgress = { areaProgress: 1, popProgress: 1, densityProgress: 1 };

  return (
    <div
      className="act3-nightfall"
      {...(canCanvas ? { 'data-nightfall-stage': '' } : { 'data-nightfall-fallback': '' })}
    >
      <div className="act3-nightfall-head">
        <span>Luminosidad nocturna</span>
        <span>{countries.map((country) => country.name).join(' · ')}</span>
      </div>
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
      {policy?.mode === 'fallback' ? (
        <p className="act3-nightfall-note">{MOBILE_COPY.staticSceneNote}</p>
      ) : !webgl || lost ? (
        <p className="act3-nightfall-note">{ACT3.copy.fallbackNote}</p>
      ) : null}
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
