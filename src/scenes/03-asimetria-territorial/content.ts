import { COUNTRY_COLOR } from '@/lib/tokens';

export type CountryId = 'es' | 'ar';

export interface CountryFigures {
  id: CountryId;
  name: string;
  areaKm2: number;
  population: number;
  densityPerKm2: number;
  accentToken: string;
}

export interface Act3Content {
  act: 3;
  title: string;
  intro: { europe: string; southAmerica: string };
  countries: readonly [CountryFigures, CountryFigures];
  copy: {
    areaLabel: string;
    populationLabel: string;
    densityLabel: string;
    canvasAlt: string;
    fallbackNote: string;
  };
}

/** Cifras de `content/03-datos-y-tablas.md`. Los tokens de color son de `COUNTRY_COLOR`. */
export const ACT3: Act3Content = {
  act: 3,
  title: 'Estado de derecho',
  intro: {
    europe:
      'Europa ha resignado parcialmente su estado de derecho y los efectos previstos la diferenciarán claramente del resto de Occidente, provocando una fuga de capitales de perfiles dinámicos con alta conciencia ciudadana o insatisfacción con el modelo fiscal/institucional, reduciendo así la masa crítica necesaria para fiscalizar al poder público o movilizar reformas institucionales, deteriorando el sistema y afectando la capacidad recaudatoria.',
    southAmerica:
      'Sudamérica, por su parte, está recibiendo un impacto positivo en su estructura. La llegada de inversiones a variada escala representa un fortalecimiento en sus aspectos económico, político y social, impulsará una evolución en la calidad de vida y alimentará la necesidad de optimizar el estado de derecho característico de Occidente.',
  },
  countries: [
    {
      id: 'es',
      name: 'España',
      areaKm2: 505990,
      population: 48600000,
      densityPerKm2: 96.05,
      accentToken: COUNTRY_COLOR.es,
    },
    {
      id: 'ar',
      name: 'Argentina',
      areaKm2: 2780400,
      population: 45900000,
      densityPerKm2: 16.51,
      accentToken: COUNTRY_COLOR.ar,
    },
  ],
  copy: {
    areaLabel: 'Superficie',
    populationLabel: 'Población',
    densityLabel: 'Densidad',
    canvasAlt: 'España y Argentina de noche: densidad de luz urbana comparada',
    fallbackNote: 'Vista estática: su dispositivo no admite la escena interactiva',
  },
};
