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
    // Background scrub to white for this section
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

    // Hanging string animation
    gsap.fromTo(cardsRef.current, 
      { y: 150, opacity: 0, rotation: 10, transformOrigin: 'top center' },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

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
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4vw',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '80px',
        width: '100%'
      }}>
        {topProjects.map((proj, idx) => (
          <div 
            key={proj.id} 
            ref={el => cardsRef.current[idx] = el}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'clamp(280px, 25vw, 400px)',
              position: 'relative'
            }}
          >
            {/* The String */}
            <div style={{
              width: '2px',
              height: '80px',
              backgroundColor: theme.text,
              opacity: 0.2,
              marginBottom: '-2px'
            }}></div>

            {/* The Card */}
            <div 
              style={{
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#0d0d0d',
                border: `1px solid ${theme.text}30`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -10, scale: 1.02, rotation: -2, duration: 0.4, ease: 'power3.out' });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'power3.out' });
              }}
            >
              {(proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov')) ? (
                <LazyVideo src={proj.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              ) : (
                <img src={proj.img} alt={proj.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              )}
              
              {/* Card Label */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                color: '#fff'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{proj.name}</h3>
                <span style={{ fontSize: '14px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{proj.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <button 
        onClick={onOpen}
        style={{
          padding: '20px 48px',
          borderRadius: '100px',
          border: `1px solid ${theme.text}40`,
          backgroundColor: 'transparent',
          color: theme.text,
          fontSize: '18px',
          fontWeight: 600,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
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
        VIEW WORK →
      </button>
    </section>
  );
}
