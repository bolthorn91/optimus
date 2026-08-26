import { BrowserRouter, Route, Routes } from 'react-router';

import { HomePage } from '@/app/HomePage';
import { Layout } from '@/app/Layout';
import { PlaceholderDetail } from '@/app/PlaceholderDetail';
import { DesignPage } from '@/pages/DesignPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<DesignPage />} path="design" />
          <Route element={<PlaceholderDetail />} path="detalle" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
