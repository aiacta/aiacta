import { useFrame, useLoader } from '@react-three/fiber';
import * as React from 'react';
import { AudioLoader, PositionalAudio, TextureLoader } from 'three';
import paper from './crumpled_paper.jpeg';
import { DiceBoxContext } from './DiceBox';
import dieSound from './die.wav?url';
import { createDie } from './factory';
import { useDie } from './Physics';
import fragmentShader from './shader/dissolve_frag.glsl?raw';
import fragmentNoImageShader from './shader/dissolve_fragNoImage.glsl?raw';
import vertexShader from './shader/dissolve_vert.glsl?raw';
import vertexNoImageShader from './shader/dissolve_vertNoImage.glsl?raw';

export function Die({
  type,
  dissolve,
  onDissolved,
  ...props
}: {
  type: keyof typeof dice;
  dissolve?: boolean;
  onDissolved?: () => void;
  targetValue?: number;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}) {
  const { audioListener } = React.useContext(DiceBoxContext);
  const audioRef = React.useRef<PositionalAudio>();
  const sound = useLoader(AudioLoader, dieSound);
  React.useEffect(() => {
    audioRef.current?.setRefDistance(40);
  }, []);

  const [ref, fromValue, toValue] = useDie({
    ...props,
    shape: dice[type].shape,
    type,
    onCollision: (info) => {
      if (!audioRef.current?.isPlaying && info.contact.restitution === 0.3) {
        audioRef.current?.setVolume(
          Math.min(1, info.target.velocity.length() / 50),
        );
        audioRef.current?.play();
      }
    },
  });

  const textureMaps = useLoader(
    TextureLoader,
    (dice[type] as any).textureDataUrls as string[],
  );
  const noiseMap = useLoader(TextureLoader, paper);

  const uniforms = React.useMemo(
    () => ({
      noise: { value: noiseMap },
      dissolve: { value: 0 },
    }),
    [],
  );
  const calledDissolve = React.useRef(false);
  useFrame(() => {
    if (ref.current && dissolve) {
      uniforms.dissolve.value = Math.min(uniforms.dissolve.value + 0.01, 1);
      if (!calledDissolve.current && uniforms.dissolve.value >= 1) {
        onDissolved?.();
        calledDissolve.current = true;
      }
    }
  });

  const geometry = React.useMemo(() => {
    const geom = dice[type].geometry.clone();
    const maxValue = +type.slice(1);
    if (toValue) {
      geom.groups.forEach((group, idx) => {
        if (
          typeof group.materialIndex === 'number' &&
          group.materialIndex > 0
        ) {
          group.materialIndex =
            ((idx + (toValue - fromValue) + maxValue) % maxValue) + 1;
        }
      });
    }
    return geom;
  }, [fromValue, toValue]);
  React.useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh ref={ref} name={type} geometry={geometry} castShadow receiveShadow>
      <shaderMaterial
        attachArray="material"
        fragmentShader={fragmentNoImageShader}
        vertexShader={vertexNoImageShader}
        uniforms={uniforms}
      />
      {/* <meshPhongMaterial color="hotpink" attachArray="material" /> */}
      {textureMaps.map((texture) => (
        <shaderMaterial
          key={texture.uuid}
          attachArray="material"
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={{
            image: { value: texture },
            ...uniforms,
          }}
        />
      ))}
      <positionalAudio
        ref={audioRef}
        buffer={sound}
        args={[audioListener]}
        autoplay={false}
        loop={false}
      />
    </mesh>
  );
}

const dice = {
  d4: createDie('d4'),
  d6: createDie('d6'),
  d8: createDie('d8'),
  d10: createDie('d10'),
  d12: createDie('d12'),
  d20: createDie('d20'),
};
