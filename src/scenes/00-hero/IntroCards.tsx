import type { IntroCard } from '@/scenes/00-hero/content';

export interface IntroCardsProps {
  items: readonly IntroCard[];
}

export function IntroCards({ items }: IntroCardsProps) {
  return (
    <ul className="hero-intro">
      {items.map((item) => (
        <li key={item.label}>
          <p className="hero-intro__label">{item.label}</p>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
