import React, { useState } from 'react';
import manipalImg from "../assets/PXL_20230613_050806226.webp";
import founditImg from "../assets/IMG_128640.webp";
import mumbaiImg from "../assets/IMG_5539.webp";
import milanImg from "../assets/Screenshot 2026-06-01 at 11.17.15 AM.webp";
import ncaImg from "../assets/1745310056phpNlbiko.webp";

const MILESTONES = [
  {
    id: 'naba-milan',
    period: '2024 – 2026',
    status: 'CURRENT',
    role: 'MA User Experience Design',
    org: 'NABA (Nuova Accademia di Belle Arti)',
    location: 'Milan, Italy',
    description: 'Specializing in emerging technologies, service innovation, and human-centred systems. Appointed to the AI Academic Integrity Committee. Selected for STEP Project FuturAbility District at Milano Digital Week 2026 for /trace.',
    tags: ['Human-Centred AI', 'Service Innovation', 'Emerging Tech', 'NABA Academic Board'],
    media: { src: milanImg, caption: 'NABA MILAN', type: 'image' }
  },
  {
    id: 'nca-awards',
    period: '2024',
    status: 'AWARD',
    role: '🥉 3rd Place — NCA Design Awards',
    org: 'National / International Design Awards',
    location: 'Milan / Global',
    description: 'Won Bronze Medal internationally in the Interaction & Digital Design category, recognized by an expert jury for rigorous craft, research depth, and interaction innovation.',
    tags: ['Interaction Design', 'Jury Recognition', 'Digital Craft'],
    media: { src: ncaImg, caption: '🥉 NCA BRONZE', type: 'image' }
  },
  {
    id: 'solo-product',
    period: '2024',
    status: 'SHIPPED',
    role: 'Product Creator & Developer',
    org: 'Independent Digital Product',
    location: 'Mumbai / Remote',
    description: 'Designed and shipped an independent macOS productivity tool from zero to live release. Owned full-stack execution: user research, high-fidelity Figma UI, React/Tauri code, and launch distribution.',
    tags: ['0 → 1 Shipping', 'macOS Software', 'Full Ownership'],
    media: { videoSrc: '/product.mp4', caption: 'PRODUCT_V1', type: 'video' }
  },
  {
    id: 'mumbai-products',
    period: '2023 – 2024',
    status: 'STARTUP',
    role: 'Product Designer',
    org: 'Hobbytribe & e-tailize',
    location: 'Mumbai, India',
    description: 'Led end-to-end design across web & mobile contributing to 2.5× user growth within 3 months and a ₹1.2 Cr funding round at Hobbytribe. Built a multi-brand tokenized design system from scratch and redesigned complex PIM workflows at e-tailize (+12% enterprise adoption).',
    tags: ['2.5× Growth', '100+ User Interviews', 'Design Systems', 'B2B & B2C'],
    media: { src: mumbaiImg, caption: 'MUMBAI', type: 'image' }
  },
  {
    id: 'foundit-bengaluru',
    period: '2023',
    status: 'ENTERPRISE',
    role: 'Associate Product Designer',
    org: 'foundit (formerly Monster APAC)',
    location: 'Bengaluru, India',
    description: 'Began design career at a major APAC talent platform. Worked on candidate discovery workflows, search filtering, and onboarding funnels across high-traffic mobile and web applications.',
    tags: ['Candidate Discovery', 'APAC Scale', 'Recruitment Tech'],
    media: { src: founditImg, caption: 'FOUNDIT', type: 'image' }
  },
  {
    id: 'mit-manipal',
    period: '2019 – 2023',
    status: 'EDUCATION',
    role: 'B.Tech Print & Media Engineering',
    org: 'Manipal Institute of Technology',
    location: 'Manipal, India',
    description: 'Rigorous engineering curriculum covering production technology, typography, visual communication, image processing, and color science. Formed the bridge between technical discipline and design intuition.',
    tags: ['Engineering Degree', 'Color Science', 'Typography', 'Production Systems'],
    media: { src: manipalImg, caption: 'MANIPAL', type: 'image' }
  }
];

export default function WhereIveBeenSection({ theme }) {
  const [activeMedia, setActiveMedia] = useState(null);

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
            <span>✦ WHERE I'VE BEEN</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>EXPERIENCE & EDUCATION</span>
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
            Chronological ledger of shipped work & studies.
          </h2>
        </div>

        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          6 Milestones • 2019 — Present
        </span>
      </div>

      {/* ── Open Architectural Ledger (No cramped 400px inner scrollbar) ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {MILESTONES.map((item, idx) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#111113',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px 28px',
              display: 'grid',
              gridTemplateColumns: 'minmax(140px, 180px) 1fr auto',
              gap: '24px',
              alignItems: 'center',
              transition: 'background-color 0.25s ease, border-color 0.25s ease',
              position: 'relative'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#161619';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#111113';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {/* Column 1: Dates & Location */}
            <div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                fontWeight: 700,
                color: item.status === 'CURRENT' ? '#4ade80' : '#ffffff',
                letterSpacing: '0.04em',
                marginBottom: '6px'
              }}>
                {item.period}
              </div>

              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10.5px',
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {item.location}
              </div>

              {item.status === 'CURRENT' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '8px',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.1)',
                  padding: '2px 7px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                  ACTIVE
                </div>
              )}
            </div>

            {/* Column 2: Role, Org & Detailed Impact */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '6px'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em'
                }}>
                  {item.role}
                </h3>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>/</span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)'
                }}>
                  {item.org}
                </span>
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.68)',
                margin: '0 0 12px 0',
                maxWidth: '720px'
              }}>
                {item.description}
              </p>

              {/* Skill & Proof Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.tags.map(t => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '9.5px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.75)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 3: Thumbnail Preview Card */}
            <div>
              <div
                style={{
                  width: '90px',
                  height: '110px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#1a1a1e',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                }}
              >
                {item.media.type === 'video' ? (
                  <video
                    src={item.media.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={item.media.src}
                    alt={item.media.caption}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                <div style={{
                  position: 'absolute',
                  bottom: '3px',
                  right: '3px',
                  left: '3px',
                  fontSize: '7.5px',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(4px)',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {item.media.caption}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
