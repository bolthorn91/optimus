import { Link } from 'react-router';

import { HOME } from '@/app/homeContent';
import { ActCta } from '@/components/ActCta';
import { Disclaimer } from '@/components/Disclaimer';
import { HomeSectionMarker } from '@/components/HomeSectionMarker';
import { ProjectCards } from '@/components/ProjectCards';
import { PROJECTS } from '@/content/projects';
import { HeroScene } from '@/scenes/00-hero/Scene';

import './home.css';

/**
 * La home es una página de decisión, no el dossier. Cinco bloques después del hero:
 * oportunidades, método, confianza, calculadora y cierre. El argumentario completo vive en
 * `/estrategia`; el equipo, en `/nosotros`.
 */
export function HomePage() {
  return (
    <>
      <HeroScene showScrollCue />

      <section
        aria-labelledby="home-projects-title"
        className="home-section on-light"
        id="proyectos"
      >
        <div className="home-section__head">
          <div className="home-section__kicker">
            <HomeSectionMarker icon="projects" index={1} />
            <p className="home-eyebrow">{HOME.projects.eyebrow}</p>
          </div>
          <h2 id="home-projects-title">{HOME.projects.title}</h2>
          <p className="home-section__intro">{HOME.projects.intro}</p>
        </div>
        <ProjectCards projects={PROJECTS} variant="featured" />
        <Link className="cta home-section__cta" to="/proyectos">
          {HOME.projects.cta}
        </Link>
      </section>

      <section
        aria-labelledby="home-steps-title"
        className="home-section on-navy"
        id="como-funciona"
      >
        <div className="home-section__head">
          <div className="home-section__kicker">
            <HomeSectionMarker icon="method" index={2} />
            <p className="home-eyebrow">{HOME.steps.eyebrow}</p>
          </div>
          <h2 id="home-steps-title">{HOME.steps.title}</h2>
          <p className="home-section__intro">{HOME.steps.intro}</p>
        </div>
        <ol className="home-steps">
          {HOME.steps.items.map((item, index) => (
            <li key={item.title}>
              <span aria-hidden="true" className="home-steps__number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="home-proof-title"
        className="home-section on-light"
        id="por-que-optimvs"
      >
        <div className="home-section__head">
          <div className="home-section__kicker">
            <HomeSectionMarker icon="trust" index={3} />
            <p className="home-eyebrow">{HOME.proof.eyebrow}</p>
          </div>
          <h2 id="home-proof-title">{HOME.proof.title}</h2>
        </div>
        <ul className="home-proof">
          {HOME.proof.items.map((item) => (
            <li key={item.label}>
              <p className="home-proof__label">{item.label}</p>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="home-calculator-title"
        className="home-section home-calculator on-navy"
        id="calculadora"
      >
        <div className="home-calculator__copy">
          <div className="home-section__kicker">
            <HomeSectionMarker icon="calculator" index={4} />
            <p className="home-eyebrow">{HOME.calculator.eyebrow}</p>
          </div>
          <h2 id="home-calculator-title">{HOME.calculator.title}</h2>
          <p>{HOME.calculator.body}</p>
        </div>
        <Link className="home-link" to="/calculadora">
          {HOME.calculator.cta}
        </Link>
      </section>

      <section aria-labelledby="home-close-title" className="home-section home-close on-navy">
        <div className="home-close__copy">
          <div className="home-section__kicker">
            <HomeSectionMarker icon="contact" index={5} />
            <p className="home-eyebrow">{HOME.close.eyebrow}</p>
          </div>
          <h2 id="home-close-title">{HOME.close.title}</h2>
          <p>{HOME.close.body}</p>
        </div>
        <ActCta href="/contacto" label={HOME.close.cta} position="act" />
        <Disclaimer variant="inline" />
      </section>
    </>
  );
}
