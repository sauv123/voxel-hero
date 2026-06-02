import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LensReveal({ theme }) {
  const containerRef = useRef();
  const maskedLayerRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !maskedLayerRef.current) return;
      
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      // Use GSAP quickSetter for massive performance
      gsap.to(maskedLayerRef.current, {
        clipPath: `circle(200px at ${x}px ${y}px)`,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (maskedLayerRef.current) {
        gsap.to(maskedLayerRef.current, {
          clipPath: `circle(0px at 50% 50%)`,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="lens-reveal" ref={containerRef} style={{ backgroundColor: theme.bg }}>
      
      {/* ── BASE LAYER (Normal) ── */}
      <div className="lr-layer lr-base" style={{ color: theme.text }}>
        <h1 className="lr-heading">OBSESSIVE<br/>ATTENTION<br/>TO DETAIL.</h1>
        <p className="lr-sub">Move your cursor to break the surface.</p>
      </div>

      {/* ── MASKED LAYER (Revealed by cursor) ── */}
      <div className="lr-layer lr-masked" ref={maskedLayerRef} style={{ backgroundColor: theme.text, color: theme.bg }}>
        {/* We use an image background in the CSS, but text stays inverse */}
        <h1 className="lr-heading">OBSESSIVE<br/>ATTENTION<br/>TO DETAIL.</h1>
        <p className="lr-sub">The truth lies underneath the typography.</p>
        <div className="lr-media-bg"></div>
      </div>

    </section>
  );
}
