import { Canvas, type CanvasProps, type RootState } from '@react-three/fiber';
import { type ReactNode, useCallback } from 'react';

import { DPR_CAP } from '@/three/dpr';

export function LazyCanvas({
  children,
  onContextLost,
  onCreated,
  className,
  ...rest
}: {
  children: ReactNode;
  onContextLost?: (() => void) | undefined;
  onCreated?: CanvasProps['onCreated'];
  className?: string;
} & Omit<CanvasProps, 'children' | 'dpr' | 'onCreated'>) {
  const handleCreated = useCallback(
    (state: RootState) => {
      const node = state.gl.domElement;
      node.setAttribute('aria-hidden', 'true');
      const onLost = (event: Event) => {
        event.preventDefault();
        onContextLost?.();
      };
      node.addEventListener('webglcontextlost', onLost, { once: true });
      onCreated?.(state);
    },
    [onContextLost, onCreated],
  );

  return (
    <Canvas
      className={className}
      dpr={[1, DPR_CAP]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={handleCreated}
      {...rest}
    >
      {children}
    </Canvas>
  );
}
