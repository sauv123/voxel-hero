import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function WorkGallery({ onClose, navigate }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const dragDistance = useRef(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredProjectTitle, setHoveredProjectTitle] = useState("Project");
  const customCursorRef = useRef(null);

  // Custom smooth horizontal scroll state
  const targetX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: '100vh',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: '100vh' },
      { opacity: 1, y: '0vh', duration: 0.8, ease: 'power4.out', clearProps: 'transform' }
    );
    
    document.body.style.overflow = 'hidden';
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (customCursorRef.current) {
        gsap.to(customCursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50,
          duration: 0.15,
          overwrite: "auto",
          ease: "power2.out"
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => { 
      document.body.style.overflow = 'auto'; 
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // GSAP buttery smooth scroll logic
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.innerWidth < 768) return; // Let native touch scroll handle on mobile
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        targetX.current -= e.deltaX * 1.5;
      } else {
        targetX.current -= e.deltaY * 1.5;
      }
    };
    const handlePointerDown = (e) => {
      isDragging.current = true;
      startX.current = e.clientX || (e.touches && e.touches[0].clientX);
      dragDistance.current = 0;
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const diff = Math.abs(x - startX.current);
      dragDistance.current = diff;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleGalleryKeys = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (window.innerWidth < 768) return;
      if (e.key === 'ArrowRight') targetX.current -= window.innerWidth * 0.4;
      if (e.key === 'ArrowLeft') targetX.current += window.innerWidth * 0.4;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('keydown', handleGalleryKeys);

    const ticker = gsap.ticker.add(() => {
      const isMob = window.innerWidth < 768;
      
      // If mobile, read native scroll position to sync progress bar
      if (isMob) {
        if (containerRef.current) {
          const sLeft = containerRef.current.scrollLeft;
          const sWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
          setScrollProgress(sWidth > 0 ? sLeft / sWidth : 0);
        }
        return;
      }

      const center = window.innerWidth / 2;
      const padding = window.innerWidth * 0.2;
      const cardWidth = window.innerWidth * 0.6;
      const gap = window.innerWidth * 0.1;

      // Clamp targetX
      const totalWidth = PROJECTS.length * (cardWidth + gap);
      const minScroll = -(totalWidth - window.innerWidth + padding * 2);
      targetX.current = Math.max(Math.min(targetX.current, 0), minScroll);

      // Lerp for smooth momentum
      currentX.current += (targetX.current - currentX.current) * 0.08;
      
      if (trackRef.current) {
        gsap.set(trackRef.current, { x: currentX.current });
      }

      // Sync progress
      const progress = minScroll !== 0 ? currentX.current / minScroll : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = currentX.current + padding + (cardWidth + gap) * i + cardWidth / 2;
        const dist = Math.abs(center - cardCenter);
        const maxDist = window.innerWidth;
        const progress = Math.min(dist / maxDist, 1);
        
        const scale = 1 - progress * 0.15;
        const opacity = 1 - progress * 0.5;
        const rotateY = (cardCenter - center) * 0.015;

        gsap.set(card, {
          scale: scale,
          opacity: opacity,
          rotateY: rotateY,
          transformPerspective: 1000,
          transformOrigin: 'center center'
        });
      });
    });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('keydown', handleGalleryKeys);
      gsap.ticker.remove(ticker);
    };
  }, []);

  const openCaseStudy = (proj) => {
    if (navigate) {
      navigate(proj.slug);
    }
  };

  return (
    <>
      <div 
        ref={containerRef} 
        role="dialog"
        aria-modal="true"
        aria-label="Work Gallery"
        style={{ 
          backgroundColor: '#0a0a0a', 
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 180,
          display: 'flex',
          alignItems: 'center',
          overflowX: isMobile ? 'auto' : 'hidden', // Allow native swipe scroll on mobile
          overflowY: 'hidden',
          scrollSnapType: isMobile ? 'x mandatory' : 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Floating Top Back/Exit Header */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 200,
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ 
              fontSize: '10px', 
              fontFamily: 'Elms Sans, monospace', 
              color: 'rgba(255,255,255,0.4)', 
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              CASE STUDIES / {PROJECTS.length} PROJECTS
            </span>
            
            {/* Relocated Scroll Progress & Navigation Cue */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${scrollProgress * 100}%`, height: '100%', background: '#ffffff', transition: 'width 0.1s ease-out' }}></div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-heading)',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                <span>{isMobile ? 'Swipe' : 'Drag / Scroll'}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bobX 1.6s infinite ease-in-out' }}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
          

        </div>

        <div 
          ref={trackRef}
          className="work-gallery-track"
          style={{ 
            display: 'flex', 
            height: '100%',
            alignItems: 'center',
            gap: isMobile ? '24px' : '10vw',
            padding: isMobile ? '0 24px' : '0 20vw',
            cursor: isHoveringCard && !isMobile ? 'none' : 'grab',
            willChange: 'transform'
          }}
        >
          {PROJECTS.map((proj, i) => (
            <div 
              key={proj.id}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${proj.title}`}
              ref={el => cardsRef.current[i] = el}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openCaseStudy(proj);
                }
              }}
              onClick={() => {
                if (dragDistance.current > 10) return;
                openCaseStudy(proj);
              }}
              onMouseEnter={() => {
                setHoveredProjectTitle(proj.cursorCta || proj.title);
                if (customCursorRef.current && !isMobile) {
                  setIsHoveringCard(true);
                  gsap.to(customCursorRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
                }
              }}
              onMouseLeave={() => {
                if (!isMobile) {
                  setIsHoveringCard(false);
                  gsap.to(customCursorRef.current, { scale: 0, opacity: 0, duration: 0.2 });
                }
              }}
              className="work-gallery-card"
              style={{
                height: isMobile ? '65vh' : '72vh',
                width: isMobile ? 'calc(100vw - 48px)' : '60vw',
                minWidth: isMobile ? 'calc(100vw - 48px)' : '60vw',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: proj.bgColor,
                color: proj.textColor,
                cursor: 'pointer',
                flexShrink: 0,
                borderRadius: '8px',
                border: 'none',
                overflow: 'hidden',
                scrollSnapAlign: isMobile ? 'center' : 'none',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {proj.img ? (
                  (proj.img.endsWith('.mp4') || proj.img.endsWith('.mov')) ? (
                    <video 
                      src={proj.img} 
                      autoPlay loop muted playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: proj.objectPosition || 'center' }} 
                    />
                  ) : (
                    <img 
                      src={proj.img} 
                      alt={proj.title} 
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: proj.objectPosition || 'center' }} 
                    />
                  )
                ) : (
                  <div style={{ fontSize: 120, opacity: 0.2 }}>🎨</div>
                )}
              </div>

              {/* Title / Description Info overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: isMobile ? '30px 24px 24px' : '50px 40px 40px',
                background: `linear-gradient(to top, ${proj.bgColor}f2 30%, ${proj.bgColor}99 75%, transparent)`,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                gap: isMobile ? '24px' : '40px',
                pointerEvents: 'none'
              }}>
                {/* Left Side: Title & Info */}
                <div style={{ pointerEvents: 'auto', flex: 1, maxWidth: isMobile ? '100%' : '60%' }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(32px, 4vw, 64px)', fontWeight: 500, margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: 0.9 }}>
                    {proj.title}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {proj.role && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? '12px' : '13px', margin: 0, opacity: 0.65, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {proj.role}
                      </p>
                    )}
                    {proj.cta && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? '14px' : '16px', margin: 0, opacity: 0.9, lineHeight: 1.5, fontWeight: 400 }}>
                        {proj.cta}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Tags */}
                <div style={{ 
                  pointerEvents: 'auto', 
                  display: 'flex', 
                  gap: 8, 
                  flexWrap: 'wrap', 
                  justifyContent: isMobile ? 'flex-start' : 'flex-end',
                  maxWidth: isMobile ? '100%' : '40%'
                }}>
                  {proj.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '10px', fontWeight: 600, fontFamily: "var(--font-body)",
                      padding: '6px 14px', border: `1px solid ${proj.textColor}30`, borderRadius: 100,
                      letterSpacing: '0.05em', textTransform: 'uppercase', background: `${proj.bgColor}80`, backdropFilter: 'blur(8px)',
                      color: proj.textColor
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom Cursor */}
        {!isMobile && (
          <div 
            ref={customCursorRef}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              padding: '8px 16px',
              backgroundColor: '#FCFAF2',
              color: '#0d0d0d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              zIndex: 9999,
              transform: 'translate(-50%, -50%)',
              opacity: 0,
              scale: 0,
              border: '2px solid #FCFAF2',
              boxShadow: '4px 4px 0px rgba(255, 255, 255, 0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            {hoveredProjectTitle}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bobX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
      `}</style>
    </>
  );
}
