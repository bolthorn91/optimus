import { useCallback, useRef } from 'react';

import { SplitText } from '@/motion/gsapSetup';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { HERO } from '@/scenes/00-hero/content';
import { HeroHeadline } from '@/scenes/00-hero/HeroHeadline';
import { IntroCards } from '@/scenes/00-hero/IntroCards';
import { choreographIntro, type HeroIntroState } from '@/scenes/00-hero/timeline';

import './scene.css';

const INTRO_DURATION = 1.2;

function applyIntro(node: HTMLElement, state: HeroIntroState): void {
  node.style.setProperty('--logo-opacity', String(state.logoOpacity));
  node.style.setProperty('--logo-y', `${String(state.logoY)}px`);
  node.style.setProperty('--claim-opacity', String(state.claimOpacity));
  node.style.setProperty('--cta-opacity', String(state.ctaOpacity));
  node.style.setProperty('--hint-opacity', String(state.hintOpacity));
  node.querySelectorAll<HTMLElement>('.hero-line').forEach((line, index) => {
    const opacity = state.lineOpacity[index];
    const y = state.lineY[index];
    const blur = state.lineBlur[index];
    if (opacity === undefined || y === undefined || blur === undefined) return;
    line.style.opacity = String(opacity);
    line.style.transform = `translateY(${String(y)}px)`;
    line.style.filter = `blur(${String(blur)}px)`;
  });
}

export function HeroScene() {
  const ref = useRef<HTMLElement>(null);
  const lineCountRef = useRef(3);

  const setup = useCallback((element: HTMLElement) => {
    const heading = element.querySelector('h1');
    if (!heading) return;
    heading.setAttribute('aria-label', HERO.headline);
    SplitText.create(heading, { type: 'lines', linesClass: 'hero-line' });
    const lines = heading.querySelectorAll('.hero-line');
    lineCountRef.current = lines.length > 0 ? lines.length : 3;
    lines.forEach((line) => {
      line.setAttribute('aria-hidden', 'true');
    });
  }, []);

  const choreograph = useCallback(
    (progress: number) => choreographIntro(progress, lineCountRef.current),
    [],
  );

  const apply = useCallback((state: HeroIntroState) => {
    if (ref.current) applyIntro(ref.current, state);
  }, []);

  useGsapScene({
    ref,
    choreograph,
    apply,
    duration: INTRO_DURATION,
    pin: false,
    scrub: false,
    setup,
  });

  return (
    <Scene
      background="var(--color-navy-deep)"
      className="on-navy"
      height="100svh"
      id="hero"
      ref={ref}
    >
      <div className="hero">
        <div className="hero-veil" />
        <div className="hero-masthead">
          <p className="hero-brand">
            <span aria-hidden="true" className="hero-brand__mark">
              O
            </span>
            <span className="hero-brand__name">OPTIMVS</span>
            <span className="hero-brand__sub">Capital Protegido</span>
          </p>
          <span className="hero-masthead__place">España · Argentina</span>
        </div>
        <HeroHeadline emphasis={HERO.headlineEmphasis} text={HERO.headline} />
        <p className="hero-claim">{HERO.claim}</p>
        <div className="hero-ctas">
          <a
            className="hero-cta hero-cta--primary"
            data-track="cta"
            data-track-position="hero"
            href={HERO.primaryCta.href}
          >
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
