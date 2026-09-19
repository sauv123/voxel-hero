import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function CaseStudyViewer({ startIndex, onClose }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  

  const clickedProj = PROJECTS[startIndex] || PROJECTS[0];

  useEffect(() => {
    // Initial container setup - start slightly scaled and transparent
    gsap.set(containerRef.current, { opacity: 0, scale: 0.98, y: 20 });

    // Entrance animation
    gsap.to(containerRef.current, {
      opacity: 1, 
      scale: 1,
      y: 0, 
      duration: 0.7, 
      ease: 'power4.out',
    });

    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleIframeLoad = () => {
    
    if (loadingOverlayRef.current) {
      gsap.to(loadingOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (loadingOverlayRef.current) {
             loadingOverlayRef.current.style.display = 'none';
          }
        }
      });
    }
  };

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, 
      scale: 0.98, 
      y: 30, 
      duration: 0.4, 
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  return (
    <div 
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Case Study Viewer"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 9999, // Super high to cover everything
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Loading Skeleton / Overlay to prevent white flash */}
      <div
        ref={loadingOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: clickedProj.bgColor || '#000000',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ 
          width: '40px', height: '40px', 
          border: '3px solid rgba(255,255,255,0.1)', 
          borderTopColor: '#ffffff', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite' 
        }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', opacity: 0.6, letterSpacing: '0.1em', fontSize: '12px', textTransform: 'uppercase' }}>
          Loading Case Study
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '80px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4vw',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            width: '44px', height: '44px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Optional External Link */}
        {clickedProj?.link && (
          <a 
            href={clickedProj.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              pointerEvents: 'auto',
              fontSize: '11px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: '100px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Open in new tab ↗
          </a>
        )}
      </div>

      {clickedProj?.link ? (
        <iframe 
          ref={iframeRef}
          src={clickedProj.link} 
          title={clickedProj.title} 
          allow="autoplay; fullscreen"
          onLoad={handleIframeLoad}
          style={{ width: '100%', height: '100%', border: 'none', backgroundColor: clickedProj.bgColor || '#000000' }}
        />
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', padding: '40px', textAlign: 'center'
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>📐</span>
          <h3>No Preview Available</h3>
        </div>
      )}
    </div>
  );
}
