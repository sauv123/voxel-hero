import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VS = 0.22;

const fill = (arr, x1, x2, y1, y2, z1, z2, color) => {
  for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
  for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
  for (let z = Math.min(z1,z2); z <= Math.max(z1,z2); z++)
    arr.push([x, y, z, color]);
};

// --- Case Studies (Magnifying Glass) ---
const buildMagnifyingGlass = () => {
  const v = [];
  const P = { FRAME: '#ff6b6b', GLASS: '#ffffff', HANDLE: '#333333' };
  
  // Ring
  fill(v, -3, 3, 3, 4, 0, 0, P.FRAME); // top
  fill(v, -3, 3, -3, -2, 0, 0, P.FRAME); // bottom
  fill(v, -4, -3, -2, 3, 0, 0, P.FRAME); // left
  fill(v, 3, 4, -2, 3, 0, 0, P.FRAME); // right
  
  // Glass (offset slightly back for depth)
  fill(v, -2, 2, -1, 2, -1, -1, P.GLASS);
  
  // Handle (angled down-right)
  fill(v, 3, 4, -4, -3, 0, 0, P.HANDLE);
  fill(v, 4, 5, -5, -4, 0, 0, P.HANDLE);
  fill(v, 5, 6, -6, -5, 0, 0, P.HANDLE);
  fill(v, 6, 7, -7, -6, 0, 0, P.HANDLE);
  
  return v;
};

// --- Playground (Toy Block / Cube) ---
const buildToyBlock = () => {
  const v = [];
  const P = { C1: '#a855f7', C2: '#e879f9', C3: '#c084fc', DOT: '#ffffff' };
  
  // Main body 4x4x4
  fill(v, -2, 2, -2, 2, -2, 2, P.C1);
  // Highlights
  fill(v, -2, 2, 2, 2, -2, 2, P.C2); // top lighter
  fill(v, 2, 2, -2, 1, -2, 2, P.C3); // right side darker
  
  // Dots / Pattern
  fill(v, 0, 0, 0, 0, 2, 3, P.DOT); // front
  fill(v, 0, 0, 3, 3, 0, 0, P.DOT); // top
  fill(v, 3, 3, 0, 0, 0, 0, P.DOT); // right
  
  return v;
};

// --- Other Work (Wrench) ---
const buildWrench = () => {
  const v = [];
  const P = { METAL: '#0d9488', HIGHLIGHT: '#5eead4', GRIP: '#111827' };
  
  // Handle
  fill(v, -1, 1, -4, 2, 0, 0, P.GRIP);
  
  // Head
  fill(v, -2, 2, 3, 5, 0, 0, P.METAL); // base of head
  fill(v, -3, -1, 5, 7, 0, 0, P.METAL); // left prong
  fill(v, 1, 3, 5, 7, 0, 0, P.METAL); // right prong
  
  // Highlight
  fill(v, -1, 0, -4, 2, 1, 1, P.HIGHLIGHT);
  fill(v, -1, 1, 4, 4, 1, 1, P.HIGHLIGHT);
  
  return v;
};

const magVoxels = buildMagnifyingGlass();
const blockVoxels = buildToyBlock();
const wrenchVoxels = buildWrench();

export function VoxelPart({ voxels, ...props }) {
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
      <meshStandardMaterial vertexColors roughness={0.7} metalness={0.1} />
    </instancedMesh>
  );
}

export function VoxelMagnifyingGlass(props) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  return (
    <group ref={ref} {...props}>
      <VoxelPart voxels={magVoxels} />
    </group>
  );
}

export function VoxelToyBlock(props) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * -0.6;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      ref.current.position.y = Math.cos(state.clock.elapsedTime * 2.2) * 0.15;
    }
  });
  return (
    <group ref={ref} {...props}>
      <VoxelPart voxels={blockVoxels} />
    </group>
  );
}

export function VoxelWrench(props) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.4;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.2;
    }
  });
  return (
    <group ref={ref} {...props}>
      <VoxelPart voxels={wrenchVoxels} />
    </group>
  );
}
