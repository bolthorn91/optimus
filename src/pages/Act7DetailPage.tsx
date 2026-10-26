import { actRoute, adjacentActs } from '@/app/routes';
import { Disclosure } from '@/components/Disclosure';
import { PendingValue } from '@/components/PendingValue';
import { ACT7_DETAIL, ACT7_PROPERTY_BODY, ACT7_SECURITIES_BODY } from '@/content/acts/act-7';
import { ACT_DETAILS, actToc } from '@/content/acts/catalog';
import { DetailLayout } from '@/pages/DetailLayout';
import { ACT67 } from '@/scenes/06-firma/content';

import './act7-detail.css';

const ROUTES = ACT67.routes;

function introParagraph(): string {
  return ACT7_DETAIL.sections[0]?.paragraphs?.[0] ?? '';
}

function noteFor(id: 'property' | 'securities'): string {
  const section = ACT7_DETAIL.sections.find((item) =>
    id === 'property' ? item.id === 'inmuebles' : item.id === 'valores-financieros',
  );
  return section?.paragraphs?.[1] ?? '';
}

function RouteCard({
  id,
  title,
  steps,
  entities,
  body,
  note,
}: {
  id: 'property' | 'securities';
  title: string;
  steps: readonly string[];
  entities: readonly string[];
  body: string;
  note: string;
}) {
  return (
    <article
      className="act7-route"
      data-route={id}
      id={id === 'property' ? 'inmuebles' : 'valores-financieros'}
    >
      <header className="act7-route__head">
        <span aria-hidden="true" className="act7-route__index">
          {id === 'property' ? '01' : '02'}
        </span>
        <h2>{title}</h2>
      </header>
      <p className="act7-route__lead">{body}</p>
      <p className="act7-route__label">Paso a paso</p>
      <ol className="act7-route__steps">
        {steps.map((step, index) => (
          <li key={step}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <ul aria-label="Organismos de la vía" className="act7-route__entities">
        {entities.map((entity) => (
          <li key={entity}>{entity}</li>
        ))}
      </ul>
      <p className="act7-route__note" role="note">
        {note}
      </p>
    </article>
  );
}

function Glossary() {
  return (
    <section className="act7-glossary" id="act7-glosario">
      <div className="act7-section-head">
        <p className="act7-kicker">Definiciones</p>
        <h2>{ACT67.copy.glossaryHeading}</h2>
      </div>
      <div className="act7-glossary__list">
        {ACT67.glossary.map((entry) => (
          <Disclosure key={entry.id} title={entry.term}>
            <p>{entry.definition}</p>
          </Disclosure>
        ))}
      </div>
    </section>
  );
}

export function Act7DetailPage() {
  const route = actRoute(7);
  const detail = ACT_DETAILS[7];
  const adjacent = adjacentActs(7);
  const toc = [
    ...actToc(7),
    { id: 'act7-organismos', label: ACT67.copy.organisationsLabel },
    { id: 'act7-glosario', label: ACT67.copy.glossaryHeading },
  ];

  return (
    <DetailLayout
      actNumber={7}
      ctaTo="/contacto"
      {...(adjacent.next ? { next: adjacent.next } : {})}
      {...(adjacent.prev ? { prev: adjacent.prev } : {})}
      sources={detail.sources}
      title={route.title}
      toc={toc}
    >
      <div className="act7-detail">
        <section className="act7-intro" id="entradilla">
          <p>{introParagraph()}</p>
          <div className="act7-route-strip">
            {ROUTES.map((item, index) => (
              <a
                href={`#${item.id === 'property' ? 'inmuebles' : 'valores-financieros'}`}
                key={item.id}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {item.title}
              </a>
            ))}
          </div>
        </section>

        <section className="act7-routes" aria-labelledby="act7-routes-title">
          <div className="act7-section-head">
            <p className="act7-kicker">Dos formas de operar</p>
            <h2 id="act7-routes-title">{ACT67.copy.routesCaption}</h2>
          </div>
          <div className="act7-routes__grid">
            <RouteCard
              body={ACT7_PROPERTY_BODY}
              entities={ROUTES[0].entities}
              id="property"
              note={noteFor('property')}
              steps={ROUTES[0].steps}
              title={ROUTES[0].title}
            />
            <RouteCard
              body={ACT7_SECURITIES_BODY}
              entities={ROUTES[1].entities}
              id="securities"
              note={noteFor('securities')}
              steps={ROUTES[1].steps}
              title={ROUTES[1].title}
            />
          </div>
        </section>

        <section className="act7-organisms" id="act7-organismos">
          <div className="act7-section-head">
            <p className="act7-kicker">Marco de relación</p>
            <h2>{ACT67.copy.organisationsLabel}</h2>
          </div>
          <ul className="act7-organisms__list">
            {ACT67.organisations.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="act7-organisms__pending">
            <PendingValue debtId={ACT67.alliedPending.debtId} label={ACT67.alliedPending.label} />
          </p>
        </section>

        <Glossary />
      </div>
    </DetailLayout>
  );
}
