import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';
import LazyVideo from './LazyVideo';

gsap.registerPlugin(ScrollTrigger);

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    // Background scrub
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 100%",
      end: "top 20%",
      scrub: 1.5,
      onUpdate: (self) => {
        const blendedColor = gsap.utils.interpolate('#000000', '#FFFFFF', self.progress);
        gsap.set([document.documentElement, document.body], { backgroundColor: blendedColor });
      }
    });

    // Entrance animation
    gsap.fromTo(cardsRef.current, 
      { y: 150, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  // Premium 3D Tilt Physics
  const handleMouseMove = (e, index) => {
    const el = cardsRef.current[index];
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(el, {
      rotationY: x * 15,
      rotationX: -y * 15,
      transformPerspective: 1000,
      scale: 1.05,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (e, index) => {
    const el = cardsRef.current[index];
    if (!el) return;
    
    gsap.to(el, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto'
    });
  };

  const topProjects = [PROJECTS[1], PROJECTS[0], PROJECTS[2]];

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        width: '100vw', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 4vw',
        position: 'relative',
        perspective: '2000px'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', backgroundColor: theme.text, opacity: 0.1 }}></div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4vw',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '100px',
        width: '100%',
        marginTop: '-120px'
      }}>
        {topProjects.map((proj, idx) => (
          <div 
            key={proj.id} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'clamp(320px, 28vw, 480px)', // Made cards significantly bigger
              position: 'relative',
            }}
          >
            {/* The String Visual */}
            <div style={{
              width: '1px',
              height: '100px',
              backgroundColor: theme.text,
              opacity: 0.4
            }}></div>

            {/* The Interactive 3D Card */}
            <div 
              ref={el => cardsRef.current[idx] = el}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={(e) => handleMouseLeave(e, idx)}
              style={{
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
              }}
            >
              {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                <LazyVideo src={proj.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              ) : (
                <img src={proj.img} alt={proj.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              )}
              
              {/* Card Content Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pointerEvents: 'none',
                transform: 'translateZ(30px)' // Pushes text out in 3D space
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2.5rem', 
                  fontWeight: 800, 
                  margin: '0 0 12px 0', 
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}>{proj.name}</h3>
                
                {/* Tags Restored */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {proj.tags && proj.tags.map(tag => (
                    <span key={tag} style={{ 
                      fontFamily: 'var(--font-body)', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      color: '#ffffff', 
                      border: '1px solid rgba(255,255,255,0.3)', 
                      padding: '6px 12px', 
                      borderRadius: '100px',
                      letterSpacing: '0.05em'
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Subheading Context */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {proj.cta}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onOpen}
        style={{
          padding: '24px 64px',
          borderRadius: '100px',
          border: `1px solid ${theme.text}40`,
          backgroundColor: 'transparent',
          color: theme.text,
          fontSize: '1.125rem',
          fontWeight: 500,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.text;
          e.currentTarget.style.color = theme.bg;
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.text;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        View all work
      </button>
    </section>
  );
}
