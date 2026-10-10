import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';
import LazyVideo from './LazyVideo';

gsap.registerPlugin(ScrollTrigger);

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef();
  const pendulumsRef = useRef([]);

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

    // Hanging pendulum drop animation
    gsap.fromTo(pendulumsRef.current, 
      { y: -300, rotation: () => Math.random() * 30 - 15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 2.5,
        ease: 'elastic.out(1, 0.2)', // Intense pendulum swing on load
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleMouseMove = (e, index) => {
    const el = pendulumsRef.current[index];
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distanceX = e.clientX - centerX;
    
    // Rotate based on mouse position (magnetic push)
    const maxRotation = 12;
    const rotation = (distanceX / (rect.width / 2)) * maxRotation;
    
    gsap.to(el, {
      rotation: rotation,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (e, index) => {
    const el = pendulumsRef.current[index];
    if (!el) return;
    
    // Swing back and forth elastically (real physics feel)
    gsap.to(el, {
      rotation: 0,
      duration: 2.5,
      ease: 'elastic.out(1.5, 0.15)', // Extremely bouncy swing
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
        position: 'relative'
      }}
    >
      {/* Invisible anchor bar at the top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', backgroundColor: theme.text, opacity: 0.1 }}></div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6vw',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '100px',
        width: '100%',
        marginTop: '-120px' // Pull up to connect strings to the top
      }}>
        {topProjects.map((proj, idx) => (
          <div 
            key={proj.id} 
            ref={el => pendulumsRef.current[idx] = el}
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={(e) => handleMouseLeave(e, idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'clamp(280px, 25vw, 360px)',
              position: 'relative',
              transformOrigin: 'top center',
              cursor: 'pointer'
            }}
          >
            {/* The String (Thicker, more visible) */}
            <div style={{
              width: '2px',
              height: '180px', // Long string extending to the top
              backgroundColor: theme.text,
              opacity: 0.8,
              boxShadow: `0 0 8px ${theme.text}40`
            }}></div>

            {/* The Card */}
            <div 
              style={{
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#000',
                border: `1px solid ${theme.text}30`,
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                position: 'relative',
                transformOrigin: 'top center'
              }}
            >
              {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                <LazyVideo src={proj.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
              ) : (
                <img src={proj.img} alt={proj.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
              )}
              
              {/* Card Label & Tags */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pointerEvents: 'none'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.75rem', 
                  fontWeight: 800, 
                  margin: '0 0 16px 0', 
                  color: '#ffffff',
                  lineHeight: 1.1
                }}>{proj.name}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {proj.tags && proj.tags.map(tag => (
                    <span key={tag} style={{ 
                      fontFamily: 'var(--font-body)', 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      color: '#ffffff', 
                      border: '1px solid rgba(255,255,255,0.4)', 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(4px)',
                      padding: '6px 10px', 
                      borderRadius: '100px',
                      letterSpacing: '0.05em'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <button 
        onClick={onOpen}
        style={{
          padding: '24px 64px',
          borderRadius: '100px',
          border: `2px solid ${theme.text}`,
          backgroundColor: 'transparent',
          color: theme.text,
          fontSize: '1.125rem',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.text;
          e.currentTarget.style.color = theme.bg;
          e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.text;
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
      >
        VIEW WORK &rarr;
      </button>
    </section>
  );
}
