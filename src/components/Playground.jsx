import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Grassland from './Grassland';
import VoxelDeer from './VoxelDeer';
import VoxelDuck from './VoxelDuck';
import VoxelDino from './VoxelDino';
import ExperimentsGrid from './ExperimentsGrid';
import Footer from './Footer';

// Internal Character wrapper to handle hovers
const CharacterNode = ({ log, position, rotation }) => {
  const [hovered, setHovered] = useState(false);
  const charRef = useRef();

  return (
    <group 
      position={position} 
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {log.char === 'deer' && <VoxelDeer ref={charRef} ctaHover={hovered} />}
      {log.char === 'duck' && <VoxelDuck ref={charRef} ctaHover={hovered} />}
      {log.char === 'dino' && <VoxelDino ref={charRef} ctaHover={hovered} />}
      
      {/* HTML Tooltip Overlay */}
      {hovered && (
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '16px',
            borderRadius: '4px',
            color: '#0d0d0d',
            minWidth: '220px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transform: 'translateY(-10px)',
            animation: 'fadeInUp 0.2s ease-out forwards',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                {log.name}
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'Space Mono, monospace', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginLeft: '12px' }}>
                {log.time}
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const seededRandom = (seed) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export default function PlaygroundGallery({ onClose, theme, activeChar, onSwitchChar }) {
  const containerRef = useRef(null);

  // Visitor logs state
  const [visitorLogs, setVisitorLogs] = useState(() => {
    const defaultLogs = [
      { name: 'Sauveer', char: 'dino', desc: 'Building the next generation of voxel portals.', time: '2 mins ago' },
      { name: 'Aria', char: 'duck', desc: 'Creative technologist chasing pixel shader math.', time: '2 hrs ago' },
      { name: 'Kenji', char: 'deer', desc: 'Sound artist capturing forest field recordings.', time: '5 hrs ago' },
      { name: 'Elena', char: 'dino', desc: 'Illustrator sketching isometric micro-worlds.', time: '1 day ago' },
      { name: 'Tariq', char: 'duck', desc: 'UX researcher analyzing spatial focus zones.', time: '2 days ago' }
    ];
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem('sauveer_playground_logs');
      if (savedLogs) return JSON.parse(savedLogs);
    }
    return defaultLogs;
  });

  const [submitted, setSubmitted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sauveer_playground_submitted') === 'true';
    }
    return false;
  });
  
  const [visitorCount, setVisitorCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem('sauveer_playground_visitors');
      if (savedCount && parseInt(savedCount, 10) < 1000) return parseInt(savedCount, 10);
      const initial = 682;
      localStorage.setItem('sauveer_playground_visitors', initial.toString());
      return initial;
    }
    return 682;
  });

  // Form states
  const [formName, setFormName] = useState('');
  const [formChar, setFormChar] = useState(activeChar || 'deer');
  const [formDesc, setFormDesc] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, scale: 1.05, duration: 0.4, ease: 'power2.in',
      onComplete: onClose
    });
  };

  const handleSubmitEntry = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim()) return;

    const newLog = {
      name: formName.trim(),
      char: formChar,
      desc: formDesc.trim(),
      time: 'Just now'
    };

    const updatedLogs = [newLog, ...visitorLogs];
    setVisitorLogs(updatedLogs);
    localStorage.setItem('sauveer_playground_logs', JSON.stringify(updatedLogs));

    const newCount = visitorCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('sauveer_playground_visitors', newCount.toString());

    setSubmitted(true);
    localStorage.setItem('sauveer_playground_submitted', 'true');
  };



  return (
    <div 
      ref={containerRef}
      className="scroll-container"
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 180,
        backgroundColor: '#FCFAF2',
        color: '#0d0d0d',
        overflowX: "hidden",
        overflowY: "auto",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: '40px 6vw', flex: 1, position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
          <h2 className="section-header" style={{ color: '#0d0d0d' }}>
            Labs & Exploration
          </h2>
        </div>

        {/* 3D Grassland Container */}
        <div style={{ 
          width: '100%', minHeight: '600px', background: 'transparent', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          
          {/* Canvas Background */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <Canvas shadows dpr={[1, 2]} gl={{ alpha: true }}>
              <fog attach="fog" args={['#FCFAF2', 5, 20]} />
              <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
              <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI/2 - 0.1} autoRotate={false} />
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} color="#ffffff" />
              <pointLight position={[-2, 4, -2]} intensity={0.5} color="#88ccff" />
              
              <Grassland />
              
              {/* Dynamic Footprints (Limit to 10 to prevent OOM crash) */}
              {visitorLogs.slice(0, 10).map((log, i) => {
                const angle = seededRandom(i * 123) * Math.PI * 2;
                const radius = 2 + seededRandom(i * 321) * 20; 
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const rotation = [0, seededRandom(i * 555) * Math.PI * 2, 0];
                return (
                  <CharacterNode 
                    key={i}
                    log={log}
                    position={[x, -0.6, z]} 
                    rotation={rotation} 
                  />
                );
              })}
            </Canvas>
          </div>

          {/* UI Overlay */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '24px 32px', zIndex: 10,
            display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', pointerEvents: 'none'
          }}>
            {/* Form Overlay */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '24px',
              minWidth: '280px', pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              color: '#0d0d0d',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  {visitorCount.toLocaleString()}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Visitors checked in
                </span>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>Footprint recorded.</div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>Thank you for visiting!</div>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setIsFormExpanded(true);
                      setFormName('');
                      setFormDesc('');
                    }}
                    style={{ background: '#000000', color: '#ffffff', fontWeight: 900, fontFamily: 'var(--font-heading)', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}
                  >
                    Leave another
                  </button>
                </div>
              ) : (
                <>
                  {!isFormExpanded ? (
                    <button 
                      onClick={() => setIsFormExpanded(true)}
                      style={{ background: '#000000', color: '#ffffff', fontWeight: 900, fontFamily: 'var(--font-heading)', padding: '12px', borderRadius: '4px', cursor: 'pointer', border: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', width: '100%' }}
                    >
                      Leave a Footprint
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeInUp 0.3s ease-out' }}>
                      
                      <div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 800 }}>Who are you?</div>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                          style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', color: '#0d0d0d', padding: '10px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-body)', outline: 'none', width: '100%' }}
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 800 }}>Your character will visually capture this personality:</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {['deer', 'duck', 'dino'].map(char => (
                            <button
                              key={char}
                              type="button"
                              onClick={() => setFormChar(char)}
                              style={{
                                flex: 1, padding: '12px 0', borderRadius: '4px', cursor: 'pointer', fontSize: '20px',
                                background: formChar === char ? '#000000' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${formChar === char ? '#000' : 'rgba(0,0,0,0.05)'}`,
                                transition: 'all 0.2s',
                                color: formChar === char ? '#fff' : '#000'
                              }}
                            >
                              {char === 'deer' ? '🦌' : char === 'duck' ? '🦆' : '🦖'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        placeholder="Leave a short thought..." 
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        rows={2}
                        required
                        style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', color: '#0d0d0d', padding: '10px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-body)', outline: 'none', resize: 'none', width: '100%' }}
                      />
                      
                      <button 
                        type="submit"
                        style={{ background: '#000000', color: '#ffffff', fontWeight: 900, fontFamily: 'var(--font-heading)', padding: '12px', borderRadius: '4px', cursor: 'pointer', border: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}
                      >
                        Submit ↗
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Section: Experiments Grid */}
        <div style={{ width: '100%', marginTop: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
            <h2 className="section-header" style={{ color: '#0d0d0d' }}>
              Selected Experiments
            </h2>
          </div>
          <ExperimentsGrid theme={theme} disableScrollTrigger={true} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(0px); }
          to { opacity: 1; transform: translateY(-10px); }
        }
      `}</style>
      
      {/* Global Footer */}
      <div style={{ marginTop: '80px' }}>
        <Footer theme={theme} activeChar={activeChar} />
      </div>
    </div>
  );
}
