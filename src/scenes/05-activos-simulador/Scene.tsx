import { useCallback, useRef } from 'react';

import { Disclaimer } from '@/components/Disclaimer';
import { RomanNumeral } from '@/components/RomanNumeral';
import type { VehicleId } from '@/lib/projection-assumptions';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { EntryFloorNote } from '@/scenes/05-activos-simulador/EntryFloorNote';
import { Simulator } from '@/scenes/05-activos-simulador/Simulator';
import { choreographAct5, type Act5State } from '@/scenes/05-activos-simulador/timeline';
import { useSimulator } from '@/scenes/05-activos-simulador/useSimulator';
import { VehicleCards } from '@/scenes/05-activos-simulador/VehicleCards';

import './scene.css';

const HEIGHT = '100vh';
const PIN_END = '+=450vh';

export function Act5Scene() {
  const { input, result, setCapital, setYears, syncYears, setScenario, setVehicle } =
    useSimulator();
  const simulatorRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();

  const apply = useCallback(
    (state: Act5State) => {
      // useGsapScene applies choreograph(1) when reduced; that horizon is 15, SIM-16 keeps the rest.
      if (reduced) return;
      if (state.autoHorizon) syncYears(state.yearsFromScroll);
    },
    [reduced, syncYears],
  );

  useGsapScene({
    ref: sceneRef,
    choreograph: choreographAct5,
    apply,
    pin: true,
    scrub: true,
    end: PIN_END,
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
        <a href={contactHref(input.vehicle, input)}>{ACT5.cta.label}</a>
      </div>
    </Scene>
  );
}
