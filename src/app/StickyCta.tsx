import { MOBILE_COPY } from '@/app/mobileCopy';

import './sticky-cta.css';

export function StickyCta() {
  return (
    <a
      className="sticky-cta"
      data-sticky-cta
      data-track="cta"
      data-track-position="sticky"
      href="/#contacto"
    >
      {MOBILE_COPY.stickyCta}
    </a>
  );
}
