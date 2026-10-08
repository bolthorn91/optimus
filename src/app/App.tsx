import { BrowserRouter, Route, Routes } from 'react-router';

import { HomePage } from '@/app/HomePage';
import { Layout } from '@/app/Layout';
import { isActRoute, isLegalRoute, isVehicleRoute, ROUTES, type RouteEntry } from '@/app/routes';
import { ActDetailPage } from '@/pages/ActDetailPage';
import { DesignPage } from '@/pages/DesignPage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { VehicleDetailPage } from '@/pages/VehicleDetailPage';

function elementFor(route: RouteEntry) {
  switch (route.kind) {
    case 'act':
      if (!isActRoute(route)) throw new Error(`Ruta de acto sin número: ${route.path}`);
      return <ActDetailPage actNumber={route.actNumber} />;
    case 'vehicle':
      if (!isVehicleRoute(route)) throw new Error(`Ruta de vehículo sin id: ${route.path}`);
      return <VehicleDetailPage vehicleId={route.vehicleId} />;
    case 'legal':
      if (!isLegalRoute(route)) throw new Error(`Ruta legal sin id: ${route.path}`);
      return <LegalPage document={route.legalId} />;
    case 'home':
      return <HomePage />;
  }
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<DesignPage />} path="design" />
          {ROUTES.filter((route) => route.kind !== 'home').map((route) => (
            <Route
              element={elementFor(route)}
              key={route.path}
              path={route.path.replace(/^\//, '')}
            />
          ))}
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
