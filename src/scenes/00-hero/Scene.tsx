import { Scene } from '@/motion/Scene';
import { HERO } from '@/scenes/00-hero/content';
import { HeroHeadline } from '@/scenes/00-hero/HeroHeadline';
import { IntroCards } from '@/scenes/00-hero/IntroCards';

import './scene.css';

export function HeroScene() {
  return (
    <Scene background="var(--color-navy-deep)" className="on-navy" height="100svh" id="hero">
      <div className="hero">
        <img alt={HERO.logoAlt} className="hero-logo" src={HERO.logoSrc} />
        <HeroHeadline emphasis={HERO.headlineEmphasis} text={HERO.headline} />
        <p className="hero-claim">{HERO.claim}</p>
        <div className="hero-ctas">
          <a className="hero-cta hero-cta--primary" href={HERO.primaryCta.href}>
            {HERO.primaryCta.label}
          </a>
          <a className="hero-cta hero-cta--secondary" href={HERO.secondaryCta.href}>
            {HERO.secondaryCta.label}
            <span className="hero-download-note"> {HERO.downloadNote}</span>
          </a>
        </div>
        <p className="hero-hint">{HERO.scrollHint}</p>
      </div>
      <IntroCards items={HERO.intro} />
    </Scene>
  );
}
