import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function CaseStudyViewer({ startIndex, onClose }) {
  const containerRef = useRef(null);
  const toastRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastKey, setToastKey] = useState(0);

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

  // IntersectionObserver for tracking active project
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'), 10);
            setActiveIndex((prev) => {
              if (prev !== index) {
                setToastKey(Date.now());
                return index;
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );

    const children = containerRef.current?.querySelectorAll('.project-slide');
    children?.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  // GSAP Toast Animation
  useEffect(() => {
    if (toastKey > 0 && toastRef.current) {
      gsap.killTweensOf(toastRef.current);
      gsap.fromTo(toastRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
      );
      gsap.to(toastRef.current, {
        opacity: 0, x: 20, duration: 0.5, delay: 2.5, ease: 'power2.in'
      });
    }
  }, [toastKey]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Loop logic to maintain infinite scroll
    const blockHeight = itemsCount * clientHeight;
    
    if (scrollTop < clientHeight) {
      containerRef.current.scrollTop = scrollTop + blockHeight;
    } else if (scrollTop > blockHeight * 2 - clientHeight) {
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

      {/* Toast Notification */}
      <div 
        ref={toastRef}
        style={{
          position: 'fixed',
          top: '50%',
          right: '24px',
          transform: 'translateY(-50%)',
          opacity: 0,
          pointerEvents: 'none',
          backgroundColor: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '12px 24px',
          borderRadius: '100px',
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          zIndex: 9999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '180px',
          textAlign: 'right',
        }}>
        You are in the next project
      </div>

      {duplicatedProjects.map((proj, i) => (
        <div 
          key={`${proj.id}-${i}`}
          className="project-slide"
          data-index={i % itemsCount}
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
              title={proj.title} allow="autoplay; fullscreen"
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
