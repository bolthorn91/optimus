import type { ReactNode } from 'react';

import { CountUp } from '@/components/CountUp';
import { Disclaimer } from '@/components/Disclaimer';
import { DualFigure } from '@/components/DualFigure';
import { PendingValue } from '@/components/PendingValue';
import { PullQuote } from '@/components/PullQuote';
import { RomanNumeral } from '@/components/RomanNumeral';
import { StatFigure } from '@/components/StatFigure';
import { formatArea, formatDensity, formatPercent } from '@/lib/format';
import { COUNTRY_COLOR, PALETTE, RISK_SCALE } from '@/lib/tokens';

import './design-page.css';

const COUNTRY_SWATCHES: Record<string, string> = {
  España: COUNTRY_COLOR.es,
  Argentina: COUNTRY_COLOR.ar,
};

function Swatches({ colors }: { colors: Record<string, string> }) {
  return (
    <ul className="design__swatches">
      {Object.entries(colors).map(([name, hex]) => (
        <li key={name}>
          <span className="design__chip" style={{ background: hex }} />
          <code>{name}</code> <code>{hex}</code>
        </li>
      ))}
    </ul>
  );
}

/** Sección numerada del muestrario: el cableado de `aria-labelledby` vive aquí y solo aquí. */
function Showcase({ act, title, children }: { act: number; title: string; children: ReactNode }) {
  const id = `muestrario-${String(act)}`;

  return (
    <section aria-labelledby={id}>
      <h2 id={id}>
        <RomanNumeral decorative value={act} /> {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Muestrario del sistema de diseño. Cumple la función de un Storybook sin añadir la herramienta
 * (doc 00 §9).
 *
 * **Nada de lo que aparece aquí es contenido del dossier** (decisión C5): los textos son relleno
 * marcado como tal, y las cifras son las del canon solo cuando ilustran un formateador.
 */
export function DesignPage() {
  return (
    <main className="design" id="contenido">
      <header className="design__head">
        <p className="design__eyebrow">Muestrario del sistema de diseño</p>
        <h1>Aa Bb Cc — OPTIMVS</h1>
        <p>
          Página de referencia interna. Todo el texto es de relleno; el contenido real lo montan los
          documentos 01 a 08.
        </p>
      </header>

      <Showcase act={1} title="Color">
        <h3>Paleta de marca</h3>
        <Swatches colors={PALETTE} />

        <h3>Escala de riesgo</h3>
        <p>Uso exclusivo en los mapas del acto II. Nunca como color de interfaz.</p>
        <Swatches colors={RISK_SCALE} />

        <h3>Identificadores de país</h3>
        <Swatches colors={COUNTRY_SWATCHES} />
      </Showcase>

      <Showcase act={2} title="Tipografía">
        <h3>Cinzel para display, Inter para cuerpo</h3>
        <h4>Etiqueta de cuarto nivel</h4>
        <p>
          Texto de relleno a ancho de lectura para comprobar la medida, el interlineado y el
          equilibrio de línea. Debe caber entre sesenta y cinco y setenta y cinco caracteres por
          renglón sin que la vista tenga que saltar.
        </p>
        <p className="design__note">Nota al pie, con el tamaño más pequeño de la escala.</p>
      </Showcase>

      <Showcase act={3} title="Cifras">
        <div className="design__stats">
          <StatFigure
            label="glosa de relleno para una cifra con doble numeral"
            source="relleno, no es una fuente real"
            value={<DualFigure suffix="%" value={14} />}
          />
          <StatFigure
            label="glosa de relleno para una superficie"
            source="relleno, no es una fuente real"
            value={formatArea(13243219)}
          />
          <StatFigure
            label="glosa de relleno para un par de contadores"
            source="relleno, no es una fuente real"
            value={
              <>
                <CountUp format={formatDensity} progress={1} to={96.05} /> ·{' '}
                <CountUp format={formatDensity} progress={1} to={16.51} />
              </>
            }
          />
        </div>

        <p>
          Porcentaje suelto: <span data-tabular>{formatPercent(14)}</span>
        </p>
      </Showcase>

      <Showcase act={4} title="Bloques">
        <PullQuote cite="Atribución de relleno">
          Cita de relleno para comprobar el filete de oro, el ancho reducido y el tratamiento
          tipográfico del bloque destacado.
        </PullQuote>

        <p>
          Marcador de dato pendiente: <PendingValue debtId="B-01" label="Teléfono de ejemplo" />
        </p>

        <Disclaimer variant="inline" />
      </Showcase>

      <footer className="design__foot">
        <Disclaimer variant="footer" />
      </footer>
    </main>
  );
}
