import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ClampToEdgeWrapping,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  type ShaderMaterial,
  type Texture,
} from 'three';

import { CITY_LIGHTS } from '@/scenes/03-asimetria-territorial/cities';
import type { CountryFigures, CountryId } from '@/scenes/03-asimetria-territorial/content';
import {
  cityIntensity,
  COUNTRY_MESH,
  lonLatToLocal,
} from '@/scenes/03-asimetria-territorial/countryLayout';
import {
  cityFragment,
  cityVertex,
  nightfallFragment,
  nightfallVertex,
} from '@/scenes/03-asimetria-territorial/nightfallShader';
import { NIGHTFALL_TEXTURES } from '@/scenes/03-asimetria-territorial/nightfallTextures';
import type { Act3State } from '@/scenes/03-asimetria-territorial/timeline';
import { LazyCanvas } from '@/three/LazyCanvas';

function prepareMap(texture: Texture): void {
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.premultiplyAlpha = false;
  texture.needsUpdate = true;
}

function NightfallBloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const instance = new EffectComposer(gl);
    instance.addPass(new RenderPass(scene, camera));
    instance.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          intensity: 0.7,
          luminanceThreshold: 0.18,
          mipmapBlur: true,
          radius: 0.42,
        }),
      ),
    );
    return instance;
  }, [camera, gl, scene]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size.height, size.width]);

  useEffect(
    () => () => {
      composer.dispose();
    },
    [composer],
  );

  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);

  return null;
}

function CityLights({ country, glow }: { country: CountryId; glow: number }) {
  const cities = useMemo(() => CITY_LIGHTS.filter((city) => city.country === country), [country]);
  const geometry = useMemo(() => {
    const positions = new Float32Array(cities.length * 3);
    const weights = new Float32Array(cities.length);
    const intensities = new Float32Array(cities.length);
    cities.forEach((city, index) => {
      const local = lonLatToLocal(city.country, city.lat, city.lon);
      positions[index * 3] = local.x;
      positions[index * 3 + 1] = local.y;
      positions[index * 3 + 2] = 0.04;
      weights[index] = city.weight;
    });
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aWeight', new BufferAttribute(weights, 1));
    geo.setAttribute('aIntensity', new BufferAttribute(intensities, 1));
    return geo;
  }, [cities]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    const attr = geometry.getAttribute('aIntensity');
    if (!(attr instanceof BufferAttribute)) return;
    for (let index = 0; index < cities.length; index += 1) {
      const city = cities[index];
      if (!city) continue;
      attr.setX(index, cityIntensity(glow, city.weight));
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={cityFragment}
        toneMapped={false}
        transparent
        vertexShader={cityVertex}
      />
    </points>
  );
}

function CountryNight({
  country,
  nightAmount,
  terminatorX,
  cityGlow,
}: {
  country: CountryId;
  nightAmount: number;
  terminatorX: number;
  cityGlow: number;
}) {
  const mesh = COUNTRY_MESH[country];
  const dayMap = useLoader(TextureLoader, NIGHTFALL_TEXTURES[country].day.webp);
  const nightMap = useLoader(TextureLoader, NIGHTFALL_TEXTURES[country].night.webp);
  const uniforms = useMemo(
    () => ({
      uDay: { value: dayMap },
      uNight: { value: nightMap },
      uNightAmount: { value: 0 },
      uTerminatorX: { value: 1.15 },
    }),
    [dayMap, nightMap],
  );
  const material = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    prepareMap(dayMap);
    prepareMap(nightMap);
  }, [dayMap, nightMap]);

  useFrame(() => {
    const current = material.current?.uniforms;
    if (!current) return;
    const amount = current.uNightAmount;
    const terminator = current.uTerminatorX;
    if (amount) amount.value = nightAmount;
    if (terminator) terminator.value = terminatorX;
  });

  return (
    <group position={[mesh.x, mesh.y, 0]}>
      <mesh>
        <planeGeometry args={[mesh.width, mesh.height]} />
        <shaderMaterial
          depthWrite={false}
          fragmentShader={nightfallFragment}
          ref={material}
          toneMapped={false}
          transparent
          uniforms={uniforms}
          vertexShader={nightfallVertex}
        />
      </mesh>
      <CityLights country={country} glow={cityGlow} />
    </group>
  );
}

function NightfallScene({
  state,
  countries,
}: {
  state: Act3State;
  countries: readonly CountryFigures[];
}) {
  return (
    <>
      {countries.map((country) => (
        <CountryNight
          cityGlow={state.cityGlow[country.id]}
          country={country.id}
          key={country.id}
          nightAmount={state.nightAmount[country.id]}
          terminatorX={state.terminatorX[country.id]}
        />
      ))}
      <NightfallBloom />
    </>
  );
}

export default function NightfallCanvas({
  state,
  countries,
  onContextLost,
}: {
  state: Act3State;
  countries: readonly CountryFigures[];
  onContextLost?: (() => void) | undefined;
}) {
  return (
    <LazyCanvas
      camera={{ far: 20, near: 0.1, position: [0, 0, 8], zoom: 155 }}
      className="act3-nightfall-canvas"
      onContextLost={onContextLost}
      orthographic
    >
      <NightfallScene countries={countries} state={state} />
    </LazyCanvas>
  );
}
