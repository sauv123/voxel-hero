import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SNIPPETS = [
  { id: 1, text: "98% User Retention", top: "10%", left: "15%", z: 2 },
  { id: 2, text: "Award Winning Interactions", top: "25%", left: "70%", z: 1.5 },
  { id: 3, text: "Awwwards SOTD", top: "50%", left: "10%", z: 2.5 },
  { id: 4, text: "2.5M+ Active Users", top: "70%", left: "80%", z: 1 },
  { id: 5, text: "FWA of the Month", top: "80%", left: "20%", z: 1.8 },
];

export default function FloatingSnippets({ theme }) {
  const containerRef = useRef();
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const mouseX = (e.clientX - cx) / width; 
      const mouseY = (e.clientY - cy) / height;

      gsap.utils.toArray('.fs-snippet').forEach(snippet => {
        const speed = parseFloat(snippet.dataset.z);
        gsap.to(snippet, {
          x: mouseX * -100 * speed,
          y: mouseY * -100 * speed,
          rotationY: mouseX * 20,
          rotationX: -mouseY * 20,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };

    const el = containerRef.current;
    if (el) el.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (el) el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="floating-snippets" ref={containerRef}>
      <h2 className="fs-bg-text" style={{ color: `${theme.text}08` }}>RECOGNITION</h2>
      
      {SNIPPETS.map(snippet => {
        const isHovered = hoveredId === snippet.id;
        const isAnyHovered = hoveredId !== null;
        const blurAmount = isAnyHovered && !isHovered ? 'blur(8px)' : 'blur(0px)';
        const scale = isHovered ? 1.1 : 1;
        const opacity = isAnyHovered && !isHovered ? 0.4 : 1;

        return (
          <div 
            key={snippet.id}
            className="fs-snippet"
            data-z={snippet.z}
            onMouseEnter={() => setHoveredId(snippet.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ 
              top: snippet.top, 
              left: snippet.left,
              backgroundColor: isHovered ? theme.text : 'rgba(255,255,255,0.05)',
              color: isHovered ? theme.bg : theme.text,
              border: `1px solid ${theme.text}22`,
              backdropFilter: 'blur(12px)',
              filter: blurAmount,
              transform: `scale(${scale})`,
              opacity: opacity,
              zIndex: isHovered ? 100 : 10
            }}
          >
            <span className="fss-text">{snippet.text}</span>
          </div>
        );
      })}
    </section>
  );
}
