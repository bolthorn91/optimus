import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5, type Vehicle, type VehicleIcon } from '@/scenes/05-activos-simulador/content';

const ICON_PATH: Record<VehicleIcon, string> = {
  property: 'M4 20V9l8-5 8 5v11H4zM10 20v-6h4v6M9 12h6',
  equities: 'M4 16l5-5 4 3 7-8M4 20h16',
  crane: 'M5 20h14M8 20V7h8M12 7V4h8M6 11h6',
};

function VehicleGlyph({ icon }: { icon: VehicleIcon }) {
  return (
    <svg aria-hidden="true" className="vehicle-cards__icon" fill="none" viewBox="0 0 24 24">
      <path
        d={ICON_PATH[icon]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function VehicleCards({ vehicles }: { vehicles: readonly Vehicle[] }) {
  return (
    <ul className="vehicle-cards">
      {vehicles.map((vehicle) => (
        <li data-vehicle={vehicle.id} key={vehicle.id}>
          <VehicleGlyph icon={vehicle.icon} />
          <h3>{vehicle.name}</h3>
          <dl>
            <div>
              <dt>{ACT5.copy.advantage}</dt>
              <dd>{vehicle.advantage}</dd>
            </div>
            <div>
              <dt>{ACT5.copy.performance}</dt>
              <dd>{vehicle.performance}</dd>
            </div>
          </dl>
          {vehicle.glossary ? (
            <p data-pozo-gloss>
              <abbr title={vehicle.glossary}>{ACT5.copy.pozoTerm}</abbr>: {vehicle.glossary}
            </p>
          ) : null}
          <a href={contactHref(vehicle.id)}>{ACT5.cta.label}</a>
        </li>
      ))}
    </ul>
  );
}
