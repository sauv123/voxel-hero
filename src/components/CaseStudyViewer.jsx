import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function CaseStudyViewer({ startIndex, onClose }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Duplicate the array to allow for smooth scrolling/looping
  const caseStudies = PROJECTS.filter(p => p.link);
  const duplicatedProjects = [...caseStudies, ...caseStudies, ...caseStudies];
  const itemsCount = caseStudies.length;

  const clickedProj = PROJECTS[startIndex];
  const matchedIdx = caseStudies.findIndex(p => p.id === clickedProj?.id);
  const caseStudyIndex = matchedIdx !== -1 ? matchedIdx : 0;
  const initialScrollIndex = itemsCount + caseStudyIndex;

  useEffect(() => {
    if (containerRef.current) {
      const vh = window.innerHeight;
      containerRef.current.scrollTop = initialScrollIndex * vh;
      setActiveIndex(caseStudyIndex);
    }

    // Entrance animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' }
    );
    
    // Prevent body scroll behind overlay
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [initialScrollIndex, caseStudyIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop } = containerRef.current;
    
    const vh = window.innerHeight;
    const blockHeight = itemsCount * vh;

    // Track active page index
    const relativeScroll = scrollTop % blockHeight;
    const computedActive = Math.round(relativeScroll / vh) % itemsCount;
    setActiveIndex(computedActive);

    // Loop logic
    if (scrollTop < vh) {
      containerRef.current.scrollTop = scrollTop + blockHeight;
    } else if (scrollTop > blockHeight * 2 - vh) {
      containerRef.current.scrollTop = scrollTop - blockHeight;
    }
  };

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, y: 100, duration: 0.5, ease: 'power3.in',
      onComplete: onClose
    });
  };

  const currentProject = caseStudies[activeIndex] || clickedProj || caseStudies[0];

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      role="dialog"
      aria-modal="true"
      aria-label="Case Study Viewer"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#0a0a0a',
        zIndex: 200,
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'auto',
      }}
    >
      {/* Minimal Top-Right Floating Control Cluster (Replacing visual header) */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 250,
      }}>
        {currentProject?.link && (
          <a 
            href={currentProject.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              padding: '10px 18px',
              borderRadius: '8px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            Open ↗
          </a>
        )}
        

      </div>

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
            position: 'relative'
          }}
        >
          {proj.link ? (
            <iframe 
              src={proj.link} 
              title={proj.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#fff', padding: '40px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>📐</span>
              <h3>No Preview Available</h3>
              <p style={{ opacity: 0.6 }}>This case study has no active URL link mapped yet.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
