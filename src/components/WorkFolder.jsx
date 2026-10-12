import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';
import LazyVideo from './LazyVideo';

gsap.registerPlugin(ScrollTrigger);

const FEATURED = [
  {
    ...PROJECTS[0], // OLO
    index: "01",
    displayName: "OLO",
    description: "An introvert-first mobile habit experience built around micro-actions and private reflection.",
    tags: PROJECTS[0].tags || ["EMOTIONAL DESIGN", "UX", "UI"]
  },
  {
    ...PROJECTS[1], // ORCO
    index: "02",
    displayName: "REDESIGNING ORCO",
    description: "Transforming a heritage Italian food brand into an interactive culinary experience.",
    tags: PROJECTS[1].tags || ["UX DESIGN", "WEB DESIGN", "BRANDING"]
  },
  {
    ...PROJECTS[2], // MICA
    index: "03",
    displayName: "MICA",
    description: "Designing belonging through emotionally intelligent co-living housing experiences.",
    tags: PROJECTS[2].tags || ["UX DESIGN", "CO-LIVING DESIGN"]
  }
];

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef(null);
  const magneticBtnRef = useRef(null);
  // Default to Orco (index 1) as requested
  const [activeCard, setActiveCard] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 860);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        end: "top 20%",
        scrub: 1.2,
        onUpdate: (self) => {
          const blendedColor = gsap.utils.interpolate('#000000', '#FFFFFF', self.progress);
          gsap.set([document.documentElement, document.body], { backgroundColor: blendedColor });
        }
      });
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Magnetic button physics
  const handleBtnMouseMove = (e) => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

    if (dist < 140) {
      const pullX = (e.clientX - cx) * 0.35;
      const pullY = (e.clientY - cy) * 0.35;
      gsap.to(btn, { x: pullX, y: pullY, duration: 0.25, ease: 'power2.out' });
    }
  };

  const handleBtnMouseLeave = () => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1.2, 0.3)' });
  };

  return (
    <section 
      ref={sectionRef} 
      style={{
        width: '100vw',
        minHeight: isMobile ? 'auto' : '100vh',
        height: isMobile ? 'auto' : '100vh',
        maxHeight: isMobile ? 'none' : '1040px',
        padding: isMobile ? '60px 5vw 120px 5vw' : '40px 5vw 160px 5vw',
        marginBottom: '100px', // Generous space before Products I've built
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ── Top Bar: Just Selected Works ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.text}20`,
        paddingBottom: '16px',
        marginBottom: isMobile ? '24px' : '24px'
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: theme.text,
          opacity: 0.6
        }}>
          Selected Works
        </span>
      </div>

      {/* ── 3-Column Expandable Triptych ── */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '16px',
        flex: 1,
        width: '100%',
        minHeight: isMobile ? 'auto' : '520px',
        position: 'relative'
      }}>
        {FEATURED.map((proj, idx) => {
          const isActive = activeCard === idx;
          const flexValue = isMobile ? '1' : (isActive ? 2.5 : 0.85);

          return (
            <div
              key={proj.id}
              data-cursor-text="VIEW CASE STUDY ↗"
              onMouseEnter={() => !isMobile && setActiveCard(idx)}
              onClick={() => onOpen(proj.slug)}
              style={{
                flex: flexValue,
                height: isMobile ? '380px' : '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#111111',
                border: 'none', // No stroke as requested
                boxShadow: 'none', // No shadow as requested
                transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: isMobile ? '24px' : '32px'
              }}
            >
              {/* Background Media — Crisp, Bright, Vibrant */}
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                overflow: 'hidden'
              }}>
                {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                  <LazyVideo 
                    src={proj.img} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: proj.objectPosition || 'center',
                      opacity: 1,
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.03)' : 'scale(1)'
                    }} 
                  />
                ) : (
                  <img 
                    src={proj.img} 
                    alt={proj.name} 
                    loading="lazy" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: proj.objectPosition || 'center',
                      opacity: 1,
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.03)' : 'scale(1)'
                    }} 
                  />
                )}

                {/* Subtle text gradient strictly at bottom for legibility */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)'
                }}></div>
              </div>

              {/* ── Top Info Layer: Index ── */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.05em',
                  opacity: isActive ? 1 : 0.6
                }}>
                  {proj.index}
                </span>
              </div>

              {/* ── Bottom Content Layer ── */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                
                {/* Project Tags — ONLY SHOW ON HOVER / ACTIVE */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '10px',
                  opacity: (isActive || isMobile) ? 1 : 0,
                  transform: (isActive || isMobile) ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  height: (isActive || isMobile) ? 'auto' : '0px',
                  overflow: 'hidden'
                }}>
                  {proj.tags.map(tag => (
                    <span 
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.9)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(6px)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Name */}
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: isMobile ? '2rem' : (isActive ? 'clamp(2.2rem, 3.8vw, 3.4rem)' : '1.8rem'),
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: '0 0 8px 0',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  transition: 'font-size 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}>
                  {proj.displayName}
                </h3>

                {/* Project Description — Always present on active card */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                  maxWidth: '480px',
                  opacity: (isActive || isMobile) ? 1 : 0,
                  maxHeight: (isActive || isMobile) ? '80px' : '0px',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {proj.description}
                </p>

              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Section: Big Magnetic CTA Button with Generous Space ── */}
      <div 
        style={{
          marginTop: isMobile ? '40px' : '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <button 
          ref={magneticBtnRef}
          onClick={() => onOpen('work')}
          onMouseMove={handleBtnMouseMove}
          onMouseLeave={handleBtnMouseLeave}
          style={{
            padding: '22px 60px',
            borderRadius: '100px',
            border: `1px solid ${theme.text}40`,
            backgroundColor: 'transparent',
            color: theme.text,
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.text;
            e.currentTarget.style.color = theme.bg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.text;
          }}
        >
          <span>View All Work</span>
          <span style={{ fontSize: '15px' }}>→</span>
        </button>
      </div>

    </section>
  );
}
