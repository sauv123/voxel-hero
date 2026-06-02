import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import useIdle from '../hooks/useIdle';

export default function BottomDrawer({ theme, activePage, navigateWithTransition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const isIdle = useIdle(2000);

  const toggleDrawer = () => {
    if (animating) return;
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    if (animating) return;
    setIsOpen(false);
  };

  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const heroContainer = document.querySelector('.hero-container');
    const workSection = document.querySelector('.work-section');
    
    if (isOpen) {
      setAnimating(true);
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
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) closeDrawer();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
          <div className={`drawer-item ${activePage === 'home' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'home')}>
            <div className="drawer-item-icon" style={{ background: activePage === 'home' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activePage === 'home' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activePage === 'home' ? theme.brand : '#FCFAF2' }}>Home</span>
                <span className="label-copy" style={{ color: theme.brand }}>Home</span>
              </div>
            </div>
            {activePage === 'home' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </div>

          {/* HOBBIES */}
          <div className={`drawer-item ${activePage === 'playground' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'playground')}>
            <div className="drawer-item-icon" style={{ background: activePage === 'playground' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activePage === 'playground' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activePage === 'playground' ? theme.brand : '#FCFAF2' }}>Playground</span>
                <span className="label-copy" style={{ color: theme.brand }}>Playground</span>
              </div>
            </div>
            {activePage === 'playground' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </div>

          {/* WORK */}
          <div className={`drawer-item ${activePage === 'work' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'work')}>
            <div className="drawer-item-icon" style={{ background: activePage === 'work' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activePage === 'work' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activePage === 'work' ? theme.brand : '#FCFAF2' }}>Work</span>
                <span className="label-copy" style={{ color: theme.brand }}>Work</span>
              </div>
            </div>
            {activePage === 'work' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </div>

          {/* ABOUT */}
          <div className={`drawer-item ${activePage === 'about' ? 'active-page' : ''}`} onClick={(e) => handleItemClick(e, 'about')}>
            <div className="drawer-item-icon" style={{ background: activePage === 'about' ? theme.brand : '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 24 24" fill={activePage === 'about' ? '#0d0d0d' : '#FCFAF2'} className="di-icon-svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="drawer-item-text">
              <div className="drawer-item-text-inner">
                <span className="label-original" style={{ color: activePage === 'about' ? theme.brand : '#FCFAF2' }}>About</span>
                <span className="label-copy" style={{ color: theme.brand }}>About</span>
              </div>
            </div>
            {activePage === 'about' && <span className="drawer-item-active-dot" style={{ background: theme.brand, width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', marginRight: 16 }} />}
          </div>

        </div>


      </div>




      {/* BOTTOM BAR */}
      <div 
        className={`glass-island-menu ${isOpen ? 'drawer-open' : ''}`}
        style={{
          opacity: (isIdle && !isOpen) ? 0 : 1,
          pointerEvents: (isIdle && !isOpen) ? 'none' : 'auto',
          transition: 'opacity 0.4s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // preserving original transform transition if any, but opacity is the key here. The CSS probably handles transform.
        }}
      >
        <div className="glass-island-inner" onClick={toggleDrawer}>
          <div className="glass-island-icon">
            <div className={`hamburger-icon ${isOpen ? 'close' : ''}`}>
              <span/><span/>
            </div>
          </div>
          <div className="glass-island-text">{isOpen ? 'CLOSE MENU' : 'EXPLORE'}</div>
        </div>
      </div>
    </>
  );
}
