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
    tags: PROJECTS[0].tags || ["EMOTIONAL DESIGN", "UX", "UI"]
  },
  {
    ...PROJECTS[1], // ORCO
    index: "02",
    displayName: "REDESIGNING ORCO",
    tags: PROJECTS[1].tags || ["UX DESIGN", "WEB DESIGN", "BRANDING"]
  },
  {
    ...PROJECTS[2], // MICA
    index: "03",
    displayName: "MICA",
    tags: PROJECTS[2].tags || ["UX DESIGN", "CO-LIVING DESIGN"]
  }
];

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);
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

  return (
    <section 
      ref={sectionRef} 
      style={{
        width: '100vw',
        minHeight: isMobile ? 'auto' : '100vh',
        height: isMobile ? 'auto' : '100vh',
        maxHeight: isMobile ? 'none' : '1020px',
        padding: isMobile ? '60px 5vw' : '40px 5vw 40px 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.text}20`,
        paddingBottom: '16px',
        marginBottom: isMobile ? '24px' : '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
          <span style={{ color: theme.text, opacity: 0.3 }}>/</span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: theme.text
          }}>
            01 — 03
          </span>
        </div>

        <button 
          onClick={() => onOpen('work')}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.75,
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
        >
          <span>View Archive (12+)</span>
          <span style={{ fontSize: '13px' }}>↗</span>
        </button>
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
          const flexValue = isMobile ? '1' : (isActive ? 2.4 : 0.85);

          return (
            <div
              key={proj.id}
              onMouseEnter={() => !isMobile && setActiveCard(idx)}
              onClick={() => onOpen(proj.slug)}
              style={{
                flex: flexValue,
                height: isMobile ? '360px' : '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#111111',
                border: isActive ? `1px solid ${theme.text}40` : `1px solid ${theme.text}15`,
                boxShadow: isActive ? '0 30px 70px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.12)',
                transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: isMobile ? '24px' : '32px'
              }}
            >
              {/* Background Media — Crisp, Bright, Vibrant (No dark gloomy wash) */}
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

                {/* Subtle Text Contrast Shield (Only at bottom & top, leaving the rest vibrant) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 35%, transparent 60%)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
                }}></div>
              </div>

              {/* ── Top Info Layer ── */}
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
                  opacity: isActive ? 1 : 0.7
                }}>
                  {proj.index}
                </span>

                {/* On-Hover CTA: VIEW CASE STUDY (Smoothly appears on active) */}
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: (isActive || isMobile) ? 1 : 0,
                  transform: (isActive || isMobile) ? 'translateX(0)' : 'translateX(8px)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}>
                  <span>View Case Study</span>
                  <span style={{ fontSize: '13px' }}>↗</span>
                </div>
              </div>

              {/* ── Bottom Content Layer ── */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Project Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '12px'
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
                        backgroundColor: 'rgba(0,0,0,0.45)',
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
                  margin: 0,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  transition: 'font-size 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}>
                  {proj.displayName}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Minimal Bottom Footer ── */}
      <div style={{
        marginTop: isMobile ? '20px' : '16px',
        paddingTop: '14px',
        borderTop: `1px solid ${theme.text}15`,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => onOpen('work')}
          style={{
            background: 'none',
            border: 'none',
            color: theme.text,
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            padding: '4px 0'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
        >
          Explore All 12+ Projects in Full Gallery →
        </button>
      </div>

    </section>
  );
}
