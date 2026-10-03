import { BrowserRouter, Route, Routes } from 'react-router';

import { HomePage } from '@/app/HomePage';
import { Layout } from '@/app/Layout';
import { ROUTES } from '@/app/routes';
import { DesignPage } from '@/pages/DesignPage';
import { DetailPage } from '@/pages/DetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<DesignPage />} path="design" />
          {ROUTES.filter((route) => route.kind !== 'home').map((route) => (
            <Route
              element={<DetailPage route={route} />}
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
