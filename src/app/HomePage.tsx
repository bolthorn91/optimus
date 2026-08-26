import { isAct, SECTIONS } from '@/app/sections';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';

export function HomePage() {
  return (
    <>
      {SECTIONS.map((section) => (
        <Scene
          act={section.act}
          background={section.background.surface}
          height="100vh"
          id={section.id}
          key={section.id}
        >
          <h2>
            {isAct(section) ? <RomanNumeral decorative value={section.act} /> : null}{' '}
            {section.label}
          </h2>
          <p>Marcador de acto. El contenido lo montan los documentos 01 a 08.</p>
        </Scene>
      ))}
    </>
  );
}
