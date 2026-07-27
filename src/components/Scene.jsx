import React, { useRef, useEffect, forwardRef, useImperativeHandle, Suspense, lazy } from 'react';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
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

const MouseParallaxGroup = ({ children, charPos, charRot, isMobile, onCharacterHover, onCharacterClick }) => {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: e.detail.x,
        y: e.detail.y
      };
    };
    window.addEventListener('voxel-mouse-move', handleMouseMove);
    return () => window.removeEventListener('voxel-mouse-move', handleMouseMove);
  }, []);

  useEffect(() => {
    let animId;
    const updateParallax = () => {
      if (groupRef.current) {
        // Smoothly damp rotation based on mouse coordinates
        const targetRotY = charRot[1] + mouse.current.x * 0.25;
        const targetRotX = charRot[0] - mouse.current.y * 0.15;

        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.08;
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.08;
      }
      animId = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    return () => cancelAnimationFrame(animId);
  }, [charRot]);

  return (
    <group 
      ref={groupRef}
      position={charPos} 
      rotation={charRot}
      scale={isMobile ? 0.95 : 0.93}
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
      {children}
    </group>
  );
};

const DynamicCursorLight = () => {
  const lightRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (lightRef.current) {
        // Move directional light in tandem with cursor
        lightRef.current.position.x = 5 + e.detail.x * 4;
        lightRef.current.position.y = 10 + e.detail.y * 3;
      }
    };
    window.addEventListener('voxel-mouse-move', handleMouseMove);
    return () => window.removeEventListener('voxel-mouse-move', handleMouseMove);
  }, []);

  return (
    <directionalLight 
      ref={lightRef}
      position={[5, 10, 5]} 
      intensity={1.5} 
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-near={0.5}
      shadow-camera-far={20}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
    />
  );
};

const Scene = React.memo(({ activeChar, ctaHover, onCharacterClick, onCharacterHover, charRef, minimal = false }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  const charPos = minimal ? [0, -1, 0] : (isMobile ? [0, -0.2, 0] : [2.2, -0.5, 0]);
  const charRot = minimal ? [0, -0.5, 0] : (isMobile ? [0, -0.2, 0] : [0, -Math.PI / 2 + 0.3, 0]);
  const shadowPos = isMobile ? [0, -1.7, 0] : [2.2, -2.2, 0];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 7]} fov={42} />

      <ambientLight intensity={0.7} />
      <DynamicCursorLight />
      <directionalLight position={[-4, 6, -4]} intensity={0.5} />
      <pointLight position={[2, 4, 2]} intensity={0.6} color="#fff4e0" />

      <Environment preset="city" />

      <MouseParallaxGroup
        charPos={charPos}
        charRot={charRot}
        isMobile={isMobile}
        onCharacterHover={onCharacterHover}
        onCharacterClick={onCharacterClick}
      >
        <CharacterSwitch
          ref={charRef}
          activeChar={activeChar}
          ctaHover={ctaHover}
          onClick={onCharacterClick}
        />
      </MouseParallaxGroup>

      <ContactShadows
        position={shadowPos}
        opacity={0.5}
        scale={12}
        blur={2}
        far={4}
        color="#051a05"
      />

      {!minimal && (
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.5} />
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>
      )}
    </>
  );
});

export default Scene;
