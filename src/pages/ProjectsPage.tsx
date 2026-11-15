import { ProjectCards } from '@/components/ProjectCards';
import { PROJECTS, PROJECTS_COPY } from '@/content/projects';
import { DetailLayout } from '@/pages/DetailLayout';

export function ProjectsPage() {
  return (
    <DetailLayout
      ctaTo="/contacto"
      title={PROJECTS_COPY.pageTitle}
      toc={[{ id: 'oportunidades', label: PROJECTS_COPY.pageTitle }]}
    >
      <div className="detail-prose projects-page">
        <p data-reveal="text">{PROJECTS_COPY.pageIntro}</p>
        <section id="oportunidades">
          <ProjectCards projects={PROJECTS} />
        </section>
      </div>
    </DetailLayout>
  );
}
