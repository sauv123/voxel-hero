import React, { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VS = 0.2;

const P = {
  BROWN:  '#7A4A28',
  LIGHT:  '#925930',
  TAN:    '#E6C8A6',
  DARK:   '#3a2818',
  WHITE:  '#AAAAAA',
  BLACK:  '#111111',
};

const fill = (arr, x1, x2, y1, y2, z1, z2, color) => {
  for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
  for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
  for (let z = Math.min(z1,z2); z <= Math.max(z1,z2); z++)
    arr.push([x, y, z, color]);
};

const buildBody = () => {
  const v = [];
  fill(v, -6,5, 0,4, -2,2, P.BROWN);
  fill(v,  2,4, -4,-1, -2,-1, P.BROWN);
  fill(v,  2,4, -4,-1,  1, 2, P.BROWN);
  fill(v, -5,-3, -4,-1, -2,-1, P.BROWN);
  fill(v, -5,-3, -4,-1,  1, 2, P.BROWN);
  fill(v,  2,4, -5,-5, -2,-1, P.DARK);
  fill(v,  2,4, -5,-5,  1, 2, P.DARK);
  fill(v, -5,-3, -5,-5, -2,-1, P.DARK);
  fill(v, -5,-3, -5,-5,  1, 2, P.DARK);
  fill(v,  4, 6, 4,7, -1,1, P.BROWN);
  fill(v, -7,-6, 3,4,  0,0, P.WHITE);
  return v;
};

const buildHead = () => {
  const v = [];
  fill(v, -2,2, -2,2, -2,2, P.BROWN);
  fill(v,  3,5, -2,0, -1,1, P.LIGHT);
  fill(v,  6,6, -1,-1, 0,0, P.DARK);
  // Ears
  fill(v, -2,-1, 2,4, -4,-3, P.BROWN);
  fill(v, -2,-1, 2,4,  3, 4, P.BROWN);
  // Antlers
  fill(v,  0,1, 3,7, -2,-2, P.TAN);
  fill(v,  0,1, 3,7,  2, 2, P.TAN);
  fill(v,  1,2, 5,6, -3,-2, P.TAN);
  fill(v,  1,2, 5,6,  2, 3, P.TAN);
  fill(v, -1,0, 6,9, -2,-2, P.TAN);
  fill(v, -1,0, 6,9,  2, 2, P.TAN);
  // Eye whites
  fill(v,  1,1, 1,1, -2,-2, P.WHITE);
  fill(v,  1,1, 1,1,  2, 2, P.WHITE);
  return v;
};

const buildPupils = () => {
  const v = [];
  fill(v, 2,2, 1,1, -2,-2, P.BLACK);
  fill(v, 2,2, 1,1,  2, 2, P.BLACK);
  return v;
};

const bodyVoxels = buildBody();
const headVoxels = buildHead();
const pupilVoxels = buildPupils();

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
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0.05} />
    </instancedMesh>
  );
}

const VoxelDeer = forwardRef(({ ctaHover = false }, ref) => {
  const groupRef = useRef();
  const headRef  = useRef();
  const pupilRef = useRef();
  const bobTime  = useRef(0);
  const hopVel   = useRef(0);
  const hopPos   = useRef(0);
  const yayTime  = useRef(0); // countdown for rapid yay hops

  useImperativeHandle(ref, () => ({
    hop() { hopVel.current = 0.18; },
    yay() { yayTime.current = 1.8; } // trigger rapid triple-bounce
  }));

  useFrame((state, delta) => {
    const mouse = state.mouse;
    bobTime.current += delta;

    // yay rapid hop sequence
    if (yayTime.current > 0) {
      yayTime.current -= delta;
      if (hopPos.current <= 0 && hopVel.current <= 0) hopVel.current = 0.22;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(bobTime.current * 1.9) * 0.11;
      if (ctaHover) {
        // excited nodding instead of z-wiggle
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.x = Math.sin(bobTime.current * 7) * 0.14;
        groupRef.current.rotation.y += (0.0 - groupRef.current.rotation.y) * 0.1;
      } else {
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1;
        // inverted: mouse right → character turns right (natural follow)
        groupRef.current.rotation.y += (mouse.x * 0.22 - groupRef.current.rotation.y) * 0.08;
      }
    }

    hopPos.current += hopVel.current;
    hopVel.current -= 0.012;
    if (hopPos.current < 0) { hopPos.current = 0; hopVel.current = 0; }
    if (groupRef.current) groupRef.current.position.y += hopPos.current;

    if (headRef.current) {
      const isAndroidMobile = typeof window !== 'undefined' && (/Android/i.test(window.navigator.userAgent) || window.innerWidth < 768);
      const targetY = ctaHover ? 0.0 : (isAndroidMobile ? 0.0 : mouse.x * 1.2);
      const targetZ = ctaHover ? -0.5 : (isAndroidMobile ? -0.8 : mouse.y * 1.2);
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.z += (targetZ - headRef.current.rotation.z) * 0.1;
    }

    if (pupilRef.current) {
      const isAndroidMobile = typeof window !== 'undefined' && (/Android/i.test(window.navigator.userAgent) || window.innerWidth < 768);
      pupilRef.current.position.x = isAndroidMobile ? 0.0 : mouse.x * 0.04;
      pupilRef.current.position.y = isAndroidMobile ? -0.08 : mouse.y * 0.04;
    }


  });

  return (
    <group ref={groupRef}>
      <VoxelPart voxels={bodyVoxels} position={[-0.5, 1, 0]} />
      <group position={[1.2, 2.6, 0]}>
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

export default VoxelDeer;
