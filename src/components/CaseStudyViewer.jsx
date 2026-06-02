import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PROJECTS } from './InteractiveProjects';
import useIdle from '../hooks/useIdle';

export default function CaseStudyViewer({ startIndex, onClose, theme }) {
  const containerRef = useRef(null);
  
  // Use the useIdle hook to hide the close button when idle
  const isIdle = useIdle(2000); // 2 seconds of inactivity

  // Duplicate the array 3 times to allow for smooth looping backward and forward
  // Only include projects that actually have links for the Case Study Viewer
  const caseStudies = PROJECTS.filter(p => p.link);
  const duplicatedProjects = [...caseStudies, ...caseStudies, ...caseStudies];
  const itemsCount = caseStudies.length;
  
  // Find where the clicked project sits in the middle block
  // If the user clicked project index 3 in PROJECTS, we need to map that to the caseStudies array
  const clickedProj = PROJECTS[startIndex];
  const caseStudyIndex = caseStudies.findIndex(p => p.id === clickedProj?.id) || 0;
  const initialScrollIndex = itemsCount + caseStudyIndex;

  useEffect(() => {
    if (containerRef.current) {
      const vh = window.innerHeight;
      containerRef.current.scrollTop = initialScrollIndex * vh;
    }

    // Entrance animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' }
    );
    
    // Prevent body scroll behind overlay
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [initialScrollIndex]);

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
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: theme.bg,
        zIndex: 9999,
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'auto',
      }}
    >
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 40, right: 40,
          zIndex: 10000,
          background: theme.text,
          color: theme.bg,
          border: 'none',
          borderRadius: '50%',
          width: 48, height: 48,
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${theme.text}40`,
          transition: 'transform 0.3s, opacity 0.4s',
          opacity: isIdle ? 0 : 1,
          pointerEvents: isIdle ? 'none' : 'auto'
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
            backgroundColor: proj.bgColor,
          }}
        >
          <iframe 
            src={proj.link} 
            title={proj.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ))}
    </div>
  );
}
