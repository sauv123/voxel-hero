import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function NotFound({ theme, activeChar, navigateWithTransition }) {
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [jumps, setJumps] = useState(0);
  
  const handleJump = () => {
    if (!canvasContainerRef.current) return;
    
    // Animate jump up and down, and a 360 spin
    gsap.to(canvasContainerRef.current, {
      y: -100,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.set(canvasContainerRef.current, { y: 0 });
      }
    });

    gsap.to(canvasContainerRef.current, {
      rotateY: "+=360",
      duration: 0.6,
      ease: "power1.inOut"
    });

    setJumps(j => j + 1);
  };

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );
    
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: theme.bg,
        zIndex: 99999,
        color: theme.text,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}
      onClick={handleJump}
    >
      <div className="noise-overlay" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05 + (jumps * 0.01), mixBlendMode: 'overlay', zIndex: 0
      }} />

      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(8rem, 25vw, 20rem)',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '-0.05em',
        textAlign: 'center',
        margin: 0,
        lineHeight: 0.8,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.text, 
        opacity: 0.05,
        zIndex: 1,
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}>
        404
      </h1>

      <div style={{ position: 'absolute', top: 30, right: 30, fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, zIndex: 10 }}>
        JUMPS: {jumps}
      </div>

      <div style={{ width: '100%', height: '50vh', position: 'relative', zIndex: 2 }} ref={canvasContainerRef}>
        <div style={{ position: 'absolute', inset: 0, animation: 'spin 12s linear infinite' }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 18], fov: 40 }} gl={{ alpha: true }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <directionalLight position={[-10, 10, -5]} intensity={1} />
            <Scene activeChar={activeChar} minimal={true} />
          </Canvas>
        </div>
      </div>
      
      <div style={{ zIndex: 3, textAlign: 'center', marginTop: '-20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          margin: '0 0 16px 0',
          color: theme.text
        }}>
          Lost in the void
        </h2>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.2rem',
          color: theme.text,
          opacity: 0.8,
          maxWidth: '400px',
          margin: '0 auto 40px auto'
        }}>
          Click or hit Space to jump. The more you jump, the weirder it gets.
        </p>

        <button 
          onClick={(e) => { e.stopPropagation(); navigateWithTransition('home'); }}
          className="brutal-nav-link"
          style={{
            background: 'transparent',
            border: `2px solid ${theme.text}`,
            color: theme.text,
            padding: '16px 40px',
            fontFamily: 'var(--font-heading)',
            fontSize: 20, fontWeight: 900,
            textTransform: 'uppercase', cursor: 'pointer',
            borderRadius: 4
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.text; e.currentTarget.style.color = theme.bg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.text; }}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
