import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { NIGHTFALL_TEXTURES } from '@/scenes/03-asimetria-territorial/nightfallTextures';

/** Imagen nocturna estática. Las cifras viven en el Stage, no aquí. */
export function NightfallFallback() {
  const fallback = NIGHTFALL_TEXTURES.fallback;

  return (
    <div className="act3-nightfall-visual">
      <figure>
        <picture>
          <source srcSet={fallback.webp} type="image/webp" />
          <img alt={ACT3.copy.canvasAlt} src={fallback.fallback} />
        </picture>
      </figure>
    </div>
  );
}
