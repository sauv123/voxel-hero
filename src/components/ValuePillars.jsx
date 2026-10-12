import React from 'react';

export default function ValuePillars({ theme }) {
  const columnStyle = {
    padding: '32px 28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    boxSizing: 'border-box'
  };

  const tagStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '5px 12px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#FCFAF2',
    border: '1px solid rgba(255,255,255,0.12)'
  };

  return (
    <div style={{ width: '100%', marginTop: '36px', marginBottom: '60px' }}>
      
      {/* ── Main Editorial Ledger ── */}
      <div style={{
        backgroundColor: '#111111',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Top Header Bar */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#4ade80',
              marginBottom: '6px'
            }}>
              Product Designer • Craft & Philosophy
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Designing human-centered consumer systems from zero-to-one.
            </div>
          </div>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'rgba(252,250,242,0.5)',
            letterSpacing: '0.04em'
          }}>
            Milan, Italy • Available for select roles
          </div>
        </div>

        {/* 3-Column Editorial Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          divideX: '1px solid rgba(255,255,255,0.08)'
        }}>
          
          {/* Column 01: Role Focus & Problem Solving */}
          <div style={{ ...columnStyle, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px'
              }}>
                01 / Role Focus & Ambiguity
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 12px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}>
                Navigating 0-to-1 Product Reality
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: 'rgba(252,250,242,0.75)',
                margin: '0 0 24px 0'
              }}>
                I take raw concepts and technical capabilities and structure them into calm, high-agency consumer applications. Whether architecting introvert-first habit loops (Olo), modernizing legacy Italian culinary commerce (Orco), or structuring co-living spatial UX (MICA), I eliminate friction without relying on toxic gamification.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={tagStyle}>B2C Consumer</span>
              <span style={tagStyle}>Fintech Systems</span>
              <span style={tagStyle}>Generative AI UX</span>
            </div>
          </div>

          {/* Column 02: Cross-Functional & Code Advantage */}
          <div style={{ ...columnStyle, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px'
              }}>
                02 / Team Collaboration
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 12px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}>
                Designing with Engineering Reality
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: 'rgba(252,250,242,0.75)',
                margin: '0 0 24px 0'
              }}>
                Coming from an engineering background at MIT Manipal, I don't toss static Figma mockups over the wall. I prototype directly in React and GSAP, stress-testing animation physics, responsive layouts, and edge cases before engineering commits code. PMs get predictable scopes; developers get friction-free handoffs.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={tagStyle}>React & GSAP</span>
              <span style={tagStyle}>Dev Handoffs</span>
              <span style={tagStyle}>Design Tokens</span>
            </div>
          </div>

          {/* Column 03: Outcomes & Philosophy */}
          <div style={columnStyle}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px'
              }}>
                03 / Business Outcomes
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 12px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}>
                Durable Retention Over Vanity Hype
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: 'rgba(252,250,242,0.75)',
                margin: '0 0 24px 0'
              }}>
                A design only works if it moves the company's core metrics: Day-30 retention, onboarding completion velocity, and user autonomy. I prioritize human focus and clarity over anxiety-inducing notification loops. Good design compounds value over years, not just Dribbble likes.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={tagStyle}>Day-30 Retention</span>
              <span style={tagStyle}>Low Cognitive Load</span>
              <span style={tagStyle}>Task Velocity</span>
            </div>
          </div>

        </div>

        {/* Bottom Credibility Strip */}
        <div style={{
          padding: '20px 32px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)'
          }}>
            Track Record & Credentials
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            fontFamily: 'var(--font-body)',
            fontSize: '12.5px',
            color: '#FCFAF2'
          }}>
            <span><strong>4+ Years</strong> Shipping Software</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong>foundit</strong> (Monster.com APAC)</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong>B.Tech</strong> MIT Manipal</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong>Master's in Design</strong> Milan</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong>NCA Design Award</strong> 🥉</span>
          </div>
        </div>

      </div>

    </div>
  );
}
