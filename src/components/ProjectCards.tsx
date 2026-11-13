import { Link } from 'react-router';

import { PROJECTS_COPY, PROJECT_STATUS_LABEL, projectPath, type Project } from '@/content/projects';

import './project-cards.css';

function ProjectCard({ project, variant }: { project: Project; variant: 'default' | 'featured' }) {
  const isUpcoming = project.status === 'coming-soon';
  const facts = project.facts.slice(0, variant === 'featured' ? 2 : 3);

  return (
    <li
      className={`project-card project-card--${project.status}`}
      data-project={project.slug}
      data-project-status={project.status}
    >
      <Link
        aria-label={`Ver ficha de ${project.name}, ${isUpcoming ? 'próximamente' : 'abierto'}`}
        className="project-card__link"
        to={projectPath(project.slug)}
      >
        <figure className="project-card__media">
          <img
            alt={project.images[0]?.alt ?? ''}
            height="700"
            loading="lazy"
            src={project.images[0]?.src}
            width="1024"
          />
          {isUpcoming ? (
            <span className="project-card__banner">{PROJECTS_COPY.upcomingLabel}</span>
          ) : (
            <span className="project-card__status">{PROJECT_STATUS_LABEL[project.status]}</span>
          )}
        </figure>
        <div className="project-card__body">
          <p className="project-card__type">{project.assetType}</p>
          <h3>{project.name}</h3>
          <p className="project-card__location">{project.location}</p>
          {variant === 'default' ? (
            <p className="project-card__summary">{project.summary}</p>
          ) : null}
          <dl className="project-card__facts">
            {facts.map((fact) => (
              <div data-project-fact key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <span className="project-card__more">
            Ver ficha <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

export function ProjectCards({
  projects,
  limit,
  variant = 'default',
}: {
  projects: readonly Project[];
  limit?: number;
  variant?: 'default' | 'featured';
}) {
  const visible = limit === undefined ? projects : projects.slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="project-cards__empty" data-project-empty>
        {PROJECTS_COPY.upcomingLabel}. Las fichas estarán disponibles aquí.
      </p>
    );
  }

  return (
    <>
      <ul className={`project-cards project-cards--${variant}`} data-projects>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} variant={variant} />
        ))}
      </ul>
      <p className="project-cards__note">{PROJECTS_COPY.note}</p>
    </>
  );
}
