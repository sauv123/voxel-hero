import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import VoiceBot from './VoiceBot';
import ExperimentsGrid from './ExperimentsGrid';

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

  const [tapped, setTapped] = useState(false);
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
  const [activeLog, setActiveLog] = useState(null); // Click-to-find details state

  // Form states
  const [formName, setFormName] = useState('');
  const [formChar, setFormChar] = useState(activeChar);
  const [formDesc, setFormDesc] = useState('');

  const AGENT_ID = "dgr_hflRtbK_JgwuVXOFlJb7K2_Yr7ohkZlEGsxsPq5ZMpY";
  const API_KEY = "mps_sk_Wshrf3ZftiZqGQdt9FYttegz1IU7RRJz";

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

  const selectCharacter = (charKey) => {
    setFormChar(charKey);
    if (onSwitchChar) {
      onSwitchChar(charKey);
    }
  };

  // Submit traveler footprint form
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

    // Tap sparkles
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    for (let i = 0; i < 15; i++) {
      const spark = document.createElement('div');
      spark.className = 'sparkle-emoji';
      spark.innerHTML = formChar === 'duck' ? '🦆' : formChar === 'dino' ? '🦖' : '🦌';
      spark.style.position = 'fixed';
      spark.style.left = `${startX}px`;
      spark.style.top = `${startY}px`;
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '9999';
      spark.style.fontSize = `${Math.random() * 12 + 14}px`;
      document.body.appendChild(spark);

      gsap.to(spark, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `-=${Math.random() * 120 + 80}`,
        rotation: Math.random() * 360,
        opacity: 0,
        scale: 0.2,
        duration: 1.3,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#FCFAF2',
        zIndex: 100,
        color: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '40px 6vw'
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          [ PLAYGROUND &amp; TOYS ]
        </div>

      </div>

      {/* Main Grid Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', width: '100%', marginBottom: '60px' }}>
        
        {/* Left Column: Combined 3D Character Viewport + Character Selector + Tap Register Form (Minimal & Fun) */}
        <div style={{ 
          background: '#ffffff', borderRadius: '16px', border: '1.5px solid rgba(13, 13, 13, 0.08)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)', position: 'relative'
        }}>
          {/* 3D Viewport Wrapper */}
          <div style={{ 
            height: '240px', position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#FCFAF2'
          }}>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 18], fov: 40 }} gl={{ alpha: true }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2.5} />
              <Scene activeChar={activeChar} minimal={true} />
            </Canvas>
            
            {/* Small Quick Switch Button Toggle Row */}
            <div style={{ 
              position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: '4px',
              background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #0d0d0d',
              padding: '4px', borderRadius: '100px', backdropFilter: 'blur(4px)', zIndex: 15
            }}>
              {[
                { key: 'duck', icon: '🦆' },
                { key: 'dino', icon: '🦖' },
                { key: 'deer', icon: '🦌' }
              ].map((b) => (
                <button
                  key={b.key}
                  onClick={() => selectCharacter(b.key)}
                  style={{
                    background: activeChar === b.key ? '#0d0d0d' : 'transparent',
                    color: activeChar === b.key ? '#ffffff' : '#0d0d0d',
                    border: 'none', width: '28px', height: '28px', borderRadius: '50%',
                    cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'all 0.2s'
                  }}
                  title={`Switch to ${b.key}`}
                >
                  {b.icon}
                </button>
              ))}
            </div>

            <div style={{ position: 'absolute', top: 12, left: 12, fontSize: '9px', fontFamily: 'Space Mono, monospace', opacity: 0.4 }}>
              VOXEL RENDERER
            </div>
          </div>

          {/* Minimal & Interactive Visitor Card */}
          <div style={{ borderTop: '1px solid rgba(13, 13, 13, 0.08)', paddingTop: '20px' }}>
            
            {/* 1. Taps and Visitor count stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', opacity: 0.5, letterSpacing: '0.08em' }}>
                  TOTAL EXPLORERS
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  {visitorCount} Traveler Footprints
                </p>
              </div>

              {/* Tap triggering the inline entry form */}
              {!tapped && !submitted && (
                <button
                  onClick={() => setTapped(true)}
                  style={{
                    fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em',
                    padding: '10px 22px', borderRadius: '100px', border: '1.5px solid #0d0d0d',
                    backgroundColor: '#ffffff', color: '#0d0d0d', cursor: 'pointer',
                    boxShadow: '3px 3px 0px rgba(13,13,13,0.1)', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d0d0d';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#0d0d0d';
                  }}
                >
                  TAP
                </button>
              )}
            </div>

            {/* 2. Interactive Roll-out form once Tapped */}
            {tapped && !submitted && (
              <form onSubmit={handleSubmitEntry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    required
                    placeholder="State your name..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #0d0d0d',
                      fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none'
                    }}
                  />
                  
                  {/* Inline character indicator switch */}
                  <div style={{ display: 'flex', border: '1.5px solid #0d0d0d', borderRadius: '8px', overflow: 'hidden' }}>
                    {[
                      { key: 'duck', label: '🦆' },
                      { key: 'dino', label: '🦖' },
                      { key: 'deer', label: '🦌' }
                    ].map((btn) => (
                      <button
                        type="button"
                        key={btn.key}
                        onClick={() => setFormChar(btn.key)}
                        style={{
                          background: formChar === btn.key ? '#0d0d0d' : '#ffffff',
                          border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '12px',
                          borderRight: btn.key !== 'deer' ? '1px solid #0d0d0d' : 'none'
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="In one sentence, who are you?"
                  maxLength={75}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #0d0d0d',
                    fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none', width: '100%'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    alignSelf: 'flex-start', fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 900,
                    letterSpacing: '0.12em', padding: '10px 24px', borderRadius: '6px', border: '1.5px solid #0d0d0d',
                    background: '#0d0d0d', color: '#ffffff', cursor: 'pointer'
                  }}
                >
                  INTERACT &amp; SYNC
                </button>
              </form>
            )}

            {/* 3. Submitted State message */}
            {submitted && (
              <div style={{ 
                background: '#F3F4F6', padding: '12px 18px', borderRadius: '8px', border: '1px solid rgba(13,13,13,0.1)',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600
              }}>
                ✨ Your spark has been saved in the registry. Thank you traveler!
              </div>
            )}

          </div>

          {/* Visual Traveler logs representation (Fuzzy Radiating Grass Moss Globe) */}
          <div style={{ borderTop: '1px solid rgba(13, 13, 13, 0.08)', paddingTop: '20px' }}>
            <span style={{ fontSize: '9px', fontFamily: 'Space Mono, monospace', opacity: 0.5, display: 'block', marginBottom: '16px' }}>
              VOXEL MOSS GLOBE (CLICK CHARACTER TO QUERY REGISTRY)
            </span>

            {/* Radiating Grass / Moss Globe Layout */}
            <div style={{ 
              width: '100%', display: 'flex', justifyContent: 'center', 
              padding: '30px 0', overflow: 'visible', position: 'relative' 
            }}>
              
              {/* The Globe with outward radiating grass lines pattern */}
              <div style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%',
                // radial gradient simulating moss color changes growing outward
                background: 'radial-gradient(circle, #34D399 15%, #059669 50%, #064E3B 90%)',
                position: 'relative',
                border: '2px solid #0d0d0d',
                boxShadow: '0 12px 28px rgba(0,0,0,0.08), inset 0 -10px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                
                {/* Radiant grass blades background texture layer */}
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4 }}>
                  {[...Array(24)].map((_, i) => {
                    const angle = (i * 360) / 24;
                    return (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
                        stroke="#064E3B"
                        strokeWidth="1.5"
                        strokeDasharray="2 3"
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="38" stroke="#059669" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="22" stroke="#34D399" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </svg>

                {/* Plot Voxel Characters dynamically around the Moss Globe */}
                {visitorLogs.map((log, index) => {
                  const avatars = { duck: '🦆', dino: '🦖', deer: '🦌' };
                  const colors = { duck: '#FEF08A', dino: '#BFDBFE', deer: '#A7F3D0' };
                  const total = visitorLogs.length;
                  
                  // Spread characters in a circle around the center of the globe
                  const radius = 64; // placement distance from center
                  const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  const isSelected = activeLog === log;

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveLog(isSelected ? null : log)}
                      style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: colors[log.char] || '#e5e7eb',
                        border: '2px solid #0d0d0d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 12px #ffffff' : '0 4px 8px rgba(0,0,0,0.15)',
                        transform: isSelected ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%) scale(1)',
                        zIndex: isSelected ? 30 : 10,
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      title={`Click for ${log.name}'s coordinates`}
                    >
                      {avatars[log.char]}
                    </button>
                  );
                })}
              </div>

              {/* Tooltip detail card displayed on click */}
              {activeLog && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                  width: '280px', background: '#0d0d0d', color: '#ffffff', padding: '12px 16px',
                  borderRadius: '6px', zIndex: 50, border: '1.5px solid #0d0d0d',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)', animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900 }}>{activeLog.name} ({activeLog.char.toUpperCase()})</span>
                    <button 
                      onClick={() => setActiveLog(null)}
                      style={{ background: 'none', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', padding: 0 }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontFamily: 'var(--font-body)', opacity: 0.9, lineHeight: 1.3 }}>
                    "{activeLog.desc}"
                  </p>
                  <div style={{ fontSize: '9px', fontFamily: 'Space Mono, monospace', opacity: 0.5, textAlign: 'right' }}>
                    {activeLog.time}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Voice Bot Panel */}
        <div style={{ 
          background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1.5px solid rgba(13, 13, 13, 0.08)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '-0.02em', margin: '0 0 16px 0', lineHeight: 1.1
          }}>
            Dograh Voice AI
          </h2>
          <VoiceBot agentId={AGENT_ID} apiKey={API_KEY} theme={theme} />
        </div>

      </div>

      {/* Embedded Section: Experiments Grid (Bypassing ScrollTrigger logic) */}
      <div style={{ width: '100%' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '-0.02em', margin: '0 0 20px 0', borderBottom: '2px solid #0d0d0d', paddingBottom: '10px'
        }}>
          Experiments Cabinet
        </h3>
        <ExperimentsGrid theme={theme} disableScrollTrigger={true} />
      </div>

      {/* CSS Keyframes for smooth fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (max-width: 900px) {
          div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
