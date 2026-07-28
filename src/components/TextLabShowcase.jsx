import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

import './TextLabShowcase.css';

export const TEXT_PROJECTS = [
  {
    id: '01',
    key: 'lemon',
    title: 'LEMON NOTES',
    subtitle: 'Tactile, distraction-free note-taking workspace designed for deep focus.',
    tags: ['React', 'Local-First', 'Tactile UI'],
    techStack: ['React', 'Local-First', 'Tactile UI', 'Markdown', 'GSAP'],
    link: null,
    experimentId: 4,
    video: '/lemon_notes.mp4',
    poster: '/sauveerpp.webp',
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
    title: 'BLOCKCHAIN MOSAIC',
    subtitle: 'Generative art painting and interactive WebAudio sonification engine.',
    tags: ['WebAudio API', 'Canvas 2D', 'Generative Art'],
    techStack: ['HTML5 Canvas', 'Web Audio API', 'Node.js', 'Ethers.js'],
    link: 'https://mosaichain.netlify.app',
    liveCta: '⚡ LAUNCH LIVE BLOCKCHAIN MOSAIC',
    experimentId: 14,
    video: '/works/mosaic.mp4',
    poster: '/olo.webp',
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
    techStack: ['React', 'GSAP Physics', 'UX System', 'Micro-Interactions'],
    link: null,
    experimentId: 102,
    video: '/2.mp4',
    poster: '/mica.webp',
    description: 'An intuitive emotional health and social capacity tracking widget. Designed to help introverts and creative workers manage daily energy boundaries with visual clarity.',
    whoItsFor: 'Introverts, high-output creatives, and remote teams managing burnout and focus boundaries.',
    problem: 'Traditional productivity apps ignore personal energy levels, treating human capacity like an endless conveyor belt.',
    goal: 'Provide an intuitive emotional health and social capacity tracking widget. Designed to help introverts and creative workers manage daily energy boundaries with visual clarity.',
    coreFeatures: [
      'Spatial Focus Meter: Real-time boundary visualization.',
      'Micro-Interactions: Fluid physics-based UI elements.',
      'Local-First: Privacy-focused personal logging.'
    ]
  }
];

export default function TextLabShowcase({ theme, onSelectProject, projects = TEXT_PROJECTS, showHeader = true }) {
  const containerRef = useRef(null);
  const cardPreviewRef = useRef(null);
  const videoRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  // QuickSetters for smooth 60fps floating card tracking
  const xSetter = useRef(null);
  const ySetter = useRef(null);

  // 1. Initial scroll animation hook (runs once)
  useEffect(() => {
    let ctx = gsap.context(() => {
      const wordElements = gsap.utils.toArray('.text-lab-title .word');
      if (wordElements.length) {
        gsap.fromTo(wordElements, 
          { y: '100%', rotateX: -25, opacity: 0 },
          {
            opacity: 1,
            y: '0%',
            rotateX: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // 2. Mouse move and floating card setter hook (depends on activeProject)
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (cardPreviewRef.current) {
        xSetter.current = gsap.quickSetter(cardPreviewRef.current, "x", "px");
        ySetter.current = gsap.quickSetter(cardPreviewRef.current, "y", "px");
      }
    }, containerRef);

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
          duration: 0.3,
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
      ctx.revert();
    };
  }, [activeProject]);

  // Robust play call on video ref change
  useEffect(() => {
    if (activeProject && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay block prevented immediate playback, retrying...", err);
        });
      }
    }
  }, [activeProject]);

  const handleMouseEnterRow = (proj) => {
    setActiveProject(proj);
    if (cardPreviewRef.current) {
      gsap.killTweensOf(cardPreviewRef.current);
      gsap.fromTo(cardPreviewRef.current, 
        { scale: 0.75, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.6)' }
      );
    }
  };

  const handleMouseLeaveRow = () => {
    if (cardPreviewRef.current) {
      gsap.killTweensOf(cardPreviewRef.current);
      gsap.to(cardPreviewRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setActiveProject(null)
      });
    } else {
      setActiveProject(null);
    }
  };

  return (
    <div className="text-lab-showcase-container" ref={containerRef}>
      {showHeader && (
        <div className="text-lab-header">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3 className="text-lab-title" style={{ color: theme?.text || '#ffffff', display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '0 0 8px 0' }}>
              {("Products I've Built").split(' ').map((word, idx) => (
                <span key={idx} className="word" style={{ display: 'inline-block' }}>{word}</span>
              ))}
            </h3>
            <p className="experiments-title-descr" style={{ color: theme?.text || '#ffffff', opacity: 0.6, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontFamily: 'var(--font-body)', maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
              A playful collection of design explorations, prototypes, and digital toys designed to feel intuitive and fun.
            </p>
          </div>
        </div>
      )}

      {/* Clean High-Craft Editorial Text List */}
      <div className="text-lab-list">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`text-lab-row magnetic ${activeProject?.id === proj.id ? 'active-row' : ''}`}
            onMouseEnter={() => handleMouseEnterRow(proj)}
            onMouseLeave={handleMouseLeaveRow}
            onClick={() => {
              if (proj.link) {
                window.open(proj.link, '_blank', 'noopener,noreferrer');
              } else {
                onSelectProject(proj);
              }
            }}
          >
            <div className="text-lab-row-left">
              <h4 className="text-lab-proj-title" style={{
                color: activeProject?.id === proj.id ? (proj.id === '01' ? '#FFD700' : proj.id === '02' ? '#0074D9' : '#FF4136') : undefined,
                transition: 'color 0.3s ease'
              }}>
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

      {/* Floating 3D Animated Preview Card — Pure Video Stream */}
      <div
        ref={cardPreviewRef}
        className={`floating-preview-card ${activeProject ? 'active' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        {activeProject && (
          <div className="preview-card-inner" style={{ padding: '6px', borderRadius: '16px' }}>
            <div className="preview-video-wrapper" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '240px', backgroundColor: '#000' }}>
              {activeProject.video && (
                <video
                  ref={videoRef}
                  src={activeProject.video}
                  poster={activeProject.poster}
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
