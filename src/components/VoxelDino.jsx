import React, { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VS = 0.22;

const P = {
  GREEN:        '#2e2bc4', // Request blue
  GREEN_DARK:   '#1e1b99',
  GREEN_LIGHT:  '#5250e5',
  BELLY:        '#e0e0ff',
  TAN:          '#C8A064',
  WHITE:        '#FFFFFF',
  BLACK:        '#111111',
};

const fill = (arr, x1, x2, y1, y2, z1, z2, color) => {
  for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
  for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
  for (let z = Math.min(z1,z2); z <= Math.max(z1,z2); z++)
    arr.push([x, y, z, color]);
};

const buildDinoBody = () => {
  const v = [];
  // Core torso
  fill(v, -3,3, 0,5, -2,2, P.GREEN);
  // Belly / lighter front
  fill(v,  1,3, 0,4, -2,2, P.BELLY);
  // Back spikes
  fill(v, -4,-3, 4,6, -1,0, P.GREEN_DARK);
  fill(v, -2,-1, 4,7, -1,0, P.GREEN_DARK);
  fill(v,  0, 1, 4,6, -1,0, P.GREEN_DARK);
  // Tail
  fill(v, -5,-4, 0,2, -1,1, P.GREEN);
  fill(v, -6,-5, 0,1, 0, 0, P.GREEN_DARK);
  // Arms
  fill(v,  4, 5, 2,4, -1,1, P.GREEN);
  fill(v,  6, 6, 2,3, 0, 0, P.TAN);
  // Legs
  fill(v, -1,1, -4,-1, -2,-1, P.GREEN);
  fill(v,  1,3, -4,-1,  1, 2, P.GREEN);
  // Feet
  fill(v, -2,2, -5,-5, -3,-1, P.TAN);
  fill(v,  0,4, -5,-5,  1, 3, P.TAN);
  return v;
};

const buildDinoHead = () => {
  const v = [];
  // Big square head
  fill(v, -4,4, -3,4, -3,3, P.GREEN);
  // Snout / chin protrudes
  fill(v,  5,7, -2,1, -2,2, P.GREEN);
  // Tooth
  fill(v,  6,7, -2,-2, 0,1, P.TAN);
  // Eye whites
  fill(v,  4,4, 2,3, -3,-2, P.WHITE);
  fill(v,  4,4, 2,3,  2, 3, P.WHITE);
  // Nostril dots
  fill(v,  7,7, 0,0, -1,0, P.GREEN_DARK);
  // Crown spikes
  fill(v, -3,-2, 4,6, -1,1, P.GREEN_DARK);
  fill(v,  0, 1, 4,5, -1,1, P.GREEN_DARK);
  return v;
};

const buildDinoPupils = () => {
  const v = [];
  fill(v, 5,5, 2,3, -3,-2, P.BLACK);
  fill(v, 5,5, 2,3,  2, 3, P.BLACK);
  return v;
};

const bodyVoxels = buildDinoBody();
const headVoxels = buildDinoHead();
const pupilVoxels = buildDinoPupils();

function VoxelPart({ voxels, ...props }) {
  const meshRef = useRef();
  const count = voxels.length;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const c = new THREE.Color();
    voxels.forEach(([,,,hex], i) => {
      c.set(hex); arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b;
    });
    return arr;
  }, [voxels, count]);

  useFrame(() => {
    if (meshRef.current && !meshRef.current.__init) {
      voxels.forEach(([x,y,z], i) => {
        dummy.position.set(x*VS, y*VS, z*VS);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.__init = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow {...props}>
      <boxGeometry args={[VS, VS, VS]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial vertexColors roughness={0.8} metalness={0.05} />
    </instancedMesh>
  );
}

const VoxelDino = forwardRef(({ ctaHover = false }, ref) => {
  const groupRef = useRef();
  const headRef  = useRef();
  const pupilRef = useRef();
  const bobTime  = useRef(0);
  const hopVel   = useRef(0);
  const hopPos   = useRef(0);
  const yayTime  = useRef(0);

  useImperativeHandle(ref, () => ({
    hop() { hopVel.current = 0.18; },
    yay() { yayTime.current = 1.8; }
  }));

  useFrame((state, delta) => {
    const mouse = state.mouse;
    bobTime.current += delta;

    if (yayTime.current > 0) {
      yayTime.current -= delta;
      if (hopPos.current <= 0 && hopVel.current <= 0) hopVel.current = 0.22;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(bobTime.current * 1.8) * 0.1;
      if (ctaHover) {
        groupRef.current.rotation.z = Math.sin(bobTime.current * 10) * 0.09;
        groupRef.current.rotation.y += (0.0 - groupRef.current.rotation.y) * 0.1;
      } else {
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y += (mouse.x * 0.2 - groupRef.current.rotation.y) * 0.08;
      }
    }

    hopPos.current += hopVel.current;
    hopVel.current -= 0.012;
    if (hopPos.current < 0) { hopPos.current = 0; hopVel.current = 0; }
    if (groupRef.current) groupRef.current.position.y += hopPos.current;

    if (headRef.current) {
      // correct mouse direction
      const isAndroidMobile = typeof window !== 'undefined' && (/Android/i.test(window.navigator.userAgent) || window.innerWidth < 768);
      const targetY = ctaHover ? 0.0 : (isAndroidMobile ? 0.0 : mouse.x * 1.2);
      const targetZ = ctaHover ? -0.5 : (isAndroidMobile ? -0.8 : mouse.y * 1.2);
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.z += (targetZ - headRef.current.rotation.z) * 0.1;
    }

    if (pupilRef.current) {
      const isAndroidMobile = typeof window !== 'undefined' && (/Android/i.test(window.navigator.userAgent) || window.innerWidth < 768);
      pupilRef.current.position.x = isAndroidMobile ? 0.0 : mouse.x * 0.05;
      pupilRef.current.position.y = isAndroidMobile ? -0.08 : mouse.y * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <VoxelPart voxels={bodyVoxels} position={[0, 0, 0]} />
      <group position={[0, VS * 6, 0]}>
        <group ref={headRef}>
          <VoxelPart voxels={headVoxels} />
          <group ref={pupilRef}>
            <VoxelPart voxels={pupilVoxels} />
          </group>
        </group>
      </group>
    </group>
  );
});

export default VoxelDino;
