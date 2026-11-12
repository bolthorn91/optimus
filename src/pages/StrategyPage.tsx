import { Link } from 'react-router';

import { ROUTES, isActRoute, isVehicleRoute } from '@/app/routes';
import { toRoman } from '@/lib/roman';
import { DetailLayout } from '@/pages/DetailLayout';

import './strategy-page.css';

const ACTS = ROUTES.filter(isActRoute);
const VEHICLES = ROUTES.filter(isVehicleRoute);

export function StrategyPage() {
  return (
    <DetailLayout
      ctaTo="/contacto"
      title="Estrategia de inversión"
      toc={[
        { id: 'tesis', label: 'La tesis' },
        { id: 'actos', label: 'El argumento, acto a acto' },
        { id: 'activos', label: 'Tipos de activo' },
      ]}
    >
      <div className="detail-prose strategy-page">
        <section id="tesis">
          <p>
            La estrategia parte de una lectura del nuevo escenario europeo y de una búsqueda
            deliberada de jurisdicciones con reglas estables. Argentina aparece como el mercado
            donde esa lectura se convierte en una oportunidad concreta para el inversor europeo.
          </p>
          <p>
            El argumento completo está desplegado en siete actos. Puede leerlos en orden o ir
            directamente al que necesite; la home ya no repite ese recorrido.
          </p>
        </section>

        <section id="actos">
          <h2>El argumento, acto a acto</h2>
          <ol className="strategy-chapters">
            {ACTS.map((act) => (
              <li key={act.path}>
                <Link to={act.path}>
                  <span aria-hidden="true" className="strategy-chapters__roman">
                    {toRoman(act.actNumber)}
                  </span>
                  <span>
                    <strong>{act.title}</strong>
                    <span>{act.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="activos">
          <h2>Tipos de activo</h2>
          <ul className="strategy-assets">
            {VEHICLES.map((vehicle) => (
              <li key={vehicle.path}>
                <Link to={vehicle.path}>{vehicle.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DetailLayout>
  );
}
