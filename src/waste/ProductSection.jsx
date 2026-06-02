import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductSection({ theme }) {
  const sectionRef = useRef();
  const dsRef = useRef();
  const cardRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    // ── Background Color Scrub ──
    gsap.to(document.body, {
      backgroundColor: '#050505', // Deep black
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
      }
    });

    // ── Entrance Animation (Card) ──
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );

    // ── DS Drop-in from Top Left ──
    gsap.fromTo(
      dsRef.current,
      { x: '-60vw', y: '-80vh', rotationZ: -45, rotationX: 45, rotationY: 45, scale: 0.5, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        rotationY: 20, // initial isometric angle
        rotationX: 15,
        rotationZ: -10,
        scale: 1,
        duration: 2.5,
        ease: 'bounce.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );

    gsap.fromTo(
      cardRef.current,
      { x: 100, opacity: 0, scale: 0.9 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );

    // ── Ambient Floating for DS ──
    gsap.to(dsRef.current, {
      y: '+=20',
      rotationZ: '+=2',
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // ── Mouse Parallax & Scene Depth ──
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const mouseX = (e.clientX - cx) / width; // -0.5 to 0.5
      const mouseY = (e.clientY - cy) / height;

      // Parallax DS
      gsap.to(dsRef.current, {
        rotationY: 20 + mouseX * 30, // Base 20 + mouse offset
        rotationX: 15 - mouseY * 30, // Base 15 - mouse offset
        x: mouseX * -50,
        y: mouseY * -50,
        duration: 1,
        ease: 'power2.out',
      });

      // Parallax Card
      gsap.to(cardRef.current, {
        rotationY: mouseX * 15,
        rotationX: -mouseY * 15,
        x: mouseX * 30,
        y: mouseY * 30,
        duration: 1,
        ease: 'power2.out',
      });
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="product-section">
      {/* Scanline/Noise Overlay */}
      <div className="product-noise"></div>

      <div className="product-split">
        {/* Left Side: Floating Closed DS */}
        <div className="product-left">
          <div ref={dsRef} className="product-ds-closed">
            <div className="pds-camera"></div>
            <div className="pds-logo"></div>
            <div className="pds-grooves"></div>
          </div>
        </div>

        {/* Right Side: Interactive Card */}
        <div className="product-right">
          <div ref={cardRef} className="product-card" style={{ backgroundColor: theme.text, color: theme.bg }}>
            <div className="card-glare"></div>
            <h2 ref={textRef}>I Build Products.</h2>
            <div className="card-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
