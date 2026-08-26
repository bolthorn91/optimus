import type { CSSProperties, ReactNode, Ref } from 'react';

export interface SceneProps {
  id: string;
  act?: number | null;
  height: string;
  background?: string;
  fallback?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLElement | null>;
}

/**
 * Reserva altura antes de montar contenido pesado (M7, M9, I9). El fallback ya lleva el texto
 * completo: el canvas ilustra, el DOM informa. El `ref` es el ancla de useGsapScene.
 */
export function Scene({ id, act, height, background, fallback, children, ref }: SceneProps) {
  const style: CSSProperties = {
    minBlockSize: height,
    background,
  };

  return (
    <section
      ref={ref}
      data-scene
      id={id}
      data-act={typeof act === 'number' ? String(act) : undefined}
      style={style}
    >
      {fallback}
      {children}
    </section>
  );
}
