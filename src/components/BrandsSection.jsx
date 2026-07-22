import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './brands.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrandsSection() {
  const sectionRef = useRef(null);
  const headerTextRef = useRef(null);
  const logoGridRef = useRef(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);

  const text = "Brands I've worked with";
  const words = text.split(' ');

  const LOGOS = [
    { id: 'logo1', src: '/brands/logo1.webp' },
    { id: 'logo2', src: '/brands/logo2.webp' },
    { id: 'logo3', src: '/brands/logo3.webp' },
    { id: 'logo4', src: '/brands/logo4.webp' },
    { id: 'logo5', src: '/brands/logo5.webp' },
    { id: 'logo6', src: '/brands/logo6.webp' }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const header = document.querySelector('.section-header');
      const wordElements = document.querySelectorAll('.word');
      const logoGrid = logoGridRef.current;
      const logoItems = document.querySelectorAll('.logo-item');
      const logoContents = document.querySelectorAll('.logo-content');

      const tl = gsap.timeline({
          scrollTrigger: {
              trigger: sectionRef.current,
              scroller: sectionRef.current.closest('.scroll-container') || window,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
          }
      });

      tl.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
      })
      .to(wordElements, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'back.out(1.7)'
      }, '-=0.4')
      .to(logoGrid, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
      }, '-=0.2')
      .to(logoContents, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: {
              each: 0.05,
              grid: [2, 3], // Updated to 3 columns grid
              from: 'start'
          },
          ease: 'back.out(1.4)'
      }, '-=0.3');

      // Hover animations for logos
      logoItems.forEach((item) => {
          item.addEventListener('mouseenter', () => {
              gsap.to(item, {
                  scale: 1.02,
                  duration: 0.3,
                  ease: 'power2.out'
              });
          });

          item.addEventListener('mouseleave', () => {
              gsap.to(item, {
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out'
              });
          });
      });

      // Continuous subtle animation for decorative circles
      gsap.to(circle1Ref.current, {
          rotation: 360,
          duration: 120,
          repeat: -1,
          ease: 'none'
      });

      gsap.to(circle2Ref.current, {
          rotation: -360,
          duration: 100,
          repeat: -1,
          ease: 'none'
      });

      // Advanced parallax effect on scroll
      gsap.to(header, {
          yPercent: 50,
          ease: 'none',
          scrollTrigger: {
              trigger: sectionRef.current,
              scroller: sectionRef.current.closest('.scroll-container') || window,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
          }
      });

      gsap.to(logoGrid, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
              trigger: sectionRef.current,
              scroller: sectionRef.current.closest('.scroll-container') || window,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
          }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="brands-section">
      <div className="deco-circle deco-circle-1" ref={circle1Ref} style={{ backgroundColor: `rgba(255,255,255,0.02)` }}></div>
      <div className="deco-circle deco-circle-2" ref={circle2Ref} style={{ backgroundColor: `rgba(255,255,255,0.02)` }}></div>
      
      <div className="brands-container">
        <div className="section-header">
          <h2 ref={headerTextRef}>
            {words.map((word, index) => (
              <span key={index} className="word" style={{ display: 'inline-block' }}>
                {word}&nbsp;
              </span>
            ))}
          </h2>
        </div>

        <div className="logo-grid" ref={logoGridRef}>
          {LOGOS.map((logo, index) => (
            <div key={index} className="logo-item" data-logo={logo.id}>
              <div className="logo-content">
                <img src={logo.src} alt={`Brand logo ${logo.id}`} className="brand-image" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
