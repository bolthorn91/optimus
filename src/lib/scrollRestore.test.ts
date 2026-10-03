import { describe, expect, it } from 'vitest';

import { decideScroll } from '@/lib/scrollRestore';

describe('decideScroll', () => {
  it('DET-16 · al volver a la home pide restaurar, no ir al principio', () => {
    expect(
      decideScroll({
        prevPath: '/',
        nextPath: '/escenario-europeo',
        nextHash: '',
      }),
    ).toEqual({ kind: 'top' });
    expect(
      decideScroll({
        prevPath: '/escenario-europeo',
        nextPath: '/',
        nextHash: '',
      }),
    ).toEqual({ kind: 'restore' });
  });

  it('un ancla en la home gana sobre la restauración', () => {
    expect(
      decideScroll({
        prevPath: '/aviso-legal',
        nextPath: '/',
        nextHash: '#contacto',
      }),
    ).toEqual({ kind: 'hash', id: 'contacto' });
  });

  it('entre páginas de detalle va al inicio', () => {
    expect(
      decideScroll({
        prevPath: '/escenario-europeo',
        nextPath: '/seguridad-global',
        nextHash: '',
      }),
    ).toEqual({ kind: 'top' });
  });
});
