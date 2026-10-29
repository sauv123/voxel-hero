import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutStudio.css';

gsap.registerPlugin(ScrollTrigger);

// Photo assets
import manipalImg from '../assets/PXL_20230613_050806226.webp';
import mumbaiImg from '../assets/IMG_5539.webp';
import milanImg from '../assets/Screenshot 2026-06-01 at 11.17.15 AM.webp';
import Footer from './Footer';

// Preserved interactive modules from AboutMe
import { VinylPlayer, LanguagesToggle, QuoteCard, TruthsGame } from './AboutMe';

// GSAP Animated Camera Icon
function AnimatedCameraIcon() {
  const cameraRef = useRef(null);
  const flashRef = useRef(null);
  const lensRef = useRef(null);

  useEffect(() => {
    if (cameraRef.current) {
      gsap.fromTo(cameraRef.current,
        { scale: 0.6, opacity: 0, rotate: -15, y: 8 },
        { scale: 1, opacity: 1, rotate: 0, y: 0, duration: 0.8, ease: "back.out(2)", delay: 0.25 }
      );
    }
  }, []);

  const triggerSnap = () => {
    // Flash burst
    if (flashRef.current) {
      gsap.timeline()
        .set(flashRef.current, { opacity: 0.95, scale: 2.2 })
        .to(flashRef.current, { opacity: 0, scale: 1, duration: 0.35, ease: "power2.out" });
    }
    // Camera recoil & aperture twist (push and pull)
    if (cameraRef.current) {
      gsap.timeline()
        .to(cameraRef.current, { scale: 0.88, y: 2, rotate: -3, duration: 0.08 })
        .to(cameraRef.current, { scale: 1.12, y: -4, rotate: 2, duration: 0.16 })
        .to(cameraRef.current, { scale: 1.05, y: -2, rotate: 0, duration: 0.2, ease: "elastic.out(1.2, 0.4)" });
    }
    if (lensRef.current) {
      gsap.to(lensRef.current, { rotate: "+=180", duration: 0.4, ease: "power2.out" });
    }
  };

  const handleMouseEnter = () => {
    if (cameraRef.current) {
      gsap.timeline()
        .to(cameraRef.current, { scale: 0.94, duration: 0.06 })
        .to(cameraRef.current, { scale: 1.07, y: -2, duration: 0.2, ease: "back.out(2.2)" });
    }
  };

  const handleMouseLeave = () => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
  };

  return (
    <span 
      ref={cameraRef}
      className="kinetic-interactive-pull camera-pill-trigger"
      onClick={triggerSnap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "#1e1e1e",
        color: "#ffffff",
        padding: "4px 12px",
        borderRadius: "999px",
        marginLeft: "6px",
        marginRight: "6px",
        fontSize: "12px",
        fontWeight: 600,
        verticalAlign: "middle",
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        userSelect: "none"
      }}
    >
      {/* Flash glow */}
      <span 
        ref={flashRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 75%)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10
        }}
      />
      {/* Vintage SLR Camera SVG */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle ref={lensRef} cx="12" cy="13" r="4" stroke="#4ade80" strokeWidth="2"/>
      </svg>
      <span style={{ fontSize: "11px", letterSpacing: "0.04em", fontFamily: "var(--font-mono, monospace)" }}>
        35mm
      </span>
    </span>
  );
}

// ── Inline Kinetic Animated Widgets ──

// 1. Inline Figma Frame Component with blue dashed selection, 4 corner handles & layer popover
function InlineFigmaFrame({ name = "/trace" }) {
  const frameRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const WITTY_QUOTES = [
    "Milano Digital Week 2026 · Sensory Installation ⚡",
    "Layer naming OCD: activated. ✨",
    "Live Ethereum feed mapped to ambient light & sound 📡",
    "Clean frames, clean code. 🎨",
    "Somewhere, a developer just shed a tear of joy. 🥲"
  ];

  const handleClick = (e) => {
    e.stopPropagation();
    setQuoteIdx((prev) => (prev + 1) % WITTY_QUOTES.length);
    if (frameRef.current) {
      gsap.timeline()
        .to(frameRef.current, { scale: 0.90, y: 2, duration: 0.08 })
        .to(frameRef.current, { scale: 1.12, y: -4, duration: 0.16 })
        .to(frameRef.current, { scale: 1.05, y: -2, duration: 0.2, ease: "elastic.out(1.2, 0.4)" });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (frameRef.current) {
      gsap.timeline()
        .to(frameRef.current, { scale: 0.96, y: 1, duration: 0.06 })
        .to(frameRef.current, { scale: 1.07, y: -3, duration: 0.22, ease: "back.out(2.5)" });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (frameRef.current) {
      gsap.to(frameRef.current, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <span
      ref={frameRef}
      className="inline-figma-frame kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className="inline-figma-label">#{name}</span>
      <span className="inline-figma-handle handle-tl" />
      <span className="inline-figma-handle handle-tr" />
      <span className="inline-figma-handle handle-bl" />
      <span className="inline-figma-handle handle-br" />
      <span className="inline-figma-text">{name}</span>

      {isHovered && (
        <span className="inline-figma-tooltip">
          <span className="tooltip-tag">Figma Selection</span>
          <span className="tooltip-body">{WITTY_QUOTES[quoteIdx]}</span>
        </span>
      )}
    </span>
  );
}

// 2. Inline CMYK Ink Rheology Swatch (Print & Media Engineering)
function InlineCmykSwatch() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const dotsRef = useRef([]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (containerRef.current) {
      gsap.timeline()
        .to(containerRef.current, { scale: 0.95, duration: 0.06 })
        .to(containerRef.current, { scale: 1.06, y: -2, duration: 0.2, ease: "back.out(2)" });
    }
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        gsap.to(dot, {
          x: (i - 1.5) * 8,
          scale: 1.3,
          duration: 0.25,
          ease: "back.out(2.5)"
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      gsap.to(containerRef.current, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
    dotsRef.current.forEach((dot) => {
      if (dot) {
        gsap.to(dot, { x: 0, scale: 1, duration: 0.3, ease: "power2.out" });
      }
    });
  };

  return (
    <span
      ref={containerRef}
      className="inline-cmyk-swatch kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="cmyk-dots-group">
        <span ref={el => dotsRef.current[0] = el} className="cmyk-dot cyan" />
        <span ref={el => dotsRef.current[1] = el} className="cmyk-dot magenta" />
        <span ref={el => dotsRef.current[2] = el} className="cmyk-dot yellow" />
        <span ref={el => dotsRef.current[3] = el} className="cmyk-dot black" />
      </span>
      <span className="cmyk-text">ink rheology</span>

      {isHovered && (
        <span className="inline-widget-popover">
          <strong>4-Color Offset Physics</strong>
          <span>Ink viscosity, dot gain tolerances & substrate mechanical yields.</span>
        </span>
      )}
    </span>
  );
}

// 3. Inline Company / Team Token (Hobbytribe & e-tailize)
function InlineCompanyBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const badgeRef = useRef(null);
  const avatarsRef = useRef([]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (badgeRef.current) {
      gsap.timeline()
        .to(badgeRef.current, { scale: 0.95, duration: 0.06 })
        .to(badgeRef.current, { scale: 1.06, y: -3, duration: 0.22, ease: "back.out(2.2)" });
    }
    if (avatarsRef.current[0]) gsap.to(avatarsRef.current[0], { x: -4, scale: 1.15, duration: 0.25, ease: "back.out(2)" });
    if (avatarsRef.current[1]) gsap.to(avatarsRef.current[1], { x: 4, scale: 1.15, duration: 0.25, ease: "back.out(2)" });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (badgeRef.current) {
      gsap.to(badgeRef.current, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }
    if (avatarsRef.current[0]) gsap.to(avatarsRef.current[0], { x: 0, scale: 1, duration: 0.25, ease: "power2.out" });
    if (avatarsRef.current[1]) gsap.to(avatarsRef.current[1], { x: 0, scale: 1, duration: 0.25, ease: "power2.out" });
  };

  return (
    <span
      ref={badgeRef}
      className="inline-team-badge kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="inline-team-avatar-stack">
        <span ref={el => avatarsRef.current[0] = el} className="avatar-dot avatar-h">H</span>
        <span ref={el => avatarsRef.current[1] = el} className="avatar-dot avatar-e">e</span>
      </span>
      <span className="inline-team-name">Hobbytribe & e-tailize</span>
      <span className="inline-team-years">2022–2024</span>

      {isHovered && (
        <span className="inline-team-popover">
          <span className="popover-eyebrow">Mumbai · 0→1 Product Delivery</span>
          <span className="popover-title">Product Designer & Design Systems Lead</span>
          <span className="popover-metrics">
            <span>₹1.2 Cr Seed Round</span> • <span>2.5× Retention</span> • <span>100+ User Interviews</span>
          </span>
        </span>
      )}
    </span>
  );
}

// 4. Inline Institution Token (MIT Manipal & NABA Milano)
function InlineInstitutionBadge({ name, location, degree, link }) {
  const [isHovered, setIsHovered] = useState(false);
  const pillRef = useRef(null);
  const iconRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (pillRef.current) {
      gsap.timeline()
        .to(pillRef.current, { scale: 0.96, duration: 0.06 })
        .to(pillRef.current, { scale: 1.05, y: -2, duration: 0.2, ease: "back.out(2)" });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, { y: -3, scale: 1.25, duration: 0.2, ease: "back.out(2)" });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (pillRef.current) {
      gsap.to(pillRef.current, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
    }
  };

  return (
    <a
      ref={pillRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-institution-pill kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={iconRef} className="institution-pill-icon">🏛</span>
      <span className="institution-pill-name">{name}</span>

      {isHovered && (
        <span className="inline-institution-popover">
          <span className="popover-eyebrow">{location}</span>
          <span className="popover-title">{degree}</span>
        </span>
      )}
    </a>
  );
}

// 5. Inline Claude & AI Sparkle Badge
function InlineAiSparkBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const badgeRef = useRef(null);
  const sparkRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (badgeRef.current) {
      gsap.timeline()
        .to(badgeRef.current, { scale: 0.95, duration: 0.06 })
        .to(badgeRef.current, { scale: 1.06, y: -2, duration: 0.2, ease: "back.out(2)" });
    }
    if (sparkRef.current) {
      gsap.to(sparkRef.current, { rotate: "+=360", scale: 1.4, duration: 0.45, ease: "back.out(2.5)" });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (badgeRef.current) {
      gsap.to(badgeRef.current, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
    if (sparkRef.current) {
      gsap.to(sparkRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <span
      ref={badgeRef}
      className="inline-ai-spark-badge kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={sparkRef} className="ai-spark-mark">✦</span>
      <span className="ai-badge-text">Claude / AI Systems</span>

      {isHovered && (
        <span className="inline-widget-popover">
          <strong>NABA AI Academic Integrity Committee</strong>
          <span>Evaluating generative cognition, creative pedagogy & human-AI boundary governance.</span>
        </span>
      )}
    </span>
  );
}

// 6. Inline Interaction Word (with tactile button push down and spring pull release)
function InlineInteractionWord() {
  const wordRef = useRef(null);
  const cursorRef = useRef(null);

  const handleMouseEnter = () => {
    if (wordRef.current) {
      gsap.timeline()
        .to(wordRef.current, { scale: 0.91, y: 2, duration: 0.08, ease: "power2.in" })
        .to(wordRef.current, { scale: 1.1, y: -3, color: "#2563eb", duration: 0.18, ease: "back.out(2.5)" })
        .to(wordRef.current, { scale: 1, y: 0, color: "inherit", duration: 0.25, ease: "elastic.out(1, 0.4)" });
    }
    if (cursorRef.current) {
      gsap.timeline()
        .fromTo(cursorRef.current, { opacity: 0, x: -14, y: 10, scale: 0.6 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.16 })
        .to(cursorRef.current, { scale: 0.85, duration: 0.08 })
        .to(cursorRef.current, { opacity: 0, y: -8, duration: 0.22, delay: 0.12 });
    }
  };

  return (
    <span
      ref={wordRef}
      className="inline-kinetic-word inline-interaction kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
    >
      <span ref={cursorRef} className="interaction-mini-cursor">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5"/>
        </svg>
      </span>
      interaction
      <span className="kinetic-glyph">⚡</span>
    </span>
  );
}

// 7. Inline Experience Word (replaces motion, with wave letter stagger animation)
function InlineExperienceWord() {
  const lettersRef = useRef([]);
  const wordRef = useRef(null);

  const handleMouseEnter = () => {
    if (wordRef.current) {
      gsap.timeline()
        .to(wordRef.current, { scale: 0.95, duration: 0.06 })
        .to(wordRef.current, { scale: 1.06, y: -2, duration: 0.2, ease: "back.out(2)" })
        .to(wordRef.current, { scale: 1, y: 0, duration: 0.25 });
    }
    lettersRef.current.forEach((el, idx) => {
      if (el) {
        gsap.timeline()
          .to(el, { y: -8, rotate: (idx % 2 === 0 ? 8 : -8), duration: 0.14, delay: idx * 0.025, ease: "power2.out" })
          .to(el, { y: 0, rotate: 0, duration: 0.3, ease: "elastic.out(1.2, 0.4)" });
      }
    });
  };

  return (
    <span ref={wordRef} className="inline-kinetic-word inline-experience kinetic-interactive-pull" onMouseEnter={handleMouseEnter}>
      {["e", "x", "p", "e", "r", "i", "e", "n", "c", "e"].map((char, i) => (
        <span key={i} ref={el => lettersRef.current[i] = el} className="motion-letter">
          {char}
        </span>
      ))}
      <span className="kinetic-glyph">✨</span>
    </span>
  );
}

// 8. Inline Tactile / Feel Word (squash and stretch pull & push)
function InlineTactileWord() {
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      gsap.timeline()
        .to(ref.current, { scaleX: 1.18, scaleY: 0.85, y: 2, duration: 0.1 })
        .to(ref.current, { scaleX: 0.92, scaleY: 1.15, y: -4, duration: 0.16 })
        .to(ref.current, { scaleX: 1, scaleY: 1, y: 0, duration: 0.3, ease: "elastic.out(1.2, 0.4)" });
    }
  };

  return (
    <span ref={ref} className="inline-kinetic-word inline-tactile kinetic-interactive-pull" onMouseEnter={handleMouseEnter}>
      how things feel
      <span className="kinetic-glyph">🤌</span>
    </span>
  );
}

// 9. Inline Metric Pill
function InlineMetricPill({ label, sub }) {
  const pillRef = useRef(null);

  const handleMouseEnter = () => {
    if (pillRef.current) {
      gsap.timeline()
        .to(pillRef.current, { scale: 0.96, duration: 0.06 })
        .to(pillRef.current, { scale: 1.06, y: -2, duration: 0.2, ease: "back.out(2)" });
    }
  };

  const handleMouseLeave = () => {
    if (pillRef.current) {
      gsap.to(pillRef.current, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
  };

  return (
    <span
      ref={pillRef}
      className="inline-metric-pill kinetic-interactive-pull"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="metric-pill-dot" />
      <span className="metric-pill-label">{label}</span>
      {sub && <span className="metric-pill-sub">{sub}</span>}
    </span>
  );
}

// ── Interactive Hero Polaroid Stack (Sauveer's Uploaded Personal Photos) ──
function HeroPolaroidStack() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(1); // Portrait at center by default
  const [isFanned, setIsFanned] = useState(false);

  const polaroids = [
    {
      id: 0,
      src: "/hero_polaroids/speaking.webp",
      restAngle: -6,
      fanAngle: -13,
      restX: -85,
      fanX: -155,
      restY: 6,
      fanY: 4
    },
    {
      id: 1,
      src: "/hero_polaroids/portrait.webp",
      restAngle: 1,
      fanAngle: 0,
      restX: 0,
      fanX: 0,
      restY: -6,
      fanY: -14
    },
    {
      id: 2,
      src: "/hero_polaroids/childhood.webp",
      restAngle: 7,
      fanAngle: 13,
      restX: 85,
      fanX: 155,
      restY: 8,
      fanY: 6
    }
  ];

  // Responsive scaling
  const getCoords = (p, fanned) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
    const factor = isMobile ? 0.5 : 1;
    const xBase = fanned ? p.fanX : p.restX;
    const angleBase = fanned ? p.fanAngle : p.restAngle;
    const yBase = fanned ? p.fanY : p.restY;
    return {
      x: xBase * factor,
      y: yBase * factor,
      angle: angleBase * (isMobile ? 0.7 : 1)
    };
  };

  const applyPositions = (fanned) => {
    polaroids.forEach((p, idx) => {
      const card = cardsRef.current[idx];
      if (!card) return;
      const coords = getCoords(p, fanned);
      gsap.to(card, {
        x: coords.x,
        y: coords.y,
        rotate: coords.angle,
        duration: 0.45,
        ease: "power2.out"
      });
    });
  };

  const handleContainerEnter = () => {
    setIsFanned(true);
    applyPositions(true);
  };

  const handleContainerLeave = () => {
    setIsFanned(false);
    applyPositions(false);
  };

  const handleCardClick = (idx) => {
    setActiveCard(idx);
    const card = cardsRef.current[idx];
    if (!card) return;
    gsap.timeline()
      .to(card, { scale: 0.95, duration: 0.08 })
      .to(card, { scale: 1.06, y: "-=16", duration: 0.2, ease: "back.out(2)" })
      .to(card, { scale: 1.02, duration: 0.25, ease: "power2.out" });
  };

  return (
    <div 
      ref={containerRef} 
      className="hero-polaroid-stack-wrapper"
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
    >
      <div className="hero-polaroid-stack-container">
        {polaroids.map((p, idx) => {
          const coords = getCoords(p, isFanned);
          const isTop = activeCard === idx;
          const zIndex = isTop ? 30 : (idx === 1 ? 20 : 10);
          return (
            <div
              key={p.id}
              ref={el => cardsRef.current[idx] = el}
              className={`hero-polaroid-card ${isTop ? 'is-active-top' : ''}`}
              style={{
                transform: `translate3d(${coords.x}px, ${coords.y}px, 0) rotate(${coords.angle}deg)`,
                zIndex
              }}
              onClick={() => handleCardClick(idx)}
              title="Click to bring to front"
            >
              <div className="hero-polaroid-img-wrapper">
                <img src={p.src} alt="Sauveer" draggable={false} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="hero-polaroid-hint">
        <span>tap or hover to shuffle</span>
      </div>
    </div>
  );
}

// ── "What I Enjoy" Vertical Parallax Gallery (Behance / Awwwards Inspired) ──
// Resting: 3 curated photos side-by-side in 3 columns with vertical typography "hover me !"
// Hover: Columns glide vertically (Col 1 UP, Col 2 DOWN, Col 3 UP) revealing all 10 photos; CTA rolls to "yay"
// Unhover: Motion halts and GSAP smoothly eases back to position 0 (the 3 resting photos)
function HoverSlideEnjoyGallery() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  const animFrameRef = useRef(null);
  const offset1Ref = useRef(0);
  const offset2Ref = useRef(0);
  const offset3Ref = useRef(0);
  const lastTimeRef = useRef(null);

  // 9 Curated Personal Photos (guaranteed valid local files in /enjoy/)
  const col1Photos = [
    { id: 1, src: "/enjoy/enjoy-1-lake.jpg", title: "Lake Como Waterfront" },
    { id: 7, src: "/enjoy/enjoy-7-forest.jpg", title: "Alpine Forest & Ski Lift" },
    { id: 10, src: "/enjoy/enjoy-10-hikers.jpg", title: "Ascending the Ridge" }
  ];

  const col2Photos = [
    { id: 4, src: "/enjoy/enjoy-4-beanie.jpg", title: "Summit Smile" },
    { id: 2, src: "/enjoy/enjoy-2-triptych.jpg", title: "Alpine Ridge Triptych" },
    { id: 8, src: "/enjoy/enjoy-8-lamp-peak.jpg", title: "Peak Silhouette" }
  ];

  const col3Photos = [
    { id: 6, src: "/enjoy/enjoy-6-holi.jpg", title: "Holi Festival Color Study" },
    { id: 3, src: "/enjoy/enjoy-3-deck.jpg", title: "Observation Deck" },
    { id: 9, src: "/enjoy/enjoy-9-chalet.jpg", title: "Dolomites Chalet" }
  ];

  // Tripled for seamless infinite vertical glide loop
  const loopCol1 = [...col1Photos, ...col1Photos, ...col1Photos];
  const loopCol2 = [...col2Photos, ...col2Photos, ...col2Photos];
  const loopCol3 = [...col3Photos, ...col3Photos, ...col3Photos];

  useEffect(() => {
    if (!isHovered) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;

      // Smoothly return all 3 vertical columns to position 0 (the 3 resting photos)
      [col1Ref.current, col2Ref.current, col3Ref.current].forEach((col) => {
        if (col) {
          gsap.to(col, {
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
      offset1Ref.current = 0;
      offset2Ref.current = 0;
      offset3Ref.current = 0;
      return;
    }

    // Kill any return animations before beginning active glide
    [col1Ref.current, col2Ref.current, col3Ref.current].forEach((col) => {
      if (col) gsap.killTweensOf(col);
    });

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      // Columns 1 and 3 glide UP, Column 2 glides DOWN
      const speed = 60; // pixels per second
      offset1Ref.current -= speed * delta;
      offset2Ref.current += speed * 0.9 * delta;
      offset3Ref.current -= speed * 1.1 * delta;

      const c1 = col1Ref.current;
      const c2 = col2Ref.current;
      const c3 = col3Ref.current;

      if (c1) {
        const loopH = c1.scrollHeight / 3;
        if (loopH > 0 && Math.abs(offset1Ref.current) >= loopH) {
          offset1Ref.current += loopH;
        }
        c1.style.transform = `translate3d(0, ${offset1Ref.current}px, 0)`;
      }

      if (c2) {
        const loopH = c2.scrollHeight / 3;
        if (loopH > 0 && offset2Ref.current >= 0) {
          offset2Ref.current -= loopH;
        }
        c2.style.transform = `translate3d(0, ${offset2Ref.current}px, 0)`;
      }

      if (c3) {
        const loopH = c3.scrollHeight / 3;
        if (loopH > 0 && Math.abs(offset3Ref.current) >= loopH) {
          offset3Ref.current += loopH;
        }
        c3.style.transform = `translate3d(0, ${offset3Ref.current}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isHovered]);

  return (
    <div 
      className={`enjoy-behance-root ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(prev => !prev)}
    >
      {/* Kinetic Vertical Typography Roller: "hover me !" -> "yay" (no pill) */}
      <div className="enjoy-hover-cta-roller" aria-label={isHovered ? "yay" : "hover me !"}>
        <div className={`enjoy-hover-cta-track ${isHovered ? 'rolled' : ''}`}>
          <span className="enjoy-cta-word resting">hover me !</span>
          <span className="enjoy-cta-word active">yay</span>
        </div>
      </div>

      {/* 3-Column Vertical Parallax Stage */}
      <div className="enjoy-behance-stage">
        {/* Column 1: Glides UP */}
        <div className="enjoy-behance-col-window">
          <div ref={col1Ref} className="enjoy-behance-col-track">
            {loopCol1.map((photo, idx) => (
              <div 
                key={`c1-${photo.id}-${idx}`}
                className="enjoy-behance-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.src} alt={photo.title} draggable={false} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Glides DOWN */}
        <div className="enjoy-behance-col-window">
          <div ref={col2Ref} className="enjoy-behance-col-track">
            {loopCol2.map((photo, idx) => (
              <div 
                key={`c2-${photo.id}-${idx}`}
                className="enjoy-behance-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.src} alt={photo.title} draggable={false} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Glides UP */}
        <div className="enjoy-behance-col-window">
          <div ref={col3Ref} className="enjoy-behance-col-track">
            {loopCol3.map((photo, idx) => (
              <div 
                key={`c3-${photo.id}-${idx}`}
                className="enjoy-behance-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.src} alt={photo.title} draggable={false} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="award-lightbox-backdrop"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="award-lightbox-card clean"
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="award-lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="award-lightbox-media">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AboutStudio({ theme, onClose, onSwitchToClassic }) {
  // Video & Retro TV state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Audio & Tuning Nodes
  const audioCtxRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const filterNodeRef = useRef(null);
  const noiseGainRef = useRef(null);
  const volumeGainRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(75); // 0 to 100
  const [tuning, setTuning] = useState(50); // 0 to 100; 50 is sweet spot

  // Refs for tracking drag gestures on knobs
  const isTuningDragging = useRef(false);
  const tuningStartY = useRef(0);
  const tuningStartVal = useRef(50);

  const isVolumeDragging = useRef(false);
  const volumeStartY = useRef(0);
  const volumeStartVal = useRef(75);

  // Channel sweet spot: 50 is crystal clear lock
  const sweetSpot = 50;
  const tuningDelta = Math.abs(tuning - sweetSpot);
  // Normalized detune [0 = clear, 1 = completely detuned / static]
  const detune = Math.min(1, tuningDelta / 24);
  const isLocked = detune === 0;

  // Initialize Web Audio Engine for CRT static & audio filtering
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 1. Synthetic CRT White/Pink Noise Buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      whiteNoise.start(0);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 2200;
      noiseFilter.Q.value = 1.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0; // Starts silent when tuned

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseGainRef.current = noiseGain;

      // 2. Video Audio Node with Biquad Filter & Gain
      if (videoRef.current && !mediaSourceRef.current) {
        try {
          const source = ctx.createMediaElementSource(videoRef.current);
          mediaSourceRef.current = source;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 20000;
          filterNodeRef.current = filter;

          const volGain = ctx.createGain();
          volGain.gain.value = isMuted ? 0 : volume / 100;
          volumeGainRef.current = volGain;

          source.connect(filter);
          filter.connect(volGain);
          volGain.connect(ctx.destination);
        } catch (e) {
          console.warn("Web Audio MediaElementSource notice", e);
        }
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [isMuted, volume]);

  // Update audio filter & static noise whenever tuning or volume changes
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const currVol = isMuted ? 0 : volume / 100;

    // Static noise hiss
    if (noiseGainRef.current) {
      const targetHiss = isPlaying ? detune * 0.24 * currVol : 0;
      noiseGainRef.current.gain.setTargetAtTime(targetHiss, ctx.currentTime, 0.04);
    }

    // Video lowpass & muffled distortion filter
    if (filterNodeRef.current) {
      const targetFreq = 500 + (1 - detune) * 19500;
      filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.04);
    }

    // Volume gain node
    if (volumeGainRef.current) {
      volumeGainRef.current.gain.setTargetAtTime(currVol, ctx.currentTime, 0.04);
    }
  }, [tuning, detune, volume, isMuted, isPlaying]);

  // Handle Play/Pause: "when I click the TV, when I press play, it should start from beginning."
  const handleTvClick = () => {
    initAudio();
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0; // Starts from beginning!
    videoRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Playback error:", err);
    });
  };

  // Toggle Mute / Unmute: "when someone clicks the play or audio button it starts from the beginning"
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    initAudio();
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Starts from beginning!
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        if (volume === 0) setVolume(75);
        videoRef.current.volume = (volume === 0 ? 75 : volume) / 100;
      }
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Playback error:", err);
      });
    }
  };

  // Adjust Volume directly
  const handleVolumeChange = (newVol) => {
    initAudio();
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped / 100;
      videoRef.current.muted = clamped === 0;
      setIsMuted(clamped === 0);
    }
  };

  // ── Tuning Knob Interactive Pointer Handlers (Drag up/down) ──
  const handleTuningPointerDown = (e) => {
    e.preventDefault();
    initAudio();
    isTuningDragging.current = true;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    tuningStartY.current = clientY;
    tuningStartVal.current = tuning;

    const onPointerMove = (ev) => {
      if (!isTuningDragging.current) return;
      const curY = ev.clientY ?? ev.touches?.[0]?.clientY ?? 0;
      const diff = (tuningStartY.current - curY) * 0.45; // Drag up increases
      const nextVal = Math.max(0, Math.min(100, Math.round(tuningStartVal.current + diff)));
      setTuning(nextVal);
    };

    const onPointerUp = () => {
      isTuningDragging.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
  };

  const handleTuningWheel = (e) => {
    e.preventDefault();
    initAudio();
    const delta = -Math.sign(e.deltaY) * 3;
    setTuning(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  const handleTuningKnobClick = (e) => {
    if (e) e.stopPropagation();
    initAudio();
    // Snap to sweet spot 50 if detuned, or detune slightly to 74 if already locked
    if (tuning === 50) setTuning(74);
    else setTuning(50);
  };

  // ── Volume Knob Interactive Pointer Handlers (Drag up/down) ──
  const handleVolumePointerDown = (e) => {
    e.preventDefault();
    initAudio();
    isVolumeDragging.current = true;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    volumeStartY.current = clientY;
    volumeStartVal.current = volume;

    const onPointerMove = (ev) => {
      if (!isVolumeDragging.current) return;
      const curY = ev.clientY ?? ev.touches?.[0]?.clientY ?? 0;
      const diff = (volumeStartY.current - curY) * 0.45; // Drag up increases
      const nextVal = Math.max(0, Math.min(100, Math.round(volumeStartVal.current + diff)));
      handleVolumeChange(nextVal);
    };

    const onPointerUp = () => {
      isVolumeDragging.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
  };

  const handleVolumeWheel = (e) => {
    e.preventDefault();
    initAudio();
    const delta = -Math.sign(e.deltaY) * 5;
    handleVolumeChange(volume + delta);
  };

  const handleVolumeKnobClick = (e) => {
    if (e) e.stopPropagation();
    initAudio();
    toggleMute();
  };

  // CRT visual noise canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const renderNoise = () => {
      if (detune > 0.05) {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = detune * 140 * Math.random();
        }
        ctx.putImageData(imgData, 0, 0);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      animId = requestAnimationFrame(renderNoise);
    };

    renderNoise();
    return () => cancelAnimationFrame(animId);
  }, [detune]);

  // Autoplay video on mount (muted, ready to play)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Autoplay waiting for user gesture:", err);
      });
    }
  }, []);

  // Interactive Narrative & Kinetic Motion on Viewport Entry
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.classList.contains('studio-narrative-prose')) {
            gsap.fromTo(el,
              { opacity: 0.1, y: 22 },
              { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }
            );
          } else if (el.classList.contains('kinetic-interactive-pull')) {
            gsap.fromTo(el,
              { opacity: 0.1, scale: 0.8, y: 16, rotate: -3 },
              { opacity: 1, scale: 1, y: 0, rotate: 0, duration: 0.6, ease: "back.out(2)" }
            );
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

    document.querySelectorAll('.studio-narrative-prose, .kinetic-interactive-pull').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Knobs rotation angles
  const tuningKnobAngle = (tuning - 50) * 4.5;
  const volKnobAngle = (volume / 100) * 240 - 120; // -120deg (0%) to +120deg (100%)

  return (
    <div className="studio-about-page">
      {/* ── Top Floating Close Button (Classic Switcher Removed) ── */}
      {onClose && (
        <div className="studio-top-actions">
          <button 
            onClick={onClose}
            aria-label="Close About"
            className="studio-close-circle-btn"
          >
            ✕
          </button>
        </div>
      )}

      <div className="studio-about-shell">

        {/* ── 01. Hero Typography & Interactive Eye-Tracking Viewfinder Avatar ── */}
        <section className="studio-hero-section">
          <div style={{ textAlign: 'center', padding: '36px 0 20px' }}>
            <h1 style={{
              fontFamily: "var(--font-heading, 'Elms Sans', sans-serif)",
              fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#1e1e1e',
              margin: '0',
              lineHeight: 1.02
            }}>
              Sauveer Sinha
            </h1>
            <HeroPolaroidStack />
          </div>
        </section>

        {/* ── 02. How I Got Here: Inline Interactive Storytelling (Centered) ── */}
        <section className="studio-how-section" id="how-i-got-here">
          <div className="studio-how-inner">
            <h2 className="studio-section-title">
              How I Got Here
            </h2>

            {/* Centered Editorial Narrative with Kinetic Motion on Scroll */}
            <div className="studio-how-center-narrative">
              {/* Intro paragraph: Exactly 2 lines, authentic & human */}
              <p className="studio-narrative-prose">
                I fell in love with design looking through a 35mm viewfinder <AnimatedCameraIcon />. That habit of close observation—light, patience, and honest human moments—is still how I shape digital products today.
              </p>

              {/* Paragraph 2: Mumbai startups 0→1 delivery */}
              <p className="studio-narrative-prose">
                That led me to Mumbai, where I worked across early-stage startups building 0→1 products from the ground up at{" "}
                <InlineCompanyBadge />—driving{" "}
                <InlineMetricPill label="2.5× Retention" sub="₹1.2 Cr Seed" />.
                Shipping in that fast-paced environment taught me how to move quickly without compromising on craft, building products people genuinely rely on.
              </p>

              {/* Paragraph 3: NABA Milano, AI Ethics Committee, /trace Figma Frame, and Kinetic Words */}
              <p className="studio-narrative-prose">
                Currently pursuing my Master's in User Experience Design at{" "}
                <InlineInstitutionBadge 
                  name="NABA Milano" 
                  location="Milan, Italy" 
                  degree="Master of Arts · UX Design" 
                  link="https://www.naba.it/en" 
                />
                , I was appointed to the AI Academic Integrity Committee with a focus on{" "}
                <InlineAiSparkBadge /> and{" "}
                <a 
                  href="/casestudies/trace/index.html"
                  className="mdw-case-study-tag kinetic-interactive-pull"
                  style={{
                    display: 'inline-flex',
                    verticalAlign: 'middle',
                    margin: '0 6px',
                    transform: 'rotate(-2deg) scale(0.92)',
                    textDecoration: 'none'
                  }}
                  title="View /trace case study exhibited at Milano Digital Week 2026"
                >
                  <img src="/mdw-logo.jpg" alt="Milano Digital Week logo" />
                  <span className="mdw-tag-text">
                    <span className="mdw-tag-eyebrow">Selected for</span>
                    <b className="mdw-tag-title">Milano Digital Week 2026</b>
                  </span>
                </a>
                {" "}for{" "}
                <InlineFigmaFrame name="/trace" />
                —turning raw Ethereum network transactions into an ambient sensory installation. In a world where anyone can ship an interface in seconds, I specialize in digital products with a deep focus on{" "}
                <InlineInteractionWord />, <InlineExperienceWord />, and <InlineTactileWord /> that spark a little childlike wonder and delight in everyone.
              </p>
            </div>

          </div>
        </section>

        {/* ── 03. Retro TV Section with Interactive Knob Tuning & Real Volume (Badge Removed) ── */}
        <section className="retro-tv-section">
          <div className="retro-tv-header">
            <h2 className="retro-tv-title">
              Just Saying Hi.
            </h2>
            <p className="retro-tv-subtitle">
              Click TV to play from beginning. Drag knobs vertically to tune reception & adjust volume.
            </p>
          </div>

          <div className="retro-tv-chassis">
            {/* Dual Telescopic Antennas */}
            <div className="retro-tv-antenna-wrapper">
              <div className="retro-tv-antenna-left">
                <div className="retro-tv-antenna-ball"></div>
              </div>
              <div className="retro-tv-antenna-right">
                <div className="retro-tv-antenna-ball"></div>
              </div>
            </div>

            {/* CRT Screen with curved bezel, glass glare & live tuning filter */}
            <div 
              className="retro-tv-screen-bezel"
              onClick={handleTvClick}
              title="Click TV to play from beginning"
            >
              <video
                ref={videoRef}
                src="/portfolio.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="retro-tv-video"
                style={{
                  filter: detune > 0 
                    ? `contrast(${1 + detune * 0.35}) brightness(${1 - detune * 0.15}) grayscale(${detune * 0.4})`
                    : 'none'
                }}
              />
              {/* Animated CRT static canvas */}
              <canvas 
                ref={canvasRef} 
                width={160} 
                height={120} 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  opacity: detune > 0 ? Math.min(0.75, detune * 0.8) : 0,
                  mixBlendMode: 'screen'
                }}
              />

              <div className="retro-tv-scanlines"></div>
              <div className="retro-tv-glare"></div>
              
              <div className="retro-tv-channel-badge">
                CH 03
              </div>

              {/* Play / Pause overlay badge if paused */}
              {!isPlaying && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 4,
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    paddingLeft: '4px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}>
                    ▶
                  </div>
                </div>
              )}

              <button
                className="retro-tv-unmute-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? "🔇 Click to Unmute" : `🔊 VOL ${volume}%`}
              </button>
            </div>

            {/* Hardware Control Panel with Direct Knob Drag / Wheel Controls */}
            <div className="retro-tv-control-panel">
              {/* Tuning Knob */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  className="retro-tv-knob"
                  style={{ transform: `rotate(${tuningKnobAngle}deg)` }}
                  onPointerDown={handleTuningPointerDown}
                  onWheel={handleTuningWheel}
                  onClick={handleTuningKnobClick}
                  title="Drag up/down or scroll to tune. Click to toggle lock."
                >
                  <div className="retro-tv-knob-indicator"></div>
                </div>
                <span className="retro-tv-knob-label">Tuning</span>
                <span style={{ 
                  fontSize: '9px', 
                  fontFamily: 'var(--font-mono, monospace)', 
                  color: isLocked ? '#4ade80' : '#f87171',
                  marginTop: '2px',
                  fontWeight: 700
                }}>
                  {isLocked ? 'LOCKED' : `${tuning}%`}
                </span>
              </div>

              {/* Speaker Slots */}
              <div className="retro-tv-speaker-grille">
                <div className="retro-tv-speaker-slot"></div>
                <div className="retro-tv-speaker-slot"></div>
                <div className="retro-tv-speaker-slot"></div>
                <div className="retro-tv-speaker-slot"></div>
                <div className="retro-tv-speaker-slot"></div>
              </div>

              {/* Volume Knob */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  className="retro-tv-knob"
                  style={{ transform: `rotate(${volKnobAngle}deg)` }}
                  onPointerDown={handleVolumePointerDown}
                  onWheel={handleVolumeWheel}
                  onClick={handleVolumeKnobClick}
                  title="Drag up/down or scroll to adjust volume. Click to mute/unmute."
                >
                  <div className="retro-tv-knob-indicator"></div>
                </div>
                <span className="retro-tv-knob-label">Volume</span>
                <span style={{ 
                  fontSize: '9px', 
                  fontFamily: 'var(--font-mono, monospace)', 
                  color: isMuted ? '#ef4444' : '#4ade80',
                  marginTop: '2px',
                  fontWeight: 700
                }}>
                  {isMuted ? 'MUTED' : `${volume}%`}
                </span>
              </div>

              {/* Power / Signal LED */}
              <div className="retro-tv-power-light">
                <div className="retro-tv-led"></div>
                <span>PWR</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04. What I Enjoy: Personal Photography & Adventures (GSAP Interactive, No Sliders, No tags/lines) ── */}
        <section className="studio-enjoy-section">
          <div className="studio-enjoy-inner">
            <h2 className="studio-section-title">
              What I Enjoy
            </h2>
            <p className="studio-enjoy-desc">
              When I'm not designing or vibe coding, I spend my time hiking alpine trails, traveling across European cities, curating deep house & techno vinyls, modeling brutalist 3D voxels, playing football, and exploring Milanese architecture and design history.
            </p>

            <HoverSlideEnjoyGallery />
          </div>
        </section>

        {/* ── 05. DJ Vinyl Platter Music Player ── */}
        <section style={{ maxWidth: '900px', margin: '40px auto 24px', width: '100%' }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <VinylPlayer theme={{ text: '#FCFAF2', bg: '#111111' }} />
          </div>
        </section>

        {/* ── 06. Languages Toggle & Philosophy Quote Card Grid ── */}
        <section style={{ 
          maxWidth: '900px', 
          margin: '0 auto 24px', 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <LanguagesToggle theme={{ text: '#FCFAF2', bg: '#111111' }} />
          </div>
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <QuoteCard theme={{ text: '#FCFAF2', bg: '#111111' }} />
          </div>
        </section>

        {/* ── 07. Interactive Mini-Game: Two Truths and a Lie (Exact Previous Version) ── */}
        <section style={{ maxWidth: '900px', margin: '0 auto 40px', width: '100%' }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <TruthsGame theme={{ text: '#FCFAF2', bg: '#111111' }} />
          </div>
        </section>

      </div>

      {/* Global Footer */}
      <Footer theme={{ text: '#1e1e1e', bg: '#fafafa' }} activeChar="deer" />
    </div>
  );
}
