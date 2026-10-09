import { useCallback, useRef } from 'react';

import { Disclaimer } from '@/components/Disclaimer';
import { RomanNumeral } from '@/components/RomanNumeral';
import type { VehicleId } from '@/lib/projection-assumptions';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { useResolvedPolicy } from '@/motion/useScenePolicy';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { EntryFloorNote } from '@/scenes/05-activos-simulador/EntryFloorNote';
import { Simulator } from '@/scenes/05-activos-simulador/Simulator';
import { choreographAct5, type Act5State } from '@/scenes/05-activos-simulador/timeline';
import { useSimulator } from '@/scenes/05-activos-simulador/useSimulator';
import { VehicleCards } from '@/scenes/05-activos-simulador/VehicleCards';

import './scene.css';

const HEIGHT = '100svh';

export function Act5Scene() {
  const { input, result, setCapital, setYears, syncYears, setScenario, setVehicle } =
    useSimulator();
  const simulatorRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const policy = useResolvedPolicy('activos');

  const apply = useCallback(
    (state: Act5State) => {
      if (reduced || policy?.mode !== 'scrub') return;
      if (state.autoHorizon) syncYears(state.yearsFromScroll);
    },
    [policy?.mode, reduced, syncYears],
  );

  useGsapScene({
    ref: sceneRef,
    choreograph: choreographAct5,
    apply,
    pin: true,
    scrub: true,
    sceneId: 'activos',
  });

  function onSelect(id: VehicleId): void {
    setVehicle(id);
    simulatorRef.current?.focus();
  }

  return (
    <Scene
      act={ACT5.act}
      background="var(--color-ivory)"
      height={HEIGHT}
      id="activos"
      ref={sceneRef}
    >
      <div className="act5">
        <h2>
          <RomanNumeral value={ACT5.act} />. {ACT5.title}
        </h2>
        <p>{ACT5.intro}</p>
        <EntryFloorNote debtId={ACT5.entryFloor.debtId} note={ACT5.entryFloor.note} />
        <VehicleCards onSelect={onSelect} selectedId={input.vehicle} vehicles={ACT5.vehicles} />
        <Disclaimer variant="inline" />
        <Simulator
          input={input}
          ref={simulatorRef}
          result={result}
          setCapital={setCapital}
          setScenario={setScenario}
          setYears={setYears}
        />
        <a data-track="cta" data-track-position="act" href={contactHref(input.vehicle, input)}>
          {ACT5.cta.label}
        </a>
      </div>
    </Scene>
  );
}
