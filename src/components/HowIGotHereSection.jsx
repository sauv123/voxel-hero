import React from 'react';

export default function HowIGotHereSection({ theme }) {
  const chapters = [
    {
      num: '01',
      period: '2019 – 2023',
      location: 'Manipal, IN',
      title: 'Print, Code & Systematic Thinking',
      text: 'Started with a B.Tech in Print & Media Engineering at MIT Manipal. It gave me a foundation in color physics, typography, grid geometry, and production constraints. I learned early that high design ambition requires engineering feasibility.',
      badge: 'B.Tech MIT Manipal · Systems & Code',
      accentColor: '#38bdf8' // Sky Blue
    },
    {
      num: '02',
      period: '2023 – 2024',
      location: 'Mumbai, IN',
      title: 'Shipping 0 → 1 & Moving Real Numbers',
      text: 'Moved to Mumbai and jumped into 0-to-1 product delivery at Hobbytribe and e-tailize. Led 100+ user interviews, designed multi-brand token systems from scratch, and drove 2.5× user growth while supporting a ₹1.2 Cr investment round.',
      badge: '2.5× Growth · 100+ Interviews · ₹1.2 Cr Round',
      accentColor: '#4ade80' // Mint Green
    },
    {
      num: '03',
      period: '2024 – Present',
      location: 'Milan, IT',
      title: 'Human-Centred AI & Sensory Interfaces',
      text: 'Moved to Milan for an MA in UX at NABA. Appointed to the AI Academic Integrity Committee and selected for Milano Digital Week 2026 for /trace. Today, I turn complex AI capabilities into calm, emotionally intelligent digital products.',
      badge: 'NABA Milan · AI Integrity Board · MDW 2026',
      accentColor: '#fb923c' // Warm Amber
    }
  ];

  return (
    <div style={{ width: '100%', marginTop: '36px', marginBottom: '40px' }}>
      {/* ── Section Header ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#4ade80',
          marginBottom: '8px'
        }}>
          <span>✦ HOW I GOT HERE</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>THE NARRATIVE</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          margin: '0 0 10px 0'
        }}>
          A product designer built on engineering.
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.72)',
          maxWidth: '720px',
          margin: 0,
          lineHeight: 1.55
        }}>
          From print and code systems in India, to shipping 0→1 consumer products in Mumbai, to human-centred AI interfaces and sensory generative design in Milan.
        </p>
      </div>

      {/* ── 3 Chapters Responsive Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {chapters.map((ch) => (
          <div
            key={ch.num}
            style={{
              backgroundColor: '#121214',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.25s ease, transform 0.25s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top Accent Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: ch.accentColor,
              opacity: 0.85
            }} />

            <div>
              {/* Chapter Meta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: ch.accentColor
                }}>
                  CHAPTER {ch.num} • {ch.period}
                </span>

                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.04em'
                }}>
                  {ch.location}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: '0 0 12px 0'
              }}>
                {ch.title}
              </h3>

              {/* Story Body */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.72)',
                margin: '0 0 20px 0'
              }}>
                {ch.text}
              </p>
            </div>

            {/* Bottom Proof Chip */}
            <div style={{
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: ch.accentColor
              }} />
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.85)',
                letterSpacing: '0.04em'
              }}>
                {ch.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
