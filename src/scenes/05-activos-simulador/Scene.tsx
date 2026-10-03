import { useRef } from 'react';

import { Disclaimer } from '@/components/Disclaimer';
import { RomanNumeral } from '@/components/RomanNumeral';
import type { VehicleId } from '@/lib/projection-assumptions';
import { Scene } from '@/motion/Scene';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { EntryFloorNote } from '@/scenes/05-activos-simulador/EntryFloorNote';
import { Simulator } from '@/scenes/05-activos-simulador/Simulator';
import { useSimulator } from '@/scenes/05-activos-simulador/useSimulator';
import { VehicleCards } from '@/scenes/05-activos-simulador/VehicleCards';

import './scene.css';

export function Act5Scene() {
  const { input, result, setCapital, setYears, setScenario, setVehicle } = useSimulator();
  const simulatorRef = useRef<HTMLElement>(null);

  function onSelect(id: VehicleId): void {
    setVehicle(id);
    simulatorRef.current?.focus();
  }

  return (
    <Scene act={ACT5.act} background="var(--color-ivory)" height="100vh" id="activos">
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
        <a href={contactHref()}>{ACT5.cta.label}</a>
      </div>
    </Scene>
  );
}
