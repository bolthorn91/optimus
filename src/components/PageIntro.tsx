import './page-intro.css';

export interface PageIntroProps {
  eyebrow: string;
  title: string;
  intro: string;
}

/**
 * Las páginas que alojan una escena completa necesitan un h1 propio: la escena conserva su
 * h2 de sección y la cabecera de página da contexto antes de entrar en la herramienta.
 */
export function PageIntro({ eyebrow, title, intro }: PageIntroProps) {
  return (
    <header className="page-intro on-light">
      <div className="page-intro__inner">
        <p className="page-intro__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro__copy">{intro}</p>
      </div>
    </header>
  );
}
