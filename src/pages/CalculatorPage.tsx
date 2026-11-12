import { PageIntro } from '@/components/PageIntro';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';

const COPY = {
  eyebrow: 'Herramienta',
  title: 'Calculadora de escenario',
  intro:
    'Ajuste capital, horizonte y perfil para ver una proyección ilustrativa. Los supuestos del cálculo están a la vista y no constituyen una promesa de rentabilidad.',
  sceneHeading: 'Simulador de escenario',
  sceneIntro:
    'Mueva los controles para comparar el resultado en cada tipo de activo. La tabla y los supuestos se actualizan con cada cambio.',
} as const;

export function CalculatorPage() {
  return (
    <>
      <PageIntro eyebrow={COPY.eyebrow} intro={COPY.intro} title={COPY.title} />
      <Act5Scene heading={COPY.sceneHeading} intro={COPY.sceneIntro} />
    </>
  );
}
