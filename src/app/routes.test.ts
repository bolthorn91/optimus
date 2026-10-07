import { describe, expect, it } from 'vitest';

import {
  actRoute,
  adjacentActs,
  homeRoute,
  isActRoute,
  isVehicleRoute,
  ROUTES,
  routeByPath,
  vehicleRoute,
} from '@/app/routes';

describe('manifiesto de rutas', () => {
  it('declara la home, siete actos, tres vehículos y tres legales', () => {
    expect(ROUTES.filter((route) => route.kind === 'home')).toHaveLength(1);
    expect(ROUTES.filter(isActRoute)).toHaveLength(7);
    expect(ROUTES.filter((route) => route.kind === 'vehicle')).toHaveLength(3);
    expect(ROUTES.filter((route) => route.kind === 'legal')).toHaveLength(3);
    expect(ROUTES).toHaveLength(14);
    expect(homeRoute().path).toBe('/');
  });

  it('F1 · las rutas de acto son las siete legibles en español', () => {
    expect(ROUTES.filter(isActRoute).map((route) => route.path)).toEqual([
      '/escenario-europeo',
      '/seguridad-global',
      '/estado-de-derecho',
      '/estrategia-anticipatoria',
      '/nuestra-estrategia',
      '/estructura-operativa',
      '/asesoramiento-intermediacion',
    ]);
  });

  it('actRoute resuelve el manifiesto por número de acto', () => {
    expect(actRoute(1).path).toBe('/escenario-europeo');
    expect(actRoute(7).path).toBe('/asesoramiento-intermediacion');
  });

  it('adjacentActs recorre el acto anterior y el siguiente', () => {
    expect(adjacentActs(1).prev).toBeUndefined();
    expect(adjacentActs(1).next?.href).toBe('/seguridad-global');
    expect(adjacentActs(7).next).toBeUndefined();
    expect(adjacentActs(7).prev?.href).toBe('/estructura-operativa');
  });

  it('routeByPath no inventa una entrada', () => {
    expect(routeByPath('/no-existe')).toBeUndefined();
    expect(routeByPath('/aviso-legal')?.kind).toBe('legal');
  });

  it('S1 · las rutas de vehículo declaran el id canónico', () => {
    expect(ROUTES.filter(isVehicleRoute).map((route) => [route.path, route.vehicleId])).toEqual([
      ['/activos/bienes-raices', 'real-estate'],
      ['/activos/acciones-y-titulos', 'equities'],
      ['/activos/proyectos-al-pozo', 'development'],
    ]);
    expect(vehicleRoute('equities').path).toBe('/activos/acciones-y-titulos');
  });
});
