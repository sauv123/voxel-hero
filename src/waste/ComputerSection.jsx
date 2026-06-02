import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Voxel Laptop Component ──
function VoxelLaptop() {
  const laptopColor = "#2a2a2a"; // slightly lighter so it's visible without environment reflection
  
  return (
    <group position={[0, -1.5, 0]}>
      {/* Base */}
      <RoundedBox args={[14, 0.5, 10]} radius={0.15} smoothness={4} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={laptopColor} metalness={0.2} roughness={0.8} />
      </RoundedBox>

      {/* Keyboard Groove */}
      <RoundedBox args={[12.5, 0.1, 4.5]} radius={0.05} smoothness={4} position={[0, 0.5, 1]}>
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>

      {/* Trackpad */}
      <RoundedBox args={[4.5, 0.1, 3]} radius={0.05} smoothness={4} position={[0, 0.5, -3]}>
        <meshStandardMaterial color="#1f1f1f" metalness={0.1} roughness={0.9} />
      </RoundedBox>
      
      {/* Lid / Screen */}
      <group position={[0, 0.5, -4.8]} rotation={[-0.15, 0, 0]}>
         {/* Lid Shell */}
         <RoundedBox args={[14, 9, 0.4]} radius={0.15} smoothness={4} position={[0, 4.5, 0]}>
            <meshStandardMaterial color={laptopColor} metalness={0.2} roughness={0.8} />
         </RoundedBox>
         
         {/* Screen Display - slightly inset */}
         <mesh position={[0, 4.5, 0.21]}>
            <planeGeometry args={[13.2, 8.2]} />
            {/* Glowing semi-transparent screen so things can pass through */}
            <meshBasicMaterial color="#E63946" toneMapped={false} transparent opacity={0.8} />
         </mesh>
      </group>
    </group>
  );
}

// ── Animation Rig ──
function ScrollAnimationRig() {
  const { camera } = useThree();
  const textGroupRef = useRef();

  useEffect(() => {
    // Initial Camera Setup
    camera.position.set(0, 3, 18);
    camera.lookAt(0, 2, 0);

    if (!textGroupRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#computer-section-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, 
        }
      });

      // 1. Gentle camera push-in
      tl.to(camera.position, {
        z: 8,
        y: 2,
        duration: 1,
        ease: 'power1.inOut',
      }, 0);

      // 2. Text flying from deep inside/behind the laptop, through the screen, past the camera
      // Screen is at z: -4.8, so text starts at z: -15
      tl.fromTo(textGroupRef.current.position, 
        { z: -15, y: 3 },
        { z: 12, y: 2, duration: 1, ease: 'power2.inOut' },
        0 // play at same time
      );

      // 3. Text scale as it flies (instead of opacity which relies on async material)
      tl.fromTo(textGroupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.3 },
        0
      );
      
    });
    
    return () => ctx.revert();
  }, [camera]);

  return (
    <group ref={textGroupRef}>
      <Text 
        fontSize={2.5} 
        color="#ffffff" 
        maxWidth={15} 
        textAlign="center" 
        anchorX="center" 
        anchorY="middle"
      >
        Designer who builds
      </Text>
    </group>
  );
}

export default function ComputerSection() {
  return (
    <section id="computer-section-container" style={{ height: '300vh', position: 'relative', background: '#000000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <React.Suspense fallback={null}>
            <color attach="background" args={['#000000']} />
            
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <VoxelLaptop />
            </Float>
            
            <ScrollAnimationRig />
            
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
          </React.Suspense>
        </Canvas>
      </div>
    </section>
  );
}
