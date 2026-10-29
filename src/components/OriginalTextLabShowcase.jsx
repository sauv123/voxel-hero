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
    key: 'trace',
    title: '/trace',
    subtitle: 'A live generative artwork and interactive Ethereum activity visualizer.',
    tags: ['Selected for Milano Digital Week 2026', 'UX RESEARCH', 'UX & INTERACTION DESIGN', 'DATA VIZ'],
    link: 'https://mosaichain.netlify.app',
    liveCta: '⚡ LAUNCH LIVE /TRACE EXPERIENCE',
    experimentId: 14,
    description: 'A live generative artwork that turns Ethereum activity into a visual, audible, and explorable experience. Selected for Milano Digital Week 2026.',
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
    key: 'colordock',
    title: 'COLORDOCK',
    subtitle: 'Floating macOS dock of everyday design tools: palette generator, contrast checker & asset board.',
    tags: ['macOS App', 'SwiftUI', 'Design Systems', 'Micro-Tools'],
    link: 'https://colordock.netlify.app',
    liveCta: '⚡ DOWNLOAD COLORDOCK FOR MAC',
    experimentId: 102,
    video: '/works/colordock.mp4',
    poster: '/works/colordock.webp',
    description: 'ColorDock is a native macOS dock of everyday design tools that floats on top of whatever you’re working in. Pick colors, check WCAG contrast ratios, manage reusable assets, and measure tap-targets without leaving your active canvas.',
    whoItsFor: 'Designers, engineers, and creators who need fast, zero-friction utilities without switching between browser tabs.',
    problem: 'Every small job is a detour. Checking contrast, sampling colors, or testing typography requires leaving your canvas and juggling 5 different web apps.',
    goal: 'Bring 17 essential micro-tools into a persistent desktop dock with native drag-and-drop interop directly into Figma, Sketch, and code editors.',
    coreFeatures: [
      'Generate & Sample: 5 color harmony modes, spacebar shuffle, and a native pixel sampler.',
      'WCAG Contrast Checker: Real-time AA/AAA compliance audit for text and UI elements.',
      'Drag & Drop Interop: Drag colors, gradients, and fonts straight into Figma, Slack, or Xcode.',
      'Asset Board & Pinned Items: Pin swatches, typography scales, and assets for instant reuse.'
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
    } else if (activeProject.key === 'colordock' || activeProject.key === 'social_battery') {
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

            {/* 3. COLORDOCK PREVIEW CARD */}
            {(activeProject.key === 'colordock' || activeProject.key === 'social_battery') && (
              <div className="battery-card-content">
                <div className="card-top-bar">
                  <span className="card-badge">🎨 COLORDOCK FOR MAC</span>
                  <span className="battery-percent" style={{ color: '#0A84FF' }}>macOS 14+</span>
                </div>
                <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '8px 0', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src="/works/colordock.webp" alt="ColorDock" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div className="battery-status-text" style={{ fontSize: '11px', opacity: 0.8 }}>
                  17 MICRO-TOOLS · PALETTES · CONTRAST · ASSETS
                </div>
                <div className="card-footer-prompt" style={{ marginTop: '10px' }}>
                  CLICK TO LAUNCH COLORDOCK SITE ➔
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
