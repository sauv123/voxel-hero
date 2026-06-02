import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function PlaygroundGallery({ onClose, theme, activeChar }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, scale: 1.05, duration: 0.3, ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: theme.bg,
        zIndex: 9999,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 40, right: 40,
          width: 50, height: 50, borderRadius: '50%',
          background: theme.text, color: theme.bg,
          border: 'none', fontSize: 24, cursor: 'pointer',
          zIndex: 10
        }}
      >✕</button>

      <div style={{ width: '100%', height: '50vh', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, animation: 'spin 8s linear infinite' }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 18], fov: 40 }} gl={{ alpha: true }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <directionalLight position={[-10, 10, -5]} intensity={1} />
            <Scene activeChar={activeChar} minimal={true} />
          </Canvas>
        </div>
      </div>
      
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(3rem, 10vw, 8rem)',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1
      }}>
        Coming Soon
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.2rem',
        opacity: 0.6,
        marginTop: '20px'
      }}>
        Under Construction
      </p>
    </div>
  );
}
