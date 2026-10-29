import React, { useState } from 'react';

// 6 Realistic Sticky Notes with Manager & Recruiter Content
const STICKY_NOTES_DATA = [
  {
    id: 'note-01',
    category: 'SPECIALIZATION',
    paperBg: '#FEF08A', // Classic 3M Canary Yellow
    topBand: '#FDE047',
    inkColor: '#1C1917',
    subInk: '#44403C',
    tagBg: 'rgba(0, 0, 0, 0.08)',
    tagColor: '#1C1917',
    angleDeg: -1.2,
    number: '01',
    headline: 'AI-Native Interfaces & Complex Systems',
    body: 'Product Designer turning ambiguous, multi-modal capabilities into calm, human-centred interfaces. Experienced with conversational UX, LLM output hierarchy, and agentic workflows (e.g. /trace generative blockchain visualizer at Milano Digital Week 2026).',
    keyPoints: ['AI-Native UX & LLM Outputs', 'Generative Interfaces', 'B2C & Enterprise SaaS']
  },
  {
    id: 'note-02',
    category: 'BUSINESS IMPACT',
    paperBg: '#DCFCE7', // Soft Mint Green
    topBand: '#BBF7D0',
    inkColor: '#052E16',
    subInk: '#14532D',
    tagBg: 'rgba(5, 46, 22, 0.08)',
    tagColor: '#052E16',
    angleDeg: 1.5,
    number: '02',
    headline: '2.5× User Growth & Scaled Products',
    body: 'At Hobbytribe (Mumbai), led end-to-end design across web & mobile from 0 to 1. Conducted 100+ qualitative user interviews, synthesized discovery funnels, and partnered with leadership on strategic pitch decks contributing to a ₹1.2 Cr investment round.',
    keyPoints: ['0 → 1 Product Delivery', '100+ User Interviews', '₹1.2 Cr Investment Round']
  },
  {
    id: 'note-03',
    category: 'SYSTEMS & SCALE',
    paperBg: '#E0F2FE', // Soft Sky Blue
    topBand: '#BAE6FD',
    inkColor: '#082F49',
    subInk: '#0C4A6E',
    tagBg: 'rgba(8, 47, 73, 0.08)',
    tagColor: '#082F49',
    angleDeg: -1.4,
    number: '03',
    headline: 'Design Systems & Enterprise Architecture',
    body: 'At e-tailize, architected a comprehensive multi-brand design system from scratch (semantic tokens, auto-layout components, WCAG AA standards) and redesigned complex PIM catalog workflows, driving a 12% boost in enterprise adoption.',
    keyPoints: ['Multi-brand Token Architecture', 'Complex PIM Workflows', '+12% Enterprise Growth']
  },
  {
    id: 'note-04',
    category: 'TECH × DESIGN',
    paperBg: '#FFE4E6', // Soft Terracotta Rose
    topBand: '#FECDD3',
    inkColor: '#4C0519',
    subInk: '#831843',
    tagBg: 'rgba(76, 5, 25, 0.08)',
    tagColor: '#4C0519',
    angleDeg: 1.1,
    number: '04',
    headline: 'Engineer’s Logic, Designer’s Eye',
    body: 'B.Tech in Print & Media Engineering (MIT Manipal) combined with an MA in UX Design (NABA Milan). I prototype directly in code (React, GSAP, Three.js), speak frontend fluently, and bridge technical constraints with aesthetic polish.',
    keyPoints: ['B.Tech Engineering + MA UX', 'React · GSAP · Three.js', 'Zero-Friction Dev Handoff']
  },
  {
    id: 'note-05',
    category: 'RECOGNITION',
    paperBg: '#F3E8FF', // Soft Studio Lavender
    topBand: '#E9D5FF',
    inkColor: '#2E1065',
    subInk: '#3B0764',
    tagBg: 'rgba(46, 16, 101, 0.08)',
    tagColor: '#2E1065',
    angleDeg: -0.9,
    number: '05',
    headline: '🥉 NCA Award & Academic Integrity Board',
    body: 'Won 3rd Place at the prestigious NCA Design Awards for digital interaction design. Appointed to the AI Academic Integrity Committee at NABA Milan, advising faculty on ethical generative AI integration in design education.',
    keyPoints: ['🥉 NCA Design Award (3rd Place)', 'NABA AI Integrity Committee', 'Milano Digital Week Exhibitor']
  },
  {
    id: 'note-06',
    category: 'EXECUTION',
    paperBg: '#FFEDD5', // Soft Warm Peach
    topBand: '#FED7AA',
    inkColor: '#431407',
    subInk: '#7C2D12',
    tagBg: 'rgba(67, 20, 7, 0.08)',
    tagColor: '#431407',
    angleDeg: 1.4,
    number: '06',
    headline: 'Ideas with a Pulse (Rapid Prototyping)',
    body: 'Fast, interactive prototypes beat endless static slides. I build clickable artifacts early so stakeholders, users, and developers can test reality. Highly collaborative, transparent, and motivated by high ownership and low ego.',
    keyPoints: ['Interactive Over Static', 'Direct Stakeholder Alignment', 'High Ownership & Low Ego']
  },
];

export default function HumanStickersSection({ theme }) {
  const [activeNote, setActiveNote] = useState(null);

  return (
    <div style={{ width: '100%', marginTop: '36px', marginBottom: '44px' }}>
      {/* ── Section Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
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
            <span>✦ AT A GLANCE</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>FOR HIRING MANAGERS & RECRUITERS</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: 0
          }}>
            Key strengths, track record & working craft.
          </h2>
        </div>

        {/* View My Resume Button */}
        <a 
          href="https://sauv123.github.io/paper-resume/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '100px',
            color: '#000000',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(255,255,255,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
          }}
        >
          <span>View My Resume</span>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>↗</span>
        </a>
      </div>

      {/* ── 6 Realistic Sticky Notes Grid (No Neon Glow, Physical Paper Feel) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {STICKY_NOTES_DATA.map((note) => {
          const isSelected = activeNote === note.id;

          return (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveNote(isSelected ? null : note.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveNote(isSelected ? null : note.id);
                }
              }}
              style={{
                backgroundColor: note.paperBg,
                color: note.inkColor,
                borderRadius: '2px',
                padding: '24px 22px 20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: `rotate(${note.angleDeg}deg) scale(${isSelected ? 1.02 : 1})`,
                /* Realistic Physical Sticky Note Shadows (No Neon Glow) */
                boxShadow: isSelected
                  ? '0 20px 30px -10px rgba(0, 0, 0, 0.55), 0 8px 12px -4px rgba(0, 0, 0, 0.35)'
                  : '0 8px 18px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                cursor: 'pointer',
                userSelect: 'none',
                minHeight: '260px'
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.transform = `rotate(0deg) translateY(-6px) scale(1.015)`;
                  e.currentTarget.style.boxShadow = '0 18px 28px -8px rgba(0, 0, 0, 0.55), 0 6px 12px -3px rgba(0, 0, 0, 0.35)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.transform = `rotate(${note.angleDeg}deg) translateY(0) scale(1)`;
                  e.currentTarget.style.boxShadow = '0 8px 18px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.25)';
                }
              }}
            >
              {/* Top Adhesive Band (Physical 3M Post-It Strip) */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '14px',
                backgroundColor: note.topBand,
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                pointerEvents: 'none'
              }} />

              {/* Bottom Subtle Corner Lift Shadow */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, transparent 55%, rgba(0, 0, 0, 0.08) 55%)',
                pointerEvents: 'none'
              }} />

              {/* Header: Category Tag & Note Number */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '6px',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: note.tagColor,
                  backgroundColor: note.tagBg,
                  padding: '3px 8px',
                  borderRadius: '3px'
                }}>
                  {note.category}
                </span>

                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  opacity: 0.55,
                  letterSpacing: '0.06em'
                }}>
                  #{note.number}
                </span>
              </div>

              {/* Content: Professional Headline & Body */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: note.inkColor,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  margin: '0 0 10px 0'
                }}>
                  {note.headline}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: note.subInk,
                  margin: 0,
                  fontWeight: 450
                }}>
                  {note.body}
                </p>
              </div>

              {/* Recruiter Highlights Chips */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px dashed rgba(0, 0, 0, 0.14)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px'
              }}>
                {note.keyPoints.map((point, pIdx) => (
                  <span
                    key={pIdx}
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      color: note.inkColor,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '3px 7px',
                      borderRadius: '2px',
                      letterSpacing: '0.02em'
                    }}
                  >
                    • {point}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
