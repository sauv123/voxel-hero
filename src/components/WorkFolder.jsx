import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';
import LazyVideo from './LazyVideo';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_PROJECTS = [
  {
    ...PROJECTS[0], // OLO
    index: "01",
    label: "OLO",
    category: "B2C Consumer • Habit Systems",
    roleText: "Product Designer (End-to-End)",
    timeline: "5 Months (0-to-1)",
    tagline: "Designing for the Quiet.",
    summary: "Traditional habit apps rely on streaks, leaderboards, and anxiety-driven urgency. I designed an introvert-first mobile experience where calm micro-actions and private reflective journaling compound into durable real-world confidence.",
    deliverables: ["Product Architecture", "React Prototype", "Brand Launch Film"]
  },
  {
    ...PROJECTS[1], // ORCO
    index: "02",
    label: "ORCO",
    category: "Heritage Brand • Digital Commerce",
    roleText: "Lead UX Designer & Strategist",
    timeline: "3 Months",
    tagline: "A Century of Italian Gastronomy, Digitized.",
    summary: "Transforming an iconic Italian pantry brand into an interactive digital culinary experience. Preserved decades of tangible supermarket packaging equity while modernizing recipe discovery and interactive web commerce.",
    deliverables: ["Interactive E-Commerce", "Motion Systems", "Design System"]
  },
  {
    ...PROJECTS[2], // MICA
    index: "03",
    label: "MICA",
    category: "Spatial UX • Co-Living Systems",
    roleText: "Lead UX Designer",
    timeline: "4 Months",
    tagline: "Designing Belonging in Shared Urban Living.",
    summary: "Combating urban isolation through emotionally intelligent co-living software. Engineered flatmate compatibility matching, quiet conflict-resolution interfaces, and community rituals to turn temporary spaces into genuine homes.",
    deliverables: ["Service Blueprint", "Mobile App UX", "User Research"]
  }
];

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const cardRefs = useRef([]);
  const textDossierRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Background color scrub to match theme smoothly
    ScrollTrigger.create({
      trigger: section,
      start: "top 95%",
      end: "top 15%",
      scrub: 1.2,
      onUpdate: (self) => {
        const blendedColor = gsap.utils.interpolate('#000000', '#FFFFFF', self.progress);
        gsap.set([document.documentElement, document.body], { backgroundColor: blendedColor });
      }
    });

    // Mobile check
    const isDesktop = window.innerWidth >= 960;

    let pinTrigger;
    if (isDesktop && leftColRef.current) {
      // Pin the left column while the right column scrolls
      pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });
    }

    // ScrollTriggers for updating active project as each card enters the center
    const cardTriggers = cardRefs.current.map((card, idx) => {
      if (!card) return null;
      return ScrollTrigger.create({
        trigger: card,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActiveIndex(idx),
        onEnterBack: () => setActiveIndex(idx)
      });
    });

    return () => {
      if (pinTrigger) pinTrigger.kill();
      cardTriggers.forEach(t => t && t.kill());
    };
  }, []);

  // Animate the left text whenever activeIndex changes
  useEffect(() => {
    if (!textDossierRef.current) return;
    gsap.fromTo(textDossierRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
  }, [activeIndex]);

  const activeProj = FEATURED_PROJECTS[activeIndex] || FEATURED_PROJECTS[0];

  const scrollToCard = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="work-dossier-section"
      style={{
        width: '100vw',
        minHeight: '220vh',
        position: 'relative',
        padding: '120px 6vw',
        boxSizing: 'border-box',
        overflow: 'visible'
      }}
    >
      {/* ── Section Header / Breadcrumb ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.text}20`,
        paddingBottom: '24px',
        marginBottom: '60px'
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
            Selected Works
          </span>
          <span style={{ color: theme.text, opacity: 0.2 }}>/</span>
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
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: theme.text,
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
        >
          View Full Archive (12+) ↗
        </button>
      </div>

      {/* ── 50/50 Split Grid ── */}
      <div className="dossier-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '6vw',
        alignItems: 'start',
        position: 'relative'
      }}>
        
        {/* ── LEFT COLUMN: Sticky Dossier ── */}
        <div 
          ref={leftColRef} 
          className="dossier-sticky-col"
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: '20px'
          }}
        >
          {/* Project Tab Selector */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
            {FEATURED_PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => scrollToCard(idx)}
                style={{
                  background: activeIndex === idx ? theme.text : 'transparent',
                  color: activeIndex === idx ? theme.bg : theme.text,
                  border: `1px solid ${activeIndex === idx ? theme.text : theme.text + '30'}`,
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{proj.index}</span>
                <span>{proj.label}</span>
              </button>
            ))}
          </div>

          {/* Dossier Content Card */}
          <div ref={textDossierRef} style={{ maxWidth: '520px' }}>
            {/* Category Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: theme.text,
              opacity: 0.6,
              marginBottom: '12px'
            }}>
              {activeProj.category}
            </div>

            {/* Giant Title */}
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: theme.text,
              margin: '0 0 16px 0',
              lineHeight: 1
            }}>
              {activeProj.name}
            </h2>

            {/* Tagline / Subheading */}
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: theme.text,
              lineHeight: 1.4,
              marginBottom: '24px'
            }}>
              {activeProj.tagline}
            </div>

            {/* Executive Summary Paragraph */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: theme.text,
              opacity: 0.8,
              marginBottom: '32px'
            }}>
              {activeProj.summary}
            </p>

            {/* Metadata Grid (Role, Timeline) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              borderTop: `1px solid ${theme.text}15`,
              borderBottom: `1px solid ${theme.text}15`,
              padding: '20px 0',
              marginBottom: '36px'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, color: theme.text, marginBottom: '6px' }}>My Role</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: theme.text }}>{activeProj.roleText}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, color: theme.text, marginBottom: '6px' }}>Timeline & Scope</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: theme.text }}>{activeProj.timeline}</div>
              </div>
            </div>

            {/* Deliverables / Tags Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
              {activeProj.deliverables.map((item) => (
                <span 
                  key={item} 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: theme.text,
                    backgroundColor: `${theme.text}08`,
                    border: `1px solid ${theme.text}15`,
                    padding: '6px 14px',
                    borderRadius: '100px'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Primary Action Button */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => onOpen(activeProj.slug)}
                style={{
                  padding: '18px 40px',
                  borderRadius: '100px',
                  backgroundColor: theme.text,
                  color: theme.bg,
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 35px rgba(0,0,0,0.22)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                }}
              >
                <span>Read Full Case Study</span>
                <span style={{ fontSize: '15px' }}>↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Scrolling Media Showcases ── */}
        <div className="dossier-scroll-col" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '120px',
          paddingTop: '20px'
        }}>
          {FEATURED_PROJECTS.map((proj, idx) => (
            <div
              key={proj.id}
              ref={el => cardRefs.current[idx] = el}
              onClick={() => onOpen(proj.slug)}
              style={{
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#0a0a0a',
                border: `1px solid ${theme.text}20`,
                boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 40px 100px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.25)';
              }}
            >
              {/* Media Container */}
              <div style={{
                width: '100%',
                aspectRatio: '16/11',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#0d0d0d'
              }}>
                {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                  <LazyVideo 
                    src={proj.img} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: proj.objectPosition || 'center' 
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
                      objectPosition: proj.objectPosition || 'center' 
                    }} 
                  />
                )}

                {/* Subtle Hover Pill */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  {proj.index} • Click to open
                </div>
              </div>

              {/* Bottom Card Footer Banner */}
              <div style={{
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#111111',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800 }}>{proj.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', fontSize: '13px', marginTop: '4px' }}>{proj.roleText}</div>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px'
                }}>
                  ↗
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom Section CTA ── */}
      <div style={{
        marginTop: '120px',
        textAlign: 'center',
        padding: '60px 0',
        borderTop: `1px solid ${theme.text}15`
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: theme.text,
          opacity: 0.5,
          marginBottom: '16px'
        }}>
          Curious to explore more experiments, prototypes & client work?
        </div>
        <button
          onClick={() => onOpen('work')}
          style={{
            padding: '22px 56px',
            borderRadius: '100px',
            border: `2px solid ${theme.text}`,
            backgroundColor: 'transparent',
            color: theme.text,
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.text;
            e.currentTarget.style.color = theme.bg;
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.text;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          View Complete Portfolio Archive (12 Projects) →
        </button>
      </div>

    </section>
  );
}
