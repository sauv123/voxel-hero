import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function WorkGallery({ theme, onClose, navigate }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredProjectTitle, setHoveredProjectTitle] = useState("Project");
  const customCursorRef = useRef(null);

  // Custom smooth horizontal scroll state
  const targetX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTargetX = useRef(0);

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
      targetX.current -= (e.deltaY + e.deltaX) * 1.5;
      clampTarget();
    };

    const handlePointerDown = (e) => {
      isDragging.current = true;
      startX.current = e.clientX || e.touches?.[0].clientX;
      startTargetX.current = targetX.current;
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const x = e.clientX || e.touches?.[0].clientX;
      targetX.current = startTargetX.current + (x - startX.current) * 2;
      clampTarget();
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const clampTarget = () => {
      const isMob = window.innerWidth < 768;
      const padding = isMob ? window.innerWidth * 0.075 : window.innerWidth * 0.2;
      const cardWidth = isMob ? window.innerWidth * 0.85 : window.innerWidth * 0.6;
      const gap = isMob ? window.innerWidth * 0.05 : window.innerWidth * 0.1;
      const totalWidth = PROJECTS.length * cardWidth + (PROJECTS.length - 1) * gap;
      const maxScroll = -(totalWidth - window.innerWidth + padding * 2);
      
      targetX.current = Math.max(maxScroll, Math.min(0, targetX.current));
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Keyboard ESC listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Initial clamp in case of resize
    clampTarget();

    const ticker = gsap.ticker.add(() => {
      // Lerp for smooth momentum
      currentX.current += (targetX.current - currentX.current) * 0.08;
      
      if (trackRef.current) {
        gsap.set(trackRef.current, { x: currentX.current });
      }

      const isMob = window.innerWidth < 768;
      const center = window.innerWidth / 2;
      const padding = isMob ? window.innerWidth * 0.075 : window.innerWidth * 0.2;
      const cardWidth = isMob ? window.innerWidth * 0.85 : window.innerWidth * 0.6;
      const gap = isMob ? window.innerWidth * 0.05 : window.innerWidth * 0.1;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = currentX.current + padding + (cardWidth + gap) * i + cardWidth / 2;
        const dist = Math.abs(center - cardCenter);
        const maxDist = window.innerWidth;
        const progress = Math.min(dist / maxDist, 1);
        
        // Dynamic scale & subtle 3D rotate
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
      window.removeEventListener('keydown', handleKeyDown);
      gsap.ticker.remove(ticker);
    };
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: '100vh',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  const openCaseStudy = (proj, index) => {
    if (proj.link && navigate) {
      navigate(proj.slug);
    }
  };

  return (
    <>
      <div 
        ref={containerRef} 
        style={{ 
          backgroundColor: '#0a0a0a', 
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div 
          ref={trackRef}
          style={{ 
            display: 'flex', 
            height: '100vh',
            alignItems: 'center',
            gap: isMobile ? '5vw' : '10vw',
            padding: isMobile ? '0 7.5vw' : '0 20vw',
            cursor: isHoveringCard ? 'none' : 'grab',
            willChange: 'transform'
          }}
          onMouseDown={e => e.currentTarget.style.cursor = 'grabbing'}
          onMouseUp={e => e.currentTarget.style.cursor = 'grab'}
          onMouseLeave={e => e.currentTarget.style.cursor = 'grab'}
        >
          {PROJECTS.map((proj, i) => (
            <div 
              key={proj.id}
              ref={el => cardsRef.current[i] = el}
              onClick={() => openCaseStudy(proj, i)}
              onMouseEnter={() => {
                setIsHoveringCard(true);
                setHoveredProjectTitle(proj.title);
                gsap.to(customCursorRef.current, { scale: 1, opacity: 1, duration: 0.2 });
              }}
              onMouseLeave={() => {
                setIsHoveringCard(false);
                gsap.to(customCursorRef.current, { scale: 0, opacity: 0, duration: 0.2 });
              }}
              className="modern-brutal-card"
              style={{
                height: isMobile ? '70vh' : '80vh',
                width: isMobile ? '85vw' : '60vw',
                minWidth: isMobile ? '85vw' : '60vw',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: proj.bgColor,
                color: proj.textColor,
                cursor: proj.link ? 'none' : 'default',
                flexShrink: 0,
                borderRadius: '4px',
                border: 'none',
                boxShadow: 'none',
                overflow: 'hidden'
              }}
            >
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {proj.img ? (
                  proj.img.endsWith('.mp4') ? (
                    <video 
                      src={proj.img} 
                      autoPlay loop muted playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <img 
                      src={proj.img} 
                      alt={proj.title} 
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )
                ) : (
                  <div style={{ fontSize: 120, opacity: 0.2 }}>🎨</div>
                )}
              </div>

              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '60px 40px 40px 40px',
                background: `linear-gradient(to top, ${proj.bgColor} 80%, transparent)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                pointerEvents: 'none'
              }}>
                <div style={{ pointerEvents: 'auto' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {proj.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 700, fontFamily: "var(--font-body)",
                        padding: '6px 16px', border: `1.5px solid ${proj.textColor}40`, borderRadius: 20,
                        letterSpacing: '0.05em', textTransform: 'uppercase', background: `${proj.bgColor}CC`, backdropFilter: 'blur(4px)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(32px, 4vw, 64px)', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: 0.9 }}>
                    {proj.title}
                  </h2>
                  {proj.cta && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', margin: 0, opacity: 0.8, maxWidth: '80%' }}>
                      {proj.cta}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom Cursor */}
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
            fontSize: '12px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            scale: 0,
            border: '2px solid #FCFAF2',
            boxShadow: '4px 4px 0px rgba(255, 255, 255, 0.2)'
          }}
        >
          View<br/>{hoveredProjectTitle}
        </div>
      </div>

    </>
  );
}
