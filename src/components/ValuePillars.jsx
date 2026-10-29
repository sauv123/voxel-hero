import React, { useState } from 'react';

export default function ValuePillars({ theme }) {
  const [activePillar, setActivePillar] = useState(null);

  return (
    <div style={{ width: '100%', marginTop: '32px', marginBottom: '48px' }}>
      
      {/* ── Main Editorial Dossier Shell ── */}
      <div style={{
        backgroundColor: '#0e0e10',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Section Header */}
        <div style={{
          padding: '28px 36px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                [OPERATING PHILOSOPHY]
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4ade80'
              }}>
                HOW I SHIP & COLLABORATE
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.35rem, 2.6vw, 2rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: 0
            }}>
              Turning raw ambiguity into calm, scalable digital products.
            </h3>
          </div>

          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            Milan, IT • B2C & SaaS
          </div>
        </div>

        {/* 3 Creative Editorial Modules */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)'
        }}>

          {/* Module 01: Zero-to-One Architecture */}
          <div 
            onMouseEnter={() => setActivePillar(0)}
            onMouseLeave={() => setActivePillar(null)}
            style={{
              padding: '36px 32px',
              backgroundColor: activePillar === 0 ? '#141416' : '#0e0e10',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.3s ease',
              position: 'relative'
            }}
          >
            <div>
              {/* Monogram Index */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em'
                }}>
                  SYS.01
                </span>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  padding: '2px 8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  AMBIGUITY ➔ SYSTEMS
                </span>
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                0 → 1 Product Architecture
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '0 0 24px 0'
              }}>
                I take undefined requirements and technical capabilities and structure them into focused, intuitive interfaces. Whether habit experiences (Olo) or generative installations (/trace at Milano Digital Week), I cut friction without toxic gamification.
              </p>
            </div>

            {/* Spec Footprint */}
            <div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '8px'
              }}>
                CORE FOCUS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['AI-Native UX', 'Consumer Apps', 'Complex PIM Workflows'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Module 02: Design x Engineering Reality */}
          <div 
            onMouseEnter={() => setActivePillar(1)}
            onMouseLeave={() => setActivePillar(null)}
            style={{
              padding: '36px 32px',
              backgroundColor: activePillar === 1 ? '#141416' : '#0e0e10',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.3s ease',
              position: 'relative'
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em'
                }}>
                  SYS.02
                </span>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#4ade80',
                  padding: '2px 8px',
                  background: 'rgba(74, 222, 128, 0.08)',
                  border: '1px solid rgba(74, 222, 128, 0.25)'
                }}>
                  CODE-LITERATE
                </span>
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                Design × Engineering Bridge
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '0 0 24px 0'
              }}>
                Trained in engineering at MIT Manipal and advanced UX at NABA Milan, I don't toss static Figma files over the fence. I build interactive prototypes in React & GSAP, stress-testing states and physics so developers commit code with zero friction.
              </p>
            </div>

            <div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '8px'
              }}>
                COLLABORATION TOOLING
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['React / Code Prototypes', 'Design Systems & Tokens', 'Zero-Friction Handoffs'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Module 03: Measurable Retention & Outcomes */}
          <div 
            onMouseEnter={() => setActivePillar(2)}
            onMouseLeave={() => setActivePillar(null)}
            style={{
              padding: '36px 32px',
              backgroundColor: activePillar === 2 ? '#141416' : '#0e0e10',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.3s ease',
              position: 'relative'
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em'
                }}>
                  SYS.03
                </span>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  padding: '2px 8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  METRICS THAT COMPOUND
                </span>
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                Durable Impact Over Vanity
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '0 0 24px 0'
              }}>
                A design only succeeds when it moves real business needles: Day-30 retention, task velocity, and user confidence. Previous shipped work delivered 2.5× user growth and an 88% engagement uplift through research-led clarity.
              </p>
            </div>

            <div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '8px'
              }}>
                PROVEN SIGNALS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['2.5× User Growth', '+88% Engagement', 'Day-30 Retention'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
