import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import VoiceBot from './VoiceBot';
import ExperimentsGrid from './ExperimentsGrid';
import Footer from './Footer';

export default function PlaygroundGallery({ onClose, theme, activeChar, onSwitchChar }) {
  const InteractiveCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let particles = [];

      const resize = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const colors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#c084fc'];

      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 15 + 5;
          this.speedX = Math.random() * 6 - 3;
          this.speedY = Math.random() * 6 - 3;
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.life = 1.0;
          this.decay = Math.random() * 0.02 + 0.01;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.life -= this.decay;
          this.size *= 0.96;
        }
        draw() {
          ctx.globalAlpha = Math.max(0, this.life);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(x, y));
        }
      };

      const handleClick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(x, y));
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(x, y));
        }
      }, {passive: true});

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        particles = particles.filter(p => p.life > 0 && p.size > 0.5);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
        cancelAnimationFrame(animationFrameId);
      };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />;
  };
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
      <div style={{ padding: '40px 6vw', flex: 1, position: 'relative' }}>
        
        {/* Top Header Row with Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <button 
            onClick={handleClose}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#0d0d0d'
            }}
          >
            ← Back to Home
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            [ PLAYGROUND ]
          </div>
        </div>

        {/* The New Interactive Avatar Board (Full Width) */}
        <div style={{ 
          width: '100%', minHeight: '600px', background: '#0d0d0d', borderRadius: '24px', 
          border: '1.5px solid rgba(13, 13, 13, 0.08)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column'
        }}>
          
          {/* Subtle Grid Background */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />

          {/* Interactive Tap Board Header / Stats */}
          <div style={{ 
            padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', zIndex: 10,
            background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(10px)', color: '#fff'
          }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', opacity: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                DIGITAL SANDBOX
              </span>
              <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                Leave a trace.
              </p>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.5, fontFamily: 'var(--font-body)' }}>
              Click or drag to interact
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
            <InteractiveCanvas />
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
