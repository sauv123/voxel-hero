import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExperimentsGrid.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Binary Shark Pool Component ─────────────────────────────────────────────
const BinarySharkPool = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  
  const sharkRef = useRef({ 
    x: 200, 
    y: 150, 
    vx: 1.8, 
    vy: 1.2 
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const fontSize = 14;
    const spacing = 20;
    const mouseRadius = 70;
    const repulsionStrength = 3.5;
    const springFactor = 0.08;
    const friction = 0.82;

    class Particle {
      constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.char = Math.random() > 0.5 ? '1' : '0';
      }

      update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * repulsionStrength;
          this.vy -= Math.sin(angle) * force * repulsionStrength;
        }

        this.vx += (this.originX - this.x) * springFactor;
        this.vy += (this.originY - this.y) * springFactor;

        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(context) {
        context.fillText(this.char, this.x, this.y);
      }
    }

    const initGrid = () => {
      particles = [];
      const { width, height } = canvas;
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      
      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          particles.push(new Particle(offsetX + i * spacing, offsetY + j * spacing));
        }
      }
    };

    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx.font = `500 ${fontSize}px "Courier New", Courier, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      initGrid();
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(13, 13, 13, 0.15)'; // Darker binary text for light theme pool contrast

      particles.forEach((p) => {
        p.update(mouseRef.current.x, mouseRef.current.y);
        p.draw(ctx);
      });

      let { x, y, vx, vy } = sharkRef.current;
      
      x += vx;
      y += vy;

      if (x < 40) { x = 40; vx *= -1; }
      if (x > canvas.width - 40) { x = canvas.width - 40; vx *= -1; }
      if (y < 40) { y = 40; vy *= -1; }
      if (y > canvas.height - 40) { y = canvas.height - 40; vy *= -1; }

      const dx = mouseRef.current.x - x;
      const dy = mouseRef.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 140) {
        vx -= (dx / dist) * 1.2;
        vy -= (dy / dist) * 1.2;
      }

      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 10) {
        vx = (vx / speed) * 10;
        vy = (vy / speed) * 10;
      } else if (speed > 1.8 && dist >= 140) {
        vx *= 0.98;
        vy *= 0.98;
      } else if (speed < 1.8) {
        vx = (vx / speed) * 1.8;
        vy = (vy / speed) * 1.8;
      }

      sharkRef.current = { x, y, vx, vy };

      const sharkElement = containerRef.current?.querySelector('#shark-element');
      if (sharkElement) {
        const rotationDeg = Math.atan2(vy, vx) * (180 / Math.PI) + 90; 
        sharkElement.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotationDeg}deg)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <div 
      ref={containerRef} 
      className="binary-shark-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="binary-shark-canvas" />
      
      {/* Floating Shark Overlay */}
      <div id="shark-element" className="binary-shark-element">
        <svg viewBox="0 0 100 100" width="60" height="60">
           <path d="M 30 45 C 10 50, 0 65, 10 75 C 20 60, 40 55, 40 55 Z" fill="#2563EB" />
           <path d="M 70 45 C 90 50, 100 65, 90 75 C 80 60, 60 55, 60 55 Z" fill="#2563EB" />
           <path d="M 40 85 C 30 100, 20 100, 30 90 L 50 80 L 70 90 C 80 100, 70 100, 60 85 Z" fill="#2563EB" />
           <path d="M 50 10 C 20 30, 25 70, 50 90 C 75 70, 80 30, 50 10 Z" fill="#3B82F6" />
           <path d="M 50 15 C 35 30, 38 65, 50 80 C 62 65, 65 30, 50 15 Z" fill="#60A5FA" />
           <path d="M 47 40 C 45 60, 50 65, 53 40 Z" fill="#1D4ED8" />
           <circle cx="38" cy="30" r="3.5" fill="#0F172A" />
           <circle cx="37" cy="29" r="1.2" fill="#FFFFFF" />
           <circle cx="62" cy="30" r="3.5" fill="#0F172A" />
           <circle cx="61" cy="29" r="1.2" fill="#FFFFFF" />
           <ellipse cx="33" cy="34" rx="3.5" ry="1.8" fill="#FCA5A5" opacity="0.8"/>
           <ellipse cx="67" cy="34" rx="3.5" ry="1.8" fill="#FCA5A5" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
};

// ─── Experiments Data ────────────────────────────────────────────────────────
// ─── Experiments Data ────────────────────────────────────────────────────────
const EXPERIMENTS = [
  {
    id: 9,
    title: 'AI DESIGN SAUVEER',
    tags: ['AI Design', 'Generative Space', 'Art Direction'],
    video: '/works/AI design Sauveer.mp4',
    size: 'huge',
  },
  {
    id: 14,
    title: 'MOSAIC GENERATIVE',
    tags: ['Generative Art', 'Mosaic Design', 'Creative Code'],
    video: '/works/mosaic.mp4',
    size: 'hero',
  },
  {
    id: 1,
    title: 'AI DESIGN ENGINE',
    tags: ['Creative Coding', 'React'],
    video: '/works/pentagon font.mp4',
    size: 'wide',
  },
  {
    id: 2,
    title: 'SPATIAL PROTOTYPES',
    tags: ['Spatial', 'visionOS', 'SwiftUI'],
    video: '/2.mp4',
    size: 'square',
  },
  {
    id: 3,
    title: 'MOTION INTERACTIVE',
    tags: ['GSAP', 'Open Source', 'Micro-UX'],
    video: '/krizia.mp4',
    size: 'square',
  },
  {
    id: 5,
    title: 'GENERATIVE BRAND',
    tags: ['Interactive Pool', 'Creative Code', 'HTML5 Canvas'],
    isInteractivePool: true,
    size: 'wide',
  },
  {
    id: 4,
    title: 'LEMON NOTES',
    tags: ['Notes', 'Interaction', 'UI'],
    video: '/lemon_notes.mp4',
    size: 'wide',
  },
  {
    id: 15,
    title: 'SNAKE INTERACTION',
    tags: ['Snake Fluid', 'Interaction Design', 'Micro-UX'],
    video: '/works/snake.mp4',
    size: 'wide',
  },
];

function BentoCard({ item, theme, setCursorActive, disableScrollTrigger }) {
  const cardRef = useRef();

  useEffect(() => {
    if (disableScrollTrigger) {
      gsap.set(cardRef.current, { y: 0, opacity: 1 });
      return;
    }
    gsap.fromTo(cardRef.current,
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [disableScrollTrigger]);

  const handleMouseEnter = () => {
    setHovered(true);
    setCursorActive(true);
    
    gsap.to(cardRef.current, {
      y: -3,
      scale: 1.005,
      duration: 0.3,
      ease: 'power2.out',
      borderColor: theme?.text || '#0d0d0d',
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setCursorActive(false);
    
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
      borderColor: 'rgba(13, 13, 13, 0.08)',
    });
  };

  const handleCardClick = () => {
    if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  return (
    <div
      ref={cardRef}
      className={`modern-bento-card bento-${item.size} ${item.isInteractivePool ? 'interactive-pool-card' : ''} ${item.isIframe ? 'bento-iframe-card' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        borderColor: 'rgba(13, 13, 13, 0.08)',
        cursor: item.link ? 'pointer' : 'default',
      }}
    >
      {/* Background Media, Binary Shark Pool, or Embedded Iframe */}
      {item.isInteractivePool ? (
        <BinarySharkPool />
      ) : item.isIframe ? (
        <div className="bento-media-wrap bento-iframe-wrap">
          <iframe
            src={item.iframeSrc}
            frameBorder="0"
            allowFullScreen
            title={item.title}
            className="bento-media-asset bento-media-iframe"
          />
        </div>
      ) : (
        <div className="bento-media-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {item.video ? (
            <video
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              className="bento-media-asset"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <img src={item.image || item.img || item.thumb} alt={item.title} className="bento-media-asset" loading="lazy" style={{ objectFit: 'cover' }} />
          )}
        </div>
      )}

      {/* Content wrapper */}
      <div className="bento-card-info" style={{ pointerEvents: 'none' }}>
        {/* Tags */}
        <div className="bento-card-tags">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="bento-card-tag"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperimentsGrid({ theme, disableScrollTrigger }) {
  const sectionRef = useRef();
  const headingRef = useRef();
  const cursorRef  = useRef();
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    if (disableScrollTrigger) return;
    const ctx = gsap.context(() => {
      // Heading word reveal
      gsap.fromTo('.experiments-title-word',
        { y: '100%', rotateX: -25, opacity: 0 },
        {
          y: '0%', rotateX: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    // Follow mouse quickSetters for custom cursor
    const xSetter = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySetter = gsap.quickSetter(cursorRef.current, "y", "px");

    const onMouseMove = (e) => {
      if (cursorRef.current) {
        const bounds = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        xSetter(x);
        ySetter(y);
      }
    };

    const section = sectionRef.current;
    section.addEventListener('mousemove', onMouseMove);

    return () => {
      ctx.revert();
      section.removeEventListener('mousemove', onMouseMove);
    };
  }, [disableScrollTrigger]);

  return (
    <section 
      ref={sectionRef} 
      className="experiments-section-modern" 
      style={{ 
        backgroundColor: '#FCFAF2',
        padding: disableScrollTrigger ? '20px 0 0 0' : undefined 
      }}
    >
      {/* Minimal Rectangular Custom Cursor (disabled in playground) */}
      {!disableScrollTrigger && (
        <div
          ref={cursorRef}
          className={`bento-custom-cursor ${cursorActive ? 'active' : ''}`}
          style={{
            backgroundColor: theme?.text || '#0d0d0d',
            color: '#FCFAF2',
            border: `2px solid ${theme?.text || '#0d0d0d'}`,
          }}
        >
          <span className="cursor-text">VIEW CASE STUDY</span>
        </div>
      )}

      <div className="experiments-inner">
        {/* Header Section (disabled in playground since playground already has header) */}
        {!disableScrollTrigger && (
          <div ref={headingRef} className="experiments-title-box">
            <span className="experiments-title-tag" style={{ color: theme?.text || '#0d0d0d' }}>
              [ EXPERIMENTS ]
            </span>
            <h2 className="experiments-title-main" style={{ color: theme?.text || '#0d0d0d' }}>
              <span className="experiments-title-line">
                <span className="experiments-title-word">EXPERIMENTS</span>
              </span>
            </h2>
            <p className="experiments-title-descr" style={{ color: 'rgba(13, 13, 13, 0.6)' }}>
              A playful collection of design explorations, prototypes, and digital toys designed to feel intuitive and fun.
            </p>
          </div>
        )}

        {/* Horizontal Bento Grid Layout */}
        <div className="modern-bento-grid">
          {EXPERIMENTS.map((item, i) => (
            <BentoCard
              key={item.id}
              item={item}
              theme={theme}
              setCursorActive={setCursorActive}
              disableScrollTrigger={disableScrollTrigger}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
