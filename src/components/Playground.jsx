import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import VoiceBot from './VoiceBot';
import ExperimentsGrid from './ExperimentsGrid';
import Footer from './Footer';

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

  // Generate random static positions for the initial visitor logs so they don't jump around on re-renders
  const [visitorPositions] = useState(() => {
    return Array(50).fill(0).map(() => ({
      top: `${10 + Math.random() * 80}%`, // 10% to 90%
      left: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 2 // animation stagger
    }));
  });

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
      {/* Padded Content Wrapper */}
      <div style={{ padding: '40px 6vw', flex: 1 }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            [ PLAYGROUND ]
          </div>
        </div>

        {/* The New Interactive Avatar Board (Full Width) */}
        <div style={{ 
          width: '100%', minHeight: '600px', background: '#ffffff', borderRadius: '24px', 
          border: '1.5px solid rgba(13, 13, 13, 0.08)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column'
        }}>
          
          {/* Subtle Grid Background */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />

          {/* Interactive Tap Board Header / Stats */}
          <div style={{ 
            padding: '24px 32px', borderBottom: '1px solid rgba(13, 13, 13, 0.08)', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', zIndex: 10,
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)'
          }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', opacity: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                EXPLORATION REGISTRY
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
                LEAVE FOOTPRINT
              </button>
            )}

            {/* 2. Interactive Roll-out form once Tapped */}
            {tapped && !submitted && (
              <form onSubmit={handleSubmitEntry} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text" required placeholder="Name" value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #0d0d0d',
                    fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none', width: '120px'
                  }}
                />
                
                {/* Inline character indicator switch */}
                <div style={{ display: 'flex', border: '1.5px solid #0d0d0d', borderRadius: '8px', overflow: 'hidden' }}>
                  {[{ key: 'duck', label: '🦆' }, { key: 'dino', label: '🦖' }, { key: 'deer', label: '🦌' }].map((btn) => (
                    <button
                      type="button" key={btn.key} onClick={() => selectCharacter(btn.key)}
                      style={{
                        background: formChar === btn.key ? '#0d0d0d' : '#ffffff',
                        border: 'none', padding: '6px 10px', cursor: 'pointer', fontSize: '12px',
                        borderRight: btn.key !== 'deer' ? '1px solid #0d0d0d' : 'none'
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text" required placeholder="A short thought..." maxLength={75} value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #0d0d0d',
                    fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none', width: '200px'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', 
                    padding: '8px 16px', borderRadius: '6px', border: '1.5px solid #0d0d0d',
                    background: '#0d0d0d', color: '#ffffff', cursor: 'pointer'
                  }}
                >
                  SYNC
                </button>
              </form>
            )}

            {/* 3. Submitted State message */}
            {submitted && (
              <div style={{ 
                background: '#F3F4F6', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(13,13,13,0.1)',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600
              }}>
                ✨ Spark saved! Look for it around the board.
              </div>
            )}
          </div>

          {/* Scattered Avatars Container */}
          <div style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
            
            {visitorLogs.map((log, index) => {
              const avatars = { duck: '🦆', dino: '🦖', deer: '🦌' };
              const colors = { duck: '#FEF08A', dino: '#BFDBFE', deer: '#A7F3D0' };
              const isSelected = activeLog === log;
              const pos = visitorPositions[index % visitorPositions.length];

              return (
                <div key={index} style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  animation: `floatAvatar 4s ease-in-out infinite alternate ${pos.delay}s`,
                  zIndex: isSelected ? 50 : 10
                }}>
                  <button
                    onClick={() => setActiveLog(isSelected ? null : log)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: colors[log.char] || '#e5e7eb',
                      border: '2px solid #0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 0 4px rgba(13,13,13,0.1)' : '0 4px 12px rgba(0,0,0,0.1)',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    title={`Click to read ${log.name}'s footprint`}
                  >
                    {avatars[log.char]}
                  </button>

                  {/* Tooltip Popup */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                      width: '260px', background: '#0d0d0d', color: '#ffffff', padding: '16px',
                      borderRadius: '12px', zIndex: 60, border: '1.5px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease-out'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 900 }}>{log.name}</span>
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>{log.time}</span>
                      </div>
                      <p style={{ margin: '0', fontSize: '13px', fontFamily: 'var(--font-body)', opacity: 0.9, lineHeight: 1.4 }}>
                        "{log.desc}"
                      </p>
                      
                      {/* Triangle pointer */}
                      <div style={{
                        position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                        width: '12px', height: '12px', background: '#0d0d0d', borderBottom: '1.5px solid rgba(255,255,255,0.1)',
                        borderRight: '1.5px solid rgba(255,255,255,0.1)'
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      {/* Embedded Section: Experiments Grid (Bypassing ScrollTrigger logic) */}
      <div style={{ width: '100%', marginTop: '80px' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '-0.02em', margin: '0 0 20px 0', borderBottom: '2px solid #0d0d0d', paddingBottom: '10px'
        }}>
          Experiments Cabinet
        </h3>
        <ExperimentsGrid theme={theme} disableScrollTrigger={true} />
      </div>
      </div>

      {/* CSS Keyframes for smooth fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes floatAvatar {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(-5deg); }
        }
        @media (max-width: 900px) {
          div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      
      {/* Global Footer */}
      <div style={{ marginTop: '80px' }}>
        <Footer theme={theme} activeChar={activeChar} />
      </div>
    </div>
  );
}
