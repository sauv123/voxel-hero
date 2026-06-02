import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PROJECTS } from './InteractiveProjects';

export default function ProjectViewer({ activeIndex, onClose, theme }) {
  const containerRef = useRef(null);
  const [activeIframeUrl, setActiveIframeUrl] = React.useState(null);

  // Duplicate projects 3 times to allow infinite scroll wrapping
  const duplicatedProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];
  const itemsCount = PROJECTS.length;
  // Start in the middle block to allow scrolling up or down
  const startIndex = itemsCount + activeIndex;

  useEffect(() => {
    if (containerRef.current) {
      const vh = window.innerHeight;
      containerRef.current.scrollTop = startIndex * vh;
    }

    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    
    // Prevent body scroll behind overlay
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [startIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop } = containerRef.current;
    
    const vh = window.innerHeight;
    const blockHeight = itemsCount * vh;

    // If scrolled into the first block, jump to the middle block
    if (scrollTop < vh) {
      containerRef.current.scrollTop = scrollTop + blockHeight;
    }
    // If scrolled into the third block, jump back to the middle block
    else if (scrollTop > blockHeight * 2 - vh) {
      containerRef.current.scrollTop = scrollTop - blockHeight;
    }
  };

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, y: 100, duration: 0.5, ease: 'power3.in',
      onComplete: onClose
    });
  };

  return (
    <>
      <div 
        ref={containerRef}
      onScroll={handleScroll}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: theme.bg,
        zIndex: 500,
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'auto', // Important: auto allows instantaneous jumps
        fontFamily: "var(--font-heading)"
      }}
    >
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 40, right: 40,
          zIndex: 510,
          background: theme.text,
          color: theme.bg,
          border: 'none',
          borderRadius: '50%',
          width: 48, height: 48,
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${theme.text}40`,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ✕
      </button>

      {duplicatedProjects.map((proj, i) => (
        <div 
          key={`${proj.id}-${i}`}
          style={{
            height: '100vh',
            width: '100vw',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: proj.bgColor,
            color: proj.textColor
          }}
        >
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {proj.img ? (
              proj.img.endsWith('.mp4') ? (
                <video 
                  src={proj.img} 
                  autoPlay loop muted playsInline 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '100px 40px' }} 
                />
              ) : (
                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '100px 40px' }} 
                />
              )
            ) : (
              <div style={{ fontSize: 120, opacity: 0.2 }}>🎨</div>
            )}
          </div>

          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: '120px 60px 60px 60px',
            background: `linear-gradient(to top, ${proj.bgColor} 50%, transparent)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            pointerEvents: 'none' // Let clicks pass through background
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {proj.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, fontWeight: 700, fontFamily: "var(--font-body)",
                    padding: '6px 16px', border: `1.5px solid ${proj.textColor}40`, borderRadius: 20,
                    letterSpacing: '0.05em', textTransform: 'uppercase'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 style={{ fontSize: 'clamp(48px, 6vw, 100px)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                {proj.title}
              </h2>
              <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 600, marginTop: 24, fontWeight: 500 }}>
                {proj.cta}
              </p>
            </div>

            {proj.link && (
              <button 
                onClick={() => setActiveIframeUrl(proj.link)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                style={{
                  pointerEvents: 'auto',
                  background: proj.textColor,
                  color: proj.bgColor,
                  padding: '20px 40px',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'transform 0.2s',
                  boxShadow: `0 8px 32px ${proj.textColor}40`,
                  display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                Explore Project <span>→</span>
              </button>
            )}
          </div>
        </div>
      ))}
      </div>

      {/* Embedded Iframe Overlay - Rendered OUTSIDE scroll container */}
      {activeIframeUrl && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: theme.bg,
          zIndex: 9999,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            height: 60,
            background: theme.text,
            color: theme.bg,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Preview</span>
            <button 
              onClick={() => setActiveIframeUrl(null)}
              style={{
                background: 'transparent', color: theme.bg, border: `1px solid ${theme.bg}40`,
                padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              Close Preview
            </button>
          </div>
          <iframe 
            src={activeIframeUrl} 
            title="Project Preview"
            style={{ width: '100%', flex: 1, border: 'none' }}
          />
        </div>
      )}
    </>
  );
}
