import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BLADE_COUNT = 5000;
const GRASS_SIZE = 16;

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float time;
  
  void main() {
    vUv = uv;
    vec4 instancePos = instanceMatrix * vec4(position, 1.0);
    
    // Simple wind effect based on position and time
    float sway = sin(time * 2.0 + instancePos.x * 0.5 + instancePos.z * 0.5) * 0.1;
    
    // Only sway the top vertices (where uv.y is close to 1)
    if (uv.y > 0.1) {
      instancePos.x += sway * uv.y * uv.y * 3.0;
      instancePos.z += sway * uv.y * uv.y * 3.0;
    }
    
    vElevation = instancePos.y;
    gl_Position = projectionMatrix * modelViewMatrix * instancePos;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vec3 baseColor = vec3(0.05, 0.25, 0.05);
    vec3 tipColor = vec3(0.3, 0.7, 0.2);
    vec3 color = mix(baseColor, tipColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Grassland() {
  const meshRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < BLADE_COUNT; i++) {
      // Random position in a circle or square
      const x = (Math.random() - 0.5) * GRASS_SIZE;
      const z = (Math.random() - 0.5) * GRASS_SIZE;
      
      // Keep out of immediate center for characters
      if (x * x + z * z < 1.0) continue; 
      
      const height = Math.random() * 0.5 + 0.3;
      
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, -1.0, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[GRASS_SIZE, GRASS_SIZE]} />
        <meshStandardMaterial color="#0a2a0a" roughness={0.9} />
      </mesh>
      
      {/* Instanced grass */}
      <instancedMesh ref={meshRef} args={[null, null, BLADE_COUNT]}>
        <coneGeometry args={[0.02, 1, 3]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
