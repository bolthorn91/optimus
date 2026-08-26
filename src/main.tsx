import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { MotionProvider } from '@/motion/MotionProvider';

import '@/styles/base.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el elemento #root declarado en index.html');
}

createRoot(container).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
);
