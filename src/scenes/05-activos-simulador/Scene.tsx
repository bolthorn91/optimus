import { Disclaimer } from '@/components/Disclaimer';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { EntryFloorNote } from '@/scenes/05-activos-simulador/EntryFloorNote';
import { VehicleCards } from '@/scenes/05-activos-simulador/VehicleCards';

import './scene.css';

export function Act5Scene() {
  return (
    <Scene act={ACT5.act} background="var(--color-ivory)" height="100vh" id="activos">
      <div className="act5">
        <h2>
          <RomanNumeral value={ACT5.act} />. {ACT5.title}
        </h2>
        <p>{ACT5.intro}</p>
        <EntryFloorNote debtId={ACT5.entryFloor.debtId} note={ACT5.entryFloor.note} />
        <VehicleCards vehicles={ACT5.vehicles} />
        <Disclaimer variant="inline" />
        <a href={contactHref()}>{ACT5.cta.label}</a>
      </div>
    </Scene>
  );
}
