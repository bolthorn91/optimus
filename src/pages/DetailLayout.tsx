import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { ActNumber, RouteNav } from '@/app/routes';
import { RomanNumeral } from '@/components/RomanNumeral';
import { DETAIL_COPY } from '@/pages/detailCopy';
import { SourceList } from '@/pages/SourceList';
import { TableOfContents, type TocEntry } from '@/pages/TableOfContents';

import './detail-layout.css';

export interface DetailLayoutProps {
  title: string;
  toc: readonly TocEntry[];
  children?: ReactNode;
  sources?: readonly string[];
  actNumber?: ActNumber;
  prev?: RouteNav;
  next?: RouteNav;
}

export function DetailLayout({
  title,
  toc,
  children,
  sources = [],
  actNumber,
  prev,
  next,
}: DetailLayoutProps) {
  return (
    <article className="detail">
      <TableOfContents entries={toc} />
      <header className="detail-header">
        <p>
          <Link to="/">{DETAIL_COPY.backToHome}</Link>
        </p>
        <h1>
          {actNumber === undefined ? null : (
            <>
              <RomanNumeral decorative value={actNumber} />{' '}
            </>
          )}
          {title}
        </h1>
      </header>
      <div className="detail-main">{children}</div>
      <SourceList sources={sources} />
      {prev || next ? (
        <nav aria-label="Actos" className="detail-nav">
          {prev ? (
            <Link rel="prev" to={prev.href}>
              {DETAIL_COPY.prevAct}: {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link rel="next" to={next.href}>
              {DETAIL_COPY.nextAct}: {next.title}
            </Link>
          ) : null}
        </nav>
      ) : null}
      <p className="detail-cta">
        <Link className="cta" to="/#contacto">
          {DETAIL_COPY.cta}
        </Link>
      </p>
    </article>
  );
}
