import { Link } from 'react-router';

import { DETAIL_COPY } from '@/pages/detailCopy';

import './detail-layout.css';

export function NotFoundPage() {
  return (
    <article className="detail" data-not-found>
      <header className="detail-header">
        <h1>{DETAIL_COPY.notFoundTitle}</h1>
        <p>{DETAIL_COPY.notFoundBody}</p>
      </header>
      <p className="detail-nav">
        <Link to="/">{DETAIL_COPY.backToHome}</Link>
        <Link className="cta" data-track="cta" data-track-position="not-found" to="/#contacto">
          {DETAIL_COPY.cta}
        </Link>
      </p>
    </article>
  );
}
