import { ActCta } from '@/components/ActCta';
import { PendingValue } from '@/components/PendingValue';
import {
  PROJECTS_COPY,
  PROJECT_STATUS_LABEL,
  type Project,
  type ProjectMetric,
} from '@/content/projects';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';

import './project-cards.css';

function Metric({ metric }: { metric: ProjectMetric }) {
  return (
    <div data-project-metric>
      <dt>{metric.label}</dt>
      <dd>
        {metric.pending === true || metric.value === undefined ? (
          <PendingValue
            debtId={metric.debtId ?? 'PROY-01'}
            label={metric.label}
            showLabel={false}
          />
        ) : (
          metric.value
        )}
      </dd>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li data-project={project.slug}>
      <div className="project-card__head">
        <p className="project-card__type">{project.assetType}</p>
        <span className="project-card__status">{PROJECT_STATUS_LABEL[project.status]}</span>
      </div>
      <h3>{project.name}</h3>
      <p className="project-card__location">{project.location}</p>
      <p className="project-card__summary">{project.summary}</p>
      <dl className="project-card__metrics">
        <Metric metric={project.minimumInvestment} />
        <Metric metric={project.targetReturn} />
        <Metric metric={project.term} />
      </dl>
      <ActCta
        href={contactHref(project.vehicle)}
        label="Reservar sesión privada"
        position="act"
        variant="compact"
      />
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
  return (
    <>
      <ul className={`project-cards project-cards--${variant}`} data-projects>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
      <p className="project-cards__note">{PROJECTS_COPY.pendingNote}</p>
    </>
  );
}
