import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './OriginalTextLabShowcase.css';

export const TEXT_PROJECTS = [
  {
    id: '01',
    key: 'lemon',
    title: 'LEMON NOTES',
    subtitle: 'Tactile, distraction-free note-taking workspace designed for deep focus.',
    tags: ['React', 'Local-First', 'Tactile UI'],
    link: null,
    experimentId: 101, // Custom context
    description: 'Lemon Notes is a minimalist, local-first markdown note-taking app that treats text like architecture. It eliminates sidebars and complex controls in favor of fluid typography and instant tactile feedback.',
    whoItsFor: 'Writers, researchers, and designers who want an aesthetic space to write without UI clutter.',
    problem: 'Modern note apps are bloated with database properties, sync delays, and multi-pane clutter that break creative flow.',
    goal: 'Create an ultra-responsive, distraction-free writing environment that opens instantly and feels like premium physical paper.',
    coreFeatures: [
      'Instant Type Mode: Zero setup needed, start writing immediately.',
      'Tactile Haptics: Subtle audio and micro-animations for keypresses.',
      'Local-First Encryption: Notes stay stored 100% on device.',
      'Editorial Export: One-click export to clean Markdown, HTML, or PDF.'
    ]
  },
  {
    id: '02',
    key: 'blockchain',
    title: 'THE BLOCKCHAIN MOSAIC',
    subtitle: 'Real-time Ethereum block matrix and WebAudio sonification engine.',
    tags: ['Web3', 'WebAudio API', 'Canvas 2D'],
    link: 'https://mosaichain.netlify.app',
    liveCta: '⚡ LAUNCH LIVE MOSAIC',
    experimentId: 14,
    description: 'A live, generative art painting and audio engine that visualizes real-time Ethereum blockchain transaction patterns, block congestion, and whale alerts.',
    whoItsFor: 'Web3 builders, crypto collectors, and digital galleries looking for the live pulse of decentralized finance.',
    problem: 'Blockchain transactions are invisible data hashes on Etherscan rather than visual, sensory experiences.',
    goal: 'Map raw block data to visual saturation and physical WebAudio string plucks (Karplus-Strong).',
    coreFeatures: [
      'Generative Block Matrix: Color-coded transaction tiles.',
      'Live WebAudio Sonification: String plucks and 808 kicks triggered per transaction.',
      'Whale Movement Alert: Visual glow on large transfers.'
    ]
  },
  {
    id: '03',
    key: 'social_battery',
    title: 'SOCIAL BATTERY APP',
    subtitle: 'Spatial focus meter and emotional energy tracking interface.',
    tags: ['UX System', 'Micro-Interactions', 'GSAP Physics'],
    link: null,
    experimentId: 102,
    description: 'An intuitive emotional health and social capacity tracking widget. Designed to help introverts and creative workers manage daily energy boundaries with visual clarity.',
    whoItsFor: 'Introverts, high-output creatives, and remote teams managing burnout and focus boundaries.',
    problem: 'Traditional productivity apps ignore personal energy levels, treating human capacity like an endless conveyor belt.',
    goal: 'Provide a quick, visual 5-second check-in widget that visually communicates current battery levels and suggests optimal focus modes.',
    coreFeatures: [
      'Fluid Battery Charge Gauge: Dynamic drag-to-set energy level.',
      'Focus Boundary Signals: Auto-set Slack status based on battery level.',
      'Daily Energy Wave: Visual chart tracking weekly drain vs recovery patterns.'
    ]
  },
  {
    id: '04',
    key: 'orion',
    title: 'ORION AI ASSISTANT',
    subtitle: 'Native macOS desktop voice assistant with Three.js particle orb.',
    tags: ['Python', 'Three.js', 'Groq Llama-3'],
    link: null,
    experimentId: 9,
    description: 'A lightweight, ultra-fast native macOS AI voice assistant built with a pure Python backend and interactive 3D particle orb.',
    whoItsFor: 'Power users looking for sub-second desktop voice automation without heavy Electron overhead.',
    problem: 'Existing AI voice tools suffer from latency, browser tabs, or bloated resource usage.',
    goal: 'Sub-second response latency with native AppleScript OS hardware integration.',
    coreFeatures: [
      '3D Particle Orb: Real-time audio-reactive particle sphere.',
      'macOS System Control: Adjust brightness, launch apps, manage files via speech.',
      'Resilient Tool Parsing: Regex-backed JSON recovery for 100% reliable execution.'
    ]
  }
];

export default function TextLabShowcase({ theme, onSelectProject }) {
  const containerRef = useRef(null);
  const cardPreviewRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [typedNoteText, setTypedNoteText] = useState('• Focus on intent, eliminate noise...');
  const [batteryPercent, setBatteryPercent] = useState(78);
  const [blockCount, setBlockCount] = useState(19482014);

  // QuickSetters for smooth 60fps floating card tracking
  const xSetter = useRef(null);
  const ySetter = useRef(null);

  useEffect(() => {
    if (cardPreviewRef.current) {
      xSetter.current = gsap.quickSetter(cardPreviewRef.current, "x", "px");
      ySetter.current = gsap.quickSetter(cardPreviewRef.current, "y", "px");
    }

    const handleMouseMove = (e) => {
      if (containerRef.current && cardPreviewRef.current && activeProject) {
        const bounds = containerRef.current.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        if (xSetter.current && ySetter.current) {
          xSetter.current(x);
          ySetter.current(y);
        }

        // Slight 3D tilt based on mouse position inside container
        const tiltX = ((y / bounds.height) - 0.5) * 12;
        const tiltY = ((x / bounds.width) - 0.5) * -12;

        gsap.to(cardPreviewRef.current, {
          rotateX: tiltX,
          rotateY: tiltY,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeProject]);

  // Live dynamic timers for interactive previews
  useEffect(() => {
    if (!activeProject) return;

    let interval;
    if (activeProject.key === 'lemon') {
      const phrases = [
        "• Focus on intent, eliminate noise...",
        "• High-impact typography & spatial flow.",
        "• Distraction-free editorial space.",
        "• Instant local-first markdown sync."
      ];
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % phrases.length;
        setTypedNoteText(phrases[idx]);
      }, 2200);
    } else if (activeProject.key === 'blockchain') {
      interval = setInterval(() => {
        setBlockCount(prev => prev + 1);
      }, 1800);
    } else if (activeProject.key === 'social_battery') {
      interval = setInterval(() => {
        setBatteryPercent(prev => (prev >= 95 ? 45 : prev + 11));
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeProject]);

  const handleMouseEnterRow = (proj) => {
    setActiveProject(proj);
    if (cardPreviewRef.current) {
      gsap.fromTo(cardPreviewRef.current, 
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
      );
    }
  };

  const handleMouseLeaveRow = () => {
    if (cardPreviewRef.current) {
      gsap.to(cardPreviewRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setActiveProject(null)
      });
    } else {
      setActiveProject(null);
    }
  };

  return (
    <div className="text-lab-showcase-container" ref={containerRef}>
      <div className="text-lab-header">
        <span className="text-lab-eyebrow" style={{ color: theme?.text || '#0d0d0d' }}>
          EDITORIAL LABS & INTERACTIVE PROTOTYPES
        </span>
        <h3 className="text-lab-title" style={{ color: theme?.text || '#0d0d0d' }}>
          CONCEPTUAL WORK
        </h3>
      </div>

      <div className="text-lab-list">
        {TEXT_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="text-lab-row magnetic"
            onMouseEnter={() => handleMouseEnterRow(proj)}
            onMouseLeave={handleMouseLeaveRow}
            onClick={() => onSelectProject(proj)}
            style={{ borderColor: 'rgba(13, 13, 13, 0.1)' }}
          >
            <div className="text-lab-row-left">
              <span className="text-lab-num" style={{ color: 'rgba(13, 13, 13, 0.4)' }}>
                {proj.id}
              </span>
              <h4 className="text-lab-proj-title" style={{ color: theme?.text || '#0d0d0d' }}>
                {proj.title}
              </h4>
            </div>

            <div className="text-lab-row-middle">
              <p className="text-lab-proj-sub">
                {proj.subtitle}
              </p>
            </div>

            <div className="text-lab-row-right">
              <div className="text-lab-tags">
                {proj.tags.map(t => (
                  <span key={t} className="text-lab-tag-chip">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-lab-arrow">➔</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating 3D Animated Preview Card */}
      <div
        ref={cardPreviewRef}
        className={`floating-preview-card ${activeProject ? 'active' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        {activeProject && (
          <div className={`preview-card-inner card-theme-${activeProject.key}`}>
            {/* 1. LEMON NOTES PREVIEW CARD */}
            {activeProject.key === 'lemon' && (
              <div className="lemon-card-content">
                <div className="card-top-bar">
                  <span className="card-badge">🍋 LEMON NOTES v2.4</span>
                  <span className="card-status-dot"></span>
                </div>
                <div className="lemon-note-body">
                  <div className="lemon-note-title">Tactile Workspace</div>
                  <div className="lemon-typed-text">{typedNoteText}</div>
                  <div className="lemon-checklist">
                    <div className="check-item done">✓ Deep work focus mode</div>
                    <div className="check-item done">✓ Zero sidebar clutter</div>
                    <div className="check-item active">▸ 60fps GSAP interactions</div>
                  </div>
                </div>
                <div className="card-footer-prompt">
                  CLICK TO EXPLORE ARCHITECTURE ➔
                </div>
              </div>
            )}

            {/* 2. BLOCKCHAIN MOSAIC PREVIEW CARD */}
            {activeProject.key === 'blockchain' && (
              <div className="blockchain-card-content">
                <div className="card-top-bar">
                  <span className="card-badge">🌐 ETHEREUM MATRIX</span>
                  <span className="card-live-dot">LIVE</span>
                </div>
                <div className="blockchain-grid-preview">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="b-tile"
                      style={{
                        animationDelay: `${(i % 4) * 0.2}s`,
                        background: (i % 3 === 0) ? '#2ECC40' : (i % 5 === 0) ? '#39FF14' : 'rgba(255,255,255,0.15)'
                      }}
                    />
                  ))}
                </div>
                <div className="blockchain-stats">
                  <div>Block #{blockCount}</div>
                  <div style={{ color: '#2ECC40' }}>Gas: 14 Gwei (Normal)</div>
                </div>
                <div className="card-footer-prompt">
                  CLICK TO LAUNCH LIVE MOSAIC ➔
                </div>
              </div>
            )}

            {/* 3. SOCIAL BATTERY PREVIEW CARD */}
            {activeProject.key === 'social_battery' && (
              <div className="battery-card-content">
                <div className="card-top-bar">
                  <span className="card-badge">🔋 SOCIAL BATTERY METER</span>
                  <span className="battery-percent">{batteryPercent}%</span>
                </div>
                <div className="battery-meter-container">
                  <div
                    className="battery-fill"
                    style={{
                      width: `${batteryPercent}%`,
                      background: batteryPercent > 70 ? '#39FF14' : batteryPercent > 40 ? '#FFD700' : '#FF4136'
                    }}
                  />
                </div>
                <div className="battery-status-text">
                  STATUS: {batteryPercent > 70 ? 'OPTIMAL FOCUS CAPACITY' : 'RECHARGE RECOMMENDED'}
                </div>
                <div className="card-footer-prompt">
                  CLICK TO VIEW UX SYSTEM ➔
                </div>
              </div>
            )}

            {/* 4. ORION AI PREVIEW CARD */}
            {activeProject.key === 'orion' && (
              <div className="orion-card-content">
                <div className="card-top-bar">
                  <span className="card-badge">🤖 ORION NATIVE ORB</span>
                  <span className="orion-latency">42ms LATENCY</span>
                </div>
                <div className="orion-orb-preview">
                  <div className="orb-ring ring-1"></div>
                  <div className="orb-ring ring-2"></div>
                  <div className="orb-core"></div>
                </div>
                <div className="orion-subtitle">
                  "Orion: Adjusting system focus mode to 100%..."
                </div>
                <div className="card-footer-prompt">
                  CLICK FOR ARCHITECTURE SPECS ➔
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
