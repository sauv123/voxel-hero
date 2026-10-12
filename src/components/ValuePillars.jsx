import React from 'react';

export default function ValuePillars({ theme }) {
  const cardStyle = {
    background: '#111111',
    borderRadius: 8,
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease, transform 0.3s ease',
  };

  const badgeStyle = {
    fontSize: '10px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '4px 10px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#FCFAF2'
  };

  return (
    <div style={{ width: '100%', marginBottom: '40px' }}>
      
      {/* ── Section Label ── */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        <span style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '11px', 
          fontWeight: 800, 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase', 
          color: '#4ade80' 
        }}>
          Employer Value Engine
        </span>
        <span style={{ color: '#FCFAF2', opacity: 0.2 }}>•</span>
        <span style={{ 
          fontFamily: 'var(--font-body)', 
          fontSize: '12px', 
          color: '#FCFAF2', 
          opacity: 0.6 
        }}>
          How I create leverage on product teams
        </span>
      </div>

      {/* ── 4-Pillar Bento Grid (2x2 on Desktop, 1-col on Mobile) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        
        {/* ── Pillar 1: Role Focus & 0-to-1 Scope ── */}
        <div style={cardStyle}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '10px', 
                fontWeight: 800, 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: '#4ade80' 
              }}>
                01 • Role Focus
              </span>
              <span style={{ fontSize: '11px', color: '#FCFAF2', opacity: 0.4, fontFamily: 'var(--font-heading)' }}>
                Target Scope
              </span>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 700, 
              color: '#FCFAF2', 
              margin: '0 0 12px 0',
              lineHeight: 1.2
            }}>
              Product Designer • 0-to-1 Systems
            </h3>

            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '13.5px', 
              lineHeight: 1.6, 
              color: 'rgba(252,250,242,0.78)', 
              margin: '0 0 20px 0' 
            }}>
              I specialize in taking 0-to-1 ambiguity and structuring it into shipped, scalable products. My sweet spot is consumer applications (B2C), fintech, and generative AI interfaces where human trust and simplicity are critical.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={badgeStyle}>B2C Consumer</span>
            <span style={badgeStyle}>Fintech Systems</span>
            <span style={badgeStyle}>Generative AI UX</span>
            <span style={badgeStyle}>0-to-1 Architecture</span>
          </div>
        </div>

        {/* ── Pillar 2: Problems Solved & Outcomes ── */}
        <div style={cardStyle}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '10px', 
                fontWeight: 800, 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: '#4ade80' 
              }}>
                02 • Outcomes & Impact
              </span>
              <span style={{ fontSize: '11px', color: '#FCFAF2', opacity: 0.4, fontFamily: 'var(--font-heading)' }}>
                Metrics That Matter
              </span>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 700, 
              color: '#FCFAF2', 
              margin: '0 0 12px 0',
              lineHeight: 1.2
            }}>
              Calm Experience Over Toxic Urgency
            </h3>

            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '13.5px', 
              lineHeight: 1.6, 
              color: 'rgba(252,250,242,0.78)', 
              margin: '0 0 20px 0' 
            }}>
              I design for sustained user retention and task completion speed rather than shallow gamification tricks. I deconstruct high-friction user journeys into low-cognitive-load interactions that compound into long-term product engagement.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={badgeStyle}>Day-30 Retention</span>
            <span style={badgeStyle}>Low Cognitive Load</span>
            <span style={badgeStyle}>Onboarding Velocity</span>
            <span style={badgeStyle}>Human Agency</span>
          </div>
        </div>

        {/* ── Pillar 3: Team Collaboration & The Code Advantage ── */}
        <div style={cardStyle}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '10px', 
                fontWeight: 800, 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: '#4ade80' 
              }}>
                03 • Team Collaboration
              </span>
              <span style={{ fontSize: '11px', color: '#FCFAF2', opacity: 0.4, fontFamily: 'var(--font-heading)' }}>
                The Code Advantage
              </span>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 700, 
              color: '#FCFAF2', 
              margin: '0 0 12px 0',
              lineHeight: 1.2
            }}>
              Designing with Engineering Reality
            </h3>

            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '13.5px', 
              lineHeight: 1.6, 
              color: 'rgba(252,250,242,0.78)', 
              margin: '0 0 20px 0' 
            }}>
              With an engineering background from MIT Manipal, I prototype directly in React and GSAP. I stress-test responsive breakpoints, animation physics, and API states before engineers write production code. PMs get feasible scopes; engineers get zero-friction handoffs.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={badgeStyle}>React & GSAP</span>
            <span style={badgeStyle}>Frictionless Handoff</span>
            <span style={badgeStyle}>Pragmatic Scoping</span>
            <span style={badgeStyle}>Design Tokens</span>
          </div>
        </div>

        {/* ── Pillar 4: Credibility & Proven Track Record ── */}
        <div style={cardStyle}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '10px', 
                fontWeight: 800, 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: '#4ade80' 
              }}>
                04 • Credibility & Track Record
              </span>
              <span style={{ fontSize: '11px', color: '#FCFAF2', opacity: 0.4, fontFamily: 'var(--font-heading)' }}>
                Verified Proof
              </span>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 700, 
              color: '#FCFAF2', 
              margin: '0 0 12px 0',
              lineHeight: 1.2
            }}>
              Proven Craft Across Companies
            </h3>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#4ade80', fontSize: '12px' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(252,250,242,0.85)' }}>
                  <strong>4+ Years Shipping:</strong> Scaled digital products in India & Europe.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#4ade80', fontSize: '12px' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(252,250,242,0.85)' }}>
                  <strong>foundit (Monster.com APAC):</strong> Enterprise and consumer product workflows.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#4ade80', fontSize: '12px' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(252,250,242,0.85)' }}>
                  <strong>MIT Manipal + Milan Master's:</strong> Systems engineering + European craft.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#4ade80', fontSize: '12px' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(252,250,242,0.85)' }}>
                  <strong>NCA Design Award:</strong> 3rd Place recognized design innovation.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={badgeStyle}>foundit APAC</span>
            <span style={badgeStyle}>B.Tech Manipal</span>
            <span style={badgeStyle}>Master's Milan</span>
            <span style={badgeStyle}>Design Award 🥉</span>
          </div>
        </div>

      </div>

    </div>
  );
}
