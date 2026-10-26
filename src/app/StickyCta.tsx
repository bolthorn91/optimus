import { Link } from 'react-router';

import { MOBILE_COPY } from '@/app/mobileCopy';

import './sticky-cta.css';

export function StickyCta({ to = '/contacto' }: { to?: string }) {
  return (
    <Link
      className="sticky-cta"
      data-sticky-cta
      data-track="cta"
      data-track-position="sticky"
      to={to}
    >
      {MOBILE_COPY.stickyCta}
    </Link>
  );
}
