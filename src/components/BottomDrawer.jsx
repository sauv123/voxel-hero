import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
// Voxel imports removed

export default function BottomDrawer({ theme, activeNav, navigateWithTransition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);

  const toggleDrawer = () => {
    if (animating) return;
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    const heroContainer = document.querySelector('.hero-container');
    const workSection = document.querySelector('.work-section');
    setAnimating(true);

    if (nextState) {
      const tl = gsap.timeline({ onComplete: () => setAnimating(false) });
      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0);
      tl.to([heroContainer, workSection], { 
        filter: 'blur(8px) saturate(0.8) brightness(0.7)',
        scale: 1.02,
        duration: 0.5,
        ease: "power3.out"
      }, 0);
      tl.to(drawerRef.current, {
        y: "0%",
        duration: 0.7,
        ease: "expo.out"
      }, 0);
      tl.fromTo('.drawer-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.2)" },
        0.2
      );
    } else {
      const tl = gsap.timeline({ onComplete: () => setAnimating(false) });
      tl.to(drawerRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in"
      }, 0);
      tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1);
      tl.to([heroContainer, workSection], { 
        filter: 'blur(0px) saturate(1) brightness(1)',
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.1);
    }
  };

  const closeDrawer = useCallback(() => {
    if (animating || !isOpen) return;
    setIsOpen(false);
    
    const heroContainer = document.querySelector('.hero-container');
    const workSection = document.querySelector('.work-section');
    setAnimating(true);

    const tl = gsap.timeline({ onComplete: () => setAnimating(false) });
    tl.to(drawerRef.current, {
      y: "100%",
      duration: 0.5,
      ease: "power3.in"
    }, 0);
    tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1);
    tl.to([heroContainer, workSection], { 
      filter: 'blur(0px) saturate(1) brightness(1)',
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0.1);
  }, [isOpen, animating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) closeDrawer();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  useEffect(() => {
    if (!linksRef.current) return;
    const innerMenu = document.querySelector('.glass-island-inner');
    const heroContainer = document.querySelector('.hero-container');
    const workSection = document.querySelector('.work-section');

    if (isHovered && !isOpen) {
      gsap.killTweensOf(linksRef.current);
      if (linksRef.current.children) gsap.killTweensOf(linksRef.current.children);
      gsap.killTweensOf('.drawer-title-animate');

      gsap.to('.drawer-title-animate', { x: 0, duration: 0.2 });

      gsap.to(linksRef.current, {
        width: '320px',
        opacity: 1,
        paddingLeft: 24,
        paddingRight: 16,
        duration: 0.6,
        ease: 'expo.out'
      });

      gsap.fromTo(linksRef.current.children, 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );
      
      // Expand pill slightly
      if (innerMenu) {
        gsap.to(innerMenu, {
          background: '#121212',
          backdropFilter: 'none',
          boxShadow: 'none',
          duration: 0.4,
          ease: 'expo.out'
        });
      }

      // Blur background slightly like opening the drawer
      if (heroContainer && workSection) {
        gsap.to([heroContainer, workSection], { 
          filter: 'blur(3px) saturate(0.9) brightness(0.85)',
          scale: 1.01,
          duration: 0.5,
          ease: 'expo.out'
        });
      }

    } else if (!isOpen) {
      gsap.killTweensOf(linksRef.current);
      if (linksRef.current.children) gsap.killTweensOf(linksRef.current.children);
      gsap.killTweensOf('.drawer-title-animate');

      gsap.to('.drawer-title-animate', { x: 0, duration: 0.4, delay: 0.2 });

      gsap.to(linksRef.current, {
        width: 0,
        opacity: 0,
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.4,
        ease: 'power3.inOut'
      });

      if (innerMenu) {
        gsap.to(innerMenu, {
          background: '#121212',
          backdropFilter: 'none',
          boxShadow: 'none',
          duration: 0.4,
          ease: 'power3.inOut'
        });
      }

      if (heroContainer && workSection) {
        gsap.to([heroContainer, workSection], { 
          filter: 'blur(0px) saturate(1) brightness(1)',
          scale: 1,
          duration: 0.4,
          ease: 'power3.inOut'
        });
      }
    }
  }, [isHovered, isOpen]);

  const handleItemClick = (e, target) => {
    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    ripple.style.background = `${theme.text}30`;
    e.currentTarget.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    closeDrawer();
    if (navigateWithTransition) {
      navigateWithTransition(target);
    }
  };

  return (
    <>
      {/* DRAWER OVERLAY */}
      <div 
        ref={overlayRef}
        className={`drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeDrawer}
        aria-hidden="true"
      ></div>

      {/* DRAWER */}
      <div ref={drawerRef} className={`drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Header label */}
        <div className="drawer-header-label">
          <span>NAVIGATION</span>
          <span style={{ opacity: 0.3 }}>ESC to close</span>
        </div>

        <div className="drawer-items">

          {/* HOME */}
          <button className={`drawer-item ${activeNav === 'home' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'home')} aria-current={activeNav === 'home' ? 'page' : undefined}>
            <div className="drawer-item-icon" style={{ background: activeNav === 'home' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activeNav === 'home' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activeNav === 'home' ? theme.brand : '#FCFAF2' }}>Home</span>
                <span className="label-copy" style={{ color: theme.brand }}>Home</span>
              </div>
            </div>
            {activeNav === 'home' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </button>

          {/* WORK */}
          <button className={`drawer-item ${activeNav === 'work' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'work')} aria-current={activeNav === 'work' ? 'page' : undefined}>
            <div className="drawer-item-icon" style={{ background: activeNav === 'work' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activeNav === 'work' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activeNav === 'work' ? theme.brand : '#FCFAF2' }}>Work</span>
                <span className="label-copy" style={{ color: theme.brand }}>Work</span>
              </div>
            </div>
            {activeNav === 'work' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </button>

          {/* ABOUT */}
          <button className={`drawer-item ${activeNav === 'about' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'about')} aria-current={activeNav === 'about' ? 'page' : undefined}>
            <div className="drawer-item-icon" style={{ background: activeNav === 'about' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activeNav === 'about' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activeNav === 'about' ? theme.brand : '#FCFAF2' }}>About</span>
                <span className="label-copy" style={{ color: theme.brand }}>About</span>
              </div>
            </div>
            {activeNav === 'about' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </button>

          {/* PLAYGROUND */}
          <button className={`drawer-item ${activeNav === 'playground' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'playground')} aria-current={activeNav === 'playground' ? 'page' : undefined}>
            <div className="drawer-item-icon" style={{ background: activeNav === 'playground' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activeNav === 'playground' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activeNav === 'playground' ? theme.brand : '#FCFAF2' }}>Labs</span>
                <span className="label-copy" style={{ color: theme.brand }}>Labs</span>
              </div>
            </div>
            {activeNav === 'playground' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </button>

        </div>


      </div>




      {/* BOTTOM BAR */}
      <div 
        className={`glass-island-menu ${isOpen ? 'drawer-open' : ''}`}
        onMouseEnter={() => typeof window !== 'undefined' && window.innerWidth > 768 && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: 1,
          pointerEvents: 'auto',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Voxel Character removed per user request */}

        <div 
          className="glass-island-inner" 
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDrawer();
            }
          }}
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth > 768) {
              return; // Do not open drawer on desktop click
            }
            toggleDrawer();
          }}
          style={{
            background: '#121212',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderRadius: '16px',
            padding: '8px 16px 8px 8px',
            boxShadow: 'none',
            gap: '14px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
            /* transition removed to prevent GSAP conflict */
          }}
        >
          {/* Left Side: White Avatar Square Box (Fills completely, no gaps, enlarged to 56px) */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src="/sauveerpp.webp" 
              alt="SAUVEER" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.3)'
              }}
            />
          </div>

          {/* Middle Section: Text Titles / Voxel Character */}
          <div className="drawer-title-animate" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            width: '80px',
            height: '40px',
            justifyContent: 'center'
          }}>
            {/* Voxel Character was moved outside this container to avoid backdrop-filter clipping */}

            {/* Text Title */}
            <div style={{
              opacity: 1,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff',
                lineHeight: 1.2
              }}>
                {isOpen ? 'CLOSE MENU' : 'SAUVEER'}
              </span>
              {isOpen && (
                <span style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.02em',
                  marginTop: '1px',
                  textTransform: 'uppercase'
                }}>
                  Return to site
                </span>
              )}
            </div>
          </div>

          {/* Inline Links on Hover (Desktop) */}
          <div ref={linksRef} style={{ display: 'flex', gap: '32px', overflow: 'hidden', width: 0, opacity: 0, alignItems: 'center' }}>
            {['home', 'work', 'about', 'playground'].map(page => (
              <div 
                key={page} 
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemClick(e, page);
                  }
                }}
                onClick={(e) => { e.stopPropagation(); handleItemClick(e, page); }}
                className="inline-nav-item"
                style={{ position: 'relative' }}
              >
                <div className="inline-nav-item-inner">
                  <span className="inline-nav-label" style={{ color: activeNav === page ? theme.brand : '#fff', opacity: activeNav === page ? 1 : 0.6 }}>{page === 'playground' ? 'Labs' : page}</span>
                  <span className="inline-nav-label" style={{ color: theme.brand }}>{page === 'playground' ? 'Labs' : page}</span>
                </div>
                {activeNav === page && (
                  <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: theme.brand }} />
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Animated 3-line sandwich button (all bars same size: 20px) */}
          <div className="hamburger-container" style={{
            width: '20px',
            height: '14px',
            display: typeof window !== 'undefined' && window.innerWidth > 768 ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: '8px',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            <span style={{ 
              width: '20px', 
              height: '2px', 
              backgroundColor: isOpen ? '#ffffff' : theme.brand, 
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'none'
            }} />
            <span style={{ 
              width: '20px', 
              height: '2px', 
              backgroundColor: isOpen ? '#ffffff' : theme.brand, 
              transition: 'all 0.2s ease',
              opacity: isOpen ? 0 : 1
            }} />
            <span style={{ 
              width: '20px', 
              height: '2px', 
              backgroundColor: isOpen ? '#ffffff' : theme.brand, 
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'none'
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
