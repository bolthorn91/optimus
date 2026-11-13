import { Link } from 'react-router';

import { PROJECTS_COPY, PROJECT_STATUS_LABEL, projectBySlug } from '@/content/projects';
import { DetailLayout } from '@/pages/DetailLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';

import './project-detail.css';

export function ProjectDetailPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug);

  if (!project) return <NotFoundPage />;

  const isUpcoming = project.status === 'coming-soon';
  const toc = [
    { id: 'resumen', label: 'El proyecto' },
    { id: 'ficha', label: 'Datos' },
    ...(project.amenities.length > 0 ? [{ id: 'amenities', label: 'Amenities' }] : []),
    { id: 'galeria', label: 'Galería' },
    { id: 'condiciones', label: 'Condiciones' },
  ];

  return (
    <DetailLayout ctaTo={contactHref(project.vehicle)} title={project.name} toc={toc}>
      <article className="project-detail">
        <p className="project-detail__meta">
          <span>{project.assetType}</span>
          <span>{project.location}</span>
          <span
            className={`project-detail__status project-detail__status--${project.status}`}
            data-project-detail-status={project.status}
          >
            {PROJECT_STATUS_LABEL[project.status]}
          </span>
        </p>

        <figure className="project-detail__hero">
          <img
            alt={project.images[0]?.alt ?? ''}
            height="700"
            loading="eager"
            src={project.images[0]?.src}
            width="1024"
          />
        </figure>

        <p className="project-detail__lead">{project.summary}</p>

        <section id="resumen">
          <h2>El proyecto</h2>
          {project.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section id="ficha">
          <h2>Datos de la promoción</h2>
          <dl className="project-detail__facts">
            {project.facts.map((fact) => (
              <div data-project-fact key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {project.amenities.length > 0 ? (
          <section id="amenities">
            <h2>Amenities</h2>
            <ul className="project-detail__amenities">
              {project.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section id="galeria">
          <h2>Galería</h2>
          <div className="project-detail__gallery">
            {project.images.slice(1).map((image) => (
              <figure key={image.src}>
                <img alt={image.alt} height="700" loading="lazy" src={image.src} width="1024" />
              </figure>
            ))}
          </div>
        </section>

        <section id="condiciones">
          <h2>Condiciones</h2>
          {isUpcoming ? (
            <p className="project-detail__notice">
              Esta promoción está marcada como <strong>próximamente</strong>. La ficha ya está
              disponible para revisar el proyecto; la apertura comercial se anunciará aquí.
            </p>
          ) : null}
          <p>{PROJECTS_COPY.note}</p>
        </section>

        <p className="project-detail__back">
          <Link to="/proyectos">Ver todos los proyectos</Link>
        </p>
      </article>
    </DetailLayout>
  );
}
