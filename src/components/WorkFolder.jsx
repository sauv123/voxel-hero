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
    shortName: "OLO",
    badge: "B2C • EMOTIONAL UX",
    headline: "Designing for the Quiet",
    roleText: "Product Designer (0 to 1)",
    oneLiner: "An introvert-first mobile habit system built around micro-actions and private reflection.",
  },
  {
    ...PROJECTS[1], // ORCO
    index: "02",
    shortName: "ORCO",
    badge: "HERITAGE • E-COMMERCE",
    headline: "Italian Culinary Reimagined",
    roleText: "Lead UX Designer & Strategist",
    oneLiner: "Transforming a historic Italian food brand into an immersive digital culinary journey.",
  },
  {
    ...PROJECTS[2], // MICA
    index: "03",
    shortName: "MICA",
    badge: "SPATIAL UX • HOUSING",
    headline: "Belonging in Shared Living",
    roleText: "Lead UX Designer",
    oneLiner: "Combating urban loneliness in co-living spaces through emotionally intelligent service design.",
  }
];

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef(null);
  // Default to the first card active, or null
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 860);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Background color scrub to match theme cleanly
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
        maxHeight: isMobile ? 'none' : '1000px',
        padding: isMobile ? '80px 5vw' : '40px 5vw 60px 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ── Top Bar: Title & Global CTA ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.text}20`,
        paddingBottom: '20px',
        marginBottom: isMobile ? '32px' : '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.text,
            opacity: 0.6
          }}>
            Featured Case Studies
          </span>
          <span style={{ color: theme.text, opacity: 0.3 }}>•</span>
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
            transition: 'opacity 0.2s ease',
            opacity: 0.8
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
        >
          <span>View Archive (12+)</span>
          <span style={{ fontSize: '14px' }}>→</span>
        </button>
      </div>

      {/* ── 3-Column Expandable Triptych ── */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '16px',
        flex: 1,
        width: '100%',
        minHeight: isMobile ? 'auto' : '480px',
        position: 'relative'
      }}>
        {FEATURED.map((proj, idx) => {
          const isActive = activeCard === idx;
          // Desktop flex ratio: active card gets 56%, non-active get 22% each
          const flexValue = isMobile ? '1' : (isActive ? 2.5 : 0.85);

          return (
            <div
              key={proj.id}
              onMouseEnter={() => !isMobile && setActiveCard(idx)}
              onClick={() => onOpen(proj.slug)}
              style={{
                flex: flexValue,
                height: isMobile ? '380px' : '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#0a0a0a',
                border: isActive ? `1px solid ${theme.text}40` : `1px solid ${theme.text}15`,
                boxShadow: isActive ? '0 25px 60px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.15)',
                transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '32px'
              }}
            >
              {/* Background Media */}
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
                      opacity: isActive ? 0.75 : 0.35,
                      filter: isActive ? 'none' : 'grayscale(40%)',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)'
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
                      opacity: isActive ? 0.75 : 0.35,
                      filter: isActive ? 'none' : 'grayscale(40%)',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)'
                    }} 
                  />
                )}

                {/* Dark Vignette Overlay for Readability */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
                }}></div>
              </div>

              {/* ── Top Info Layer ── */}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#ffffff',
                  opacity: isActive ? 1 : 0.5,
                  letterSpacing: '0.05em',
                  transition: 'opacity 0.3s'
                }}>
                  {proj.index}
                </span>

                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  {proj.badge}
                </span>
              </div>

              {/* ── Bottom Content Layer ── */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Project Title */}
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: isMobile ? '2.2rem' : (isActive ? 'clamp(2.4rem, 4vw, 3.8rem)' : '1.8rem'),
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: '0 0 10px 0',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  transition: 'font-size 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {proj.shortName}
                </h3>

                {/* Headline */}
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: isActive ? '1.15rem' : '0.95rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: isActive ? '12px' : '4px',
                  lineHeight: 1.3,
                  transition: 'all 0.3s'
                }}>
                  {proj.headline}
                </div>

                {/* Expanded Details: Role & Summary (Fade in smoothly on active) */}
                <div style={{
                  maxHeight: (isActive || isMobile) ? '200px' : '0px',
                  opacity: (isActive || isMobile) ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#39FF14',
                    marginBottom: '8px'
                  }}>
                    {proj.roleText}
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.75)',
                    margin: '0 0 20px 0',
                    maxWidth: '440px'
                  }}>
                    {proj.oneLiner}
                  </p>

                  {/* Direct Case Study CTA */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s ease'
                  }}>
                    <span>Explore Case Study</span>
                    <span style={{ fontSize: '13px' }}>↗</span>
                  </div>
                </div>

                {/* Collapsed state prompt (shows when not active on desktop) */}
                {!isActive && !isMobile && (
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: '8px'
                  }}>
                    Hover to expand →
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Bar: Direct Summary & Quick Access ── */}
      <div style={{
        marginTop: isMobile ? '24px' : '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.text}15`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: theme.text,
          opacity: 0.6
        }}>
          Hover or tap any project to reveal design rationale, deliverables, and interactive prototype.
        </div>

        <button 
          onClick={() => onOpen('work')}
          style={{
            background: 'none',
            border: `1px solid ${theme.text}30`,
            color: theme.text,
            padding: '8px 20px',
            borderRadius: '100px',
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.text;
            e.currentTarget.style.color = theme.bg;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.text;
          }}
        >
          Browse Full Gallery (12 Projects) →
        </button>
      </div>

    </section>
  );
}
