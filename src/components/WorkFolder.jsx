import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';
import LazyVideo from './LazyVideo';

gsap.registerPlugin(ScrollTrigger);

export default function WorkFolder({ theme, onOpen }) {
  const sectionRef = useRef();
  const pendulumsRef = useRef([]);
  const rotationTo = useRef([]);

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
      { y: -300, rotation: () => Math.random() * 15 - 7.5, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Setup real-time physics (quickTo) for minimal sway
    pendulumsRef.current.forEach((el, i) => {
      rotationTo.current[i] = gsap.quickTo(el, "rotation", { duration: 1.2, ease: "power3.out" });
    });

    const handleGlobalMouseMove = (e) => {
      // Calculate mouse position relative to screen center (-0.5 to 0.5)
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      
      pendulumsRef.current.forEach((el, i) => {
        if (!el) return;
        // The sway is very subtle and feels like gentle wind/physics
        // Each card has slightly different weight for organic feel
        const maxTilt = 8 + (i * 2); 
        rotationTo.current[i](normalizedX * maxTilt);
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

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
            ref={el => pendulumsRef.current[idx] = el}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'clamp(280px, 26vw, 420px)',
              position: 'relative',
              transformOrigin: 'top center',
              cursor: 'pointer'
            }}
          >
            {/* The Minimal String */}
            <div style={{
              width: '1px',
              height: '140px',
              backgroundColor: theme.text,
              opacity: 0.4
            }}></div>

            {/* The Minimal Card */}
            <div 
              style={{
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                transformOrigin: 'top center',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
              }}
            >
              {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                <LazyVideo src={proj.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              ) : (
                <img src={proj.img} alt={proj.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              )}
              
              {/* Card Label & Subheading (Minimal) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pointerEvents: 'none'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2.25rem', 
                  fontWeight: 700, 
                  margin: '0 0 12px 0', 
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}>{proj.name}</h3>
                
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.75)',
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
