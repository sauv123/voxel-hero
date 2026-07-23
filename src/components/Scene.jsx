import React, { useRef, forwardRef, useImperativeHandle, Suspense, lazy } from 'react';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
const VoxelDeer = lazy(() => import('./VoxelDeer'));
const VoxelDuck = lazy(() => import('./VoxelDuck'));
const VoxelDino = lazy(() => import('./VoxelDino'));
import * as THREE from 'three';

const CHARACTERS = ['deer', 'duck', 'dino'];

const CharacterSwitch = forwardRef(({ activeChar, ctaHover }, ref) => {
  const deerRef = useRef();
  const duckRef = useRef();
  const dinoRef = useRef();

  useImperativeHandle(ref, () => ({
    hop() {
      if (activeChar === 'deer') deerRef.current?.hop();
      if (activeChar === 'duck') duckRef.current?.hop();
      if (activeChar === 'dino') dinoRef.current?.hop();
    }
  }));

  return (
    <Suspense fallback={null}>
      <group>
        {activeChar === 'deer' && <VoxelDeer ref={deerRef} ctaHover={ctaHover} />}
        {activeChar === 'duck' && <VoxelDuck ref={duckRef} ctaHover={ctaHover} />}
        {activeChar === 'dino' && <VoxelDino ref={dinoRef} ctaHover={ctaHover} />}
      </group>
    </Suspense>
  );
});

const Scene = React.memo(({ activeChar, ctaHover, onCharacterClick, onCharacterHover, charRef, minimal = false }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  const charPos = minimal ? [0, -1, 0] : (isMobile ? [0, -0.2, 0] : [2.2, -0.5, 0]);
  const charRot = minimal ? [0, -0.5, 0] : (isMobile ? [0, -0.2, 0] : [0, -Math.PI / 2 + 0.3, 0]);
  const shadowPos = isMobile ? [0, -1.7, 0] : [2.2, -2.2, 0];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 7]} fov={42} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.4} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-4, 6, -4]} intensity={0.5} />
      <pointLight position={[2, 4, 2]} intensity={0.6} color="#fff4e0" />

      <Environment preset="city" />

      <group 
        position={charPos} 
        rotation={charRot}
        scale={isMobile ? 0.95 : 0.93} // Reduced size by 5-8%
        onPointerOver={(e) => {
          e.stopPropagation();
          if (onCharacterHover) onCharacterHover(true);
        }}
        onPointerOut={() => {
          if (onCharacterHover) onCharacterHover(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onCharacterClick) onCharacterClick();
        }}
      >
        <CharacterSwitch
          ref={charRef}
          activeChar={activeChar}
          ctaHover={ctaHover}
          onClick={onCharacterClick}
        />
      </group>

      <ContactShadows
        position={shadowPos}
        opacity={0.5}
        scale={12}
        blur={2}
        far={4}
        color="#051a05"
      />

      {!minimal && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.6} mipmapBlur intensity={0.35} />
          <Noise opacity={0.025} />
        </EffectComposer>
      )}
    </>
  );
});

export default Scene;
