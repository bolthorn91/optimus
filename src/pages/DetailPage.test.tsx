import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, Link } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import { Layout } from '@/app/Layout';
import { adjacentActs, routeByPath, ROUTES } from '@/app/routes';
import { MotionContext } from '@/motion/MotionProvider';
import { DETAIL_COPY } from '@/pages/detailCopy';
import { DetailLayout } from '@/pages/DetailLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const AVISO = routeByPath('/aviso-legal');
if (!AVISO) throw new Error('El manifiesto no declara /aviso-legal');

describe('páginas de detalle', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
    document.title = '';
    document.querySelector('link[rel="canonical"]')?.remove();
  });

  it('DET-15 · una URL desconocida da 404 con salida y CTA, sin redirigir a la home', () => {
    window.history.pushState({}, '', '/esta-url-no-existe');
    render(<App />);
    expect(screen.getByRole('heading', { name: DETAIL_COPY.notFoundTitle })).toBeInTheDocument();
    expect(screen.getByText(DETAIL_COPY.notFoundBody)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: DETAIL_COPY.backToHome })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: DETAIL_COPY.cta }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: /Inversión estratégica/i })).toBeNull();
  });

  it('SEO-02 · cada página renderizada declara una canónica absoluta', () => {
    const samples = ['/', '/escenario-europeo', '/activos/bienes-raices', '/aviso-legal'] as const;
    for (const path of samples) {
      window.history.pushState({}, '', path);
      const { unmount } = render(<App />);
      const canonical = document.querySelector('link[rel="canonical"]');
      const route = ROUTES.find((entry) => entry.path === path);
      expect(route).toBeDefined();
      expect(canonical).toHaveAttribute(
        'href',
        `${window.location.origin}${path === '/' ? '/' : path}`,
      );
      unmount();
    }
  });

  it('F5 · F6 · el índice, las fuentes y la navegación entre actos están en el DOM', () => {
    const adjacent = adjacentActs(2);
    const { container } = render(
      <MemoryRouter>
        <DetailLayout
          actNumber={2}
          sources={['ACLED']}
          title="Seguridad global"
          toc={[{ id: 'mapas', label: 'Mapas' }]}
          {...adjacent}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('navigation', { name: DETAIL_COPY.toc })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mapas' })).toHaveAttribute('href', '#mapas');
    expect(screen.getByRole('heading', { name: DETAIL_COPY.sources })).toBeInTheDocument();
    expect(container.querySelector('.detail-sources img')).toBeNull();
    expect(container).toHaveTextContent('ACLED');
    expect(screen.getByRole('link', { name: new RegExp(DETAIL_COPY.prevAct) })).toHaveAttribute(
      'href',
      '/escenario-europeo',
    );
    expect(screen.getByRole('link', { name: new RegExp(DETAIL_COPY.nextAct) })).toHaveAttribute(
      'href',
      '/estado-de-derecho',
    );
  });

  it('DET-16 · volver de un detalle a la home restaura el scroll previo', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    let y = 640;
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />} path="/">
            <Route
              element={
                <div>
                  <p>en-home</p>
                  <Link to="/aviso-legal">a-legal</Link>
                </div>
              }
              index
            />
            <Route element={<DetailLayout title={AVISO.title} toc={[]} />} path="aviso-legal" />
            <Route element={<NotFoundPage />} path="*" />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    y = 0;
    fireEvent.click(screen.getByRole('link', { name: 'a-legal' }));
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    fireEvent.click(screen.getByRole('link', { name: DETAIL_COPY.backToHome }));
    expect(scrollTo).toHaveBeenCalledWith(0, 640);
  });

  it('DET-16 · Lenis se redimensiona antes de restaurar, no clampa al límite del detalle', () => {
    let limit = 200;
    const lenisScrollTo = vi.fn((target: number) => {
      return Math.min(Math.max(0, target), limit);
    });
    const lenis = {
      scroll: 640,
      get limit() {
        return limit;
      },
      resize: () => {
        limit = 8000;
      },
      scrollTo: lenisScrollTo,
      on: () => () => undefined,
    };

    render(
      <MotionContext.Provider value={lenis as never}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<Layout />} path="/">
              <Route
                element={
                  <div>
                    <p>en-home</p>
                    <Link to="/aviso-legal">a-legal</Link>
                  </div>
                }
                index
              />
              <Route element={<DetailLayout title={AVISO.title} toc={[]} />} path="aviso-legal" />
            </Route>
          </Routes>
        </MemoryRouter>
      </MotionContext.Provider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'a-legal' }));
    fireEvent.click(screen.getByRole('link', { name: DETAIL_COPY.backToHome }));
    expect(limit).toBe(8000);
    expect(lenisScrollTo).toHaveBeenCalledWith(640, { immediate: true });
    const restored = lenisScrollTo.mock.calls.find((call) => call[0] === 640);
    expect(restored).toBeDefined();
    expect(Math.min(640, limit)).toBe(640);
  });

  it('el 404 no tiene violaciones axe bloqueantes', async () => {
    window.history.pushState({}, '', '/esta-url-no-existe');
    const { container } = render(<App />);
    await expectNoBlockingAxeViolations(container);
  });

  it('el layout de detalle no tiene violaciones axe bloqueantes', async () => {
    window.history.pushState({}, '', '/escenario-europeo');
    const { container } = render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /El nuevo escenario europeo/ }),
    ).toBeInTheDocument();
    await expectNoBlockingAxeViolations(container);
  });
});
