import React, { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VS = 0.22; // voxel size

const P = {
  YELLOW:       '#FFD700',
  YELLOW_DARK:  '#E6A800',
  ORANGE:       '#E8651A',
  ORANGE_DARK:  '#C44A00',
  BLUE:         '#2A4FAB',
  WHITE:        '#FFFFFF',
  BLACK:        '#111111',
};

const fill = (arr, x1, x2, y1, y2, z1, z2, color) => {
  for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
  for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
  for (let z = Math.min(z1,z2); z <= Math.max(z1,z2); z++)
    arr.push([x, y, z, color]);
};

const buildDuckBody = () => {
  const v = [];
  // Big round body
  fill(v, -3,3, 0,4, -3,3, P.YELLOW);
  // Wing bumps
  fill(v, -4,-4, 1,3, -2,2, P.YELLOW_DARK);
  fill(v,  4, 4, 1,3, -2,2, P.YELLOW_DARK);
  // Legs
  fill(v, -1,0, -3,-1, -1,1, P.ORANGE);
  fill(v,  1,2, -3,-1, -1,1, P.ORANGE);
  // Feet
  fill(v, -2,1, -4,-4, -2,2, P.ORANGE_DARK);
  fill(v,  0,3, -4,-4, -2,2, P.ORANGE_DARK);
  // Small tail up top
  fill(v, 3,4, 3,5, 0,1, P.YELLOW);
  return v;
};

const buildDuckHead = () => {
  const v = [];
  // Head cube
  fill(v, -3,3, -3,3, -3,3, P.YELLOW);
  // Beak
  fill(v, 4,6, -1,1, -1,1, P.ORANGE);
  fill(v, 4,5, -2,0, -1,1, P.ORANGE_DARK);
  // Eye whites (left & right)
  fill(v, 3,3, 1,2, -3,-2, P.BLUE);
  fill(v, 3,3, 1,2,  2, 3, P.BLUE);
  return v;
};

// Eyes tracked separately (pupils on head surface)
const buildDuckPupils = () => {
  const v = [];
  fill(v, 4,4, 1,2, -3,-2, P.BLACK);
  fill(v, 4,4, 1,2,  2, 3, P.BLACK);
  return v;
};

const bodyVoxels = buildDuckBody();
const headVoxels = buildDuckHead();
const pupilVoxels = buildDuckPupils();

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

const VoxelDuck = forwardRef(({ ctaHover = false }, ref) => {
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
      groupRef.current.position.y = Math.sin(bobTime.current * 2.2) * 0.12;
      if (ctaHover) {
        groupRef.current.rotation.z = Math.sin(bobTime.current * 14) * 0.1;
        groupRef.current.rotation.y += (0.0 - groupRef.current.rotation.y) * 0.1;
      } else {
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y += (-mouse.x * 0.25 - groupRef.current.rotation.y) * 0.08;
      }
    }

    hopPos.current += hopVel.current;
    hopVel.current -= 0.012;
    if (hopPos.current < 0) { hopPos.current = 0; hopVel.current = 0; }
    if (groupRef.current) groupRef.current.position.y += hopPos.current;

    if (headRef.current) {
      const targetY = ctaHover ? 0.0 : -mouse.x * 1.4;
      const targetZ = ctaHover ? -0.5 : -mouse.y * 1.4;
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.z += (targetZ - headRef.current.rotation.z) * 0.1;
    }

    if (pupilRef.current) {
      pupilRef.current.position.x = mouse.x * 0.04;
      pupilRef.current.position.y = mouse.y * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <VoxelPart voxels={bodyVoxels} position={[0, 0, 0]} />
      <group position={[0, VS * 5.5, 0]}>
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

export default VoxelDuck;
