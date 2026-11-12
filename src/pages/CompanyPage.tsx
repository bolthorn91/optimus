import { PageIntro } from '@/components/PageIntro';
import { Act67Scene } from '@/scenes/06-firma/Scene';

const COPY = {
  eyebrow: 'La firma',
  title: 'Quiénes somos',
  intro:
    'Una firma hispano-argentina que reúne la lectura del mercado, la estructura jurídica y el acompañamiento directo en cada operación.',
} as const;

/**
 * La firma, el fundador, los departamentos y el asesoramiento transfronterizo dejan de
 * ocupar la home. La página conserva el contenido completo y su lectura pausada.
 */
export function CompanyPage() {
  return (
    <>
      <PageIntro eyebrow={COPY.eyebrow} intro={COPY.intro} title={COPY.title} />
      <Act67Scene />
    </>
  );
}
