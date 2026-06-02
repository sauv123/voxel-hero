import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import VoxelDeer from './VoxelDeer';
import VoxelDuck from './VoxelDuck';
import VoxelDino from './VoxelDino';
import * as THREE from 'three';

const CHARACTERS = ['deer', 'duck', 'dino'];

const CharacterSwitch = forwardRef(({ activeChar, ctaHover, onClick }, ref) => {
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
    <group>
      {activeChar === 'deer' && <VoxelDeer ref={deerRef} ctaHover={ctaHover} />}
      {activeChar === 'duck' && <VoxelDuck ref={duckRef} ctaHover={ctaHover} />}
      {activeChar === 'dino' && <VoxelDino ref={dinoRef} ctaHover={ctaHover} />}
    </group>
  );
});

const Scene = ({ activeChar, ctaHover, onCharacterClick, charRef, minimal = false }) => {

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
        position={minimal ? [0, -1, 0] : [1.8, -0.5, 0]} 
        rotation={minimal ? [0, -0.5, 0] : [0, -Math.PI / 2 + 0.3, 0]}
      >
        <CharacterSwitch
          ref={charRef}
          activeChar={activeChar}
          ctaHover={ctaHover}
          onClick={onCharacterClick}
        />
      </group>

      <ContactShadows
        position={[1.8, -2.2, 0]}
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
};

export default Scene;
