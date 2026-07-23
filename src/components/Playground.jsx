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
const CharacterNode = ({ type, position, rotation, onClick, children, footprints }) => {
  const [hovered, setHovered] = useState(false);
  const charRef = useRef();

  return (
    <group 
      position={position} 
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); if(onClick) onClick(); }}
    >
      {type === 'deer' && <VoxelDeer ref={charRef} ctaHover={hovered} />}
      {type === 'duck' && <VoxelDuck ref={charRef} ctaHover={hovered} />}
      {type === 'dino' && <VoxelDino ref={charRef} ctaHover={hovered} />}
      
      {/* HTML Tooltip Overlay */}
      {hovered && footprints.length > 0 && (
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#fff',
            minWidth: '200px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            transform: 'translateY(-10px)',
            animation: 'fadeInUp 0.2s ease-out forwards'
          }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>
              Recent Visitors
            </div>
            {footprints.slice(0, 3).map((fp, i) => (
              <div key={i} style={{ marginBottom: i === 2 ? 0 : '8px', borderBottom: i === 2 ? 'none' : '1px solid rgba(255,255,255,0.05)', paddingBottom: i === 2 ? 0 : '8px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{fp.name}</div>
                <div style={{ fontSize: '11px', color: '#ccc', marginTop: '2px' }}>{fp.desc}</div>
              </div>
            ))}
          </div>
        </Html>
      )}
    </group>
  );
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
      if (savedCount) return parseInt(savedCount, 10);
      const initial = Math.floor(Math.random() * 200) + 1480;
      localStorage.setItem('sauveer_playground_visitors', initial.toString());
      return initial;
    }
    return 1482;
  });

  // Form states
  const [formName, setFormName] = useState('');
  const [formChar, setFormChar] = useState(activeChar || 'deer');
  const [formDesc, setFormDesc] = useState('');

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

  const deerFootprints = visitorLogs.filter(l => l.char === 'deer');
  const duckFootprints = visitorLogs.filter(l => l.char === 'duck');
  const dinoFootprints = visitorLogs.filter(l => l.char === 'dino');

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
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            [ LABS ]
          </div>
        </div>

        {/* 3D Grassland Container */}
        <div style={{ 
          width: '100%', minHeight: '600px', background: '#0a1a0a', borderRadius: '24px', 
          border: '1.5px solid rgba(13, 13, 13, 0.08)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
        }}>
          
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '24px 32px', zIndex: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px',
            background: 'linear-gradient(to bottom, rgba(10,26,10,0.9) 0%, rgba(10,26,10,0) 100%)', color: '#fff'
          }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                GRASSLAND REGISTRY
              </span>
              <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                Leave a footprint.
              </p>
              <div style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                Hover over the characters to see who was here.
              </div>
            </div>
            
            {/* Form Overlay */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 20px',
              minWidth: '280px'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
                  <div style={{ fontWeight: 'bold' }}>Footprint recorded.</div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Thank you for visiting!</div>
                </div>
              ) : (
                <form onSubmit={handleSubmitEntry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['deer', 'duck', 'dino'].map(char => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => setFormChar(char)}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: '8px', cursor: 'pointer', fontSize: '18px',
                          background: formChar === char ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${formChar === char ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                          transition: 'all 0.2s'
                        }}
                      >
                        {char === 'deer' ? '🦌' : char === 'duck' ? '🦆' : '🦖'}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Leave a short thought..." 
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={2}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none' }}
                  />
                  <button 
                    type="submit"
                    style={{ background: '#fff', color: '#000', fontWeight: 'bold', padding: '10px', borderRadius: '8px', cursor: 'pointer', border: 'none', marginTop: '4px' }}
                  >
                    Submit Footprint
                  </button>
                </form>
              )}
            </div>
          </div>

          <div style={{ flex: 1, position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }}>
              <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
              <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI/2 - 0.1} autoRotate={true} autoRotateSpeed={0.5} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
              <pointLight position={[-2, 4, -2]} intensity={0.8} color="#88ccff" />
              <Environment preset="forest" />
              
              <Grassland />
              
              {/* Deer */}
              <CharacterNode 
                type="deer" 
                position={[-2.5, -0.6, 1]} 
                rotation={[0, 0.5, 0]} 
                footprints={deerFootprints} 
              />
              
              {/* Duck */}
              <CharacterNode 
                type="duck" 
                position={[0, -0.6, -1]} 
                rotation={[0, 0, 0]} 
                footprints={duckFootprints} 
              />
              
              {/* Dino */}
              <CharacterNode 
                type="dino" 
                position={[2.5, -0.6, 1.5]} 
                rotation={[0, -0.8, 0]} 
                footprints={dinoFootprints} 
              />
            </Canvas>
          </div>
        </div>

        {/* Embedded Section: Experiments Grid */}
        <div style={{ width: '100%', marginTop: '80px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '-0.02em', margin: '0 0 20px 0', borderBottom: '2px solid #0d0d0d', paddingBottom: '10px'
          }}>
            Experiments
          </h3>
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
