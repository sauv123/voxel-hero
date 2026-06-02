import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TRAIL_IMAGES = [
  "/works/media__1777587384139.webp",
  "/works/media__1777587436505.webp",
  "/works/media__1777587442037.webp",
  "/works/media__1777587480636.webp",
];

export default function SensoryTrail({ theme }) {
  const containerRef = useRef();
  let lastPos = useRef({ x: 0, y: 0 });
  let imageIndex = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      // Calculate distance from last spawned image
      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

      // Spawn every 100px of movement
      if (dist > 120) {
        lastPos.current = { x, y };

        // Create DOM element
        const imgEl = document.createElement('div');
        imgEl.className = 'st-trail-image';
        
        // Use a background image from the array
        const imgSrc = TRAIL_IMAGES[imageIndex.current % TRAIL_IMAGES.length];
        imageIndex.current++;
        
        imgEl.style.backgroundImage = `url(${imgSrc})`;
        imgEl.style.left = `${x}px`;
        imgEl.style.top = `${y}px`;
        
        // Random slight rotation
        const rotation = (Math.random() - 0.5) * 30;

        containerRef.current.appendChild(imgEl);

        // Animate in and out
        gsap.fromTo(imgEl, 
          { scale: 0, opacity: 0, rotation: rotation - 20, zIndex: imageIndex.current },
          { 
            scale: 1, 
            opacity: 1, 
            rotation: rotation,
            duration: 0.5, 
            ease: 'back.out(1.5)',
            onComplete: () => {
              // Fade out and float up
              gsap.to(imgEl, {
                y: "-=100",
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.2, // Hold it visible briefly
                onComplete: () => imgEl.remove() // Cleanup DOM
              });
            }
          }
        );
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (el) el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="sensory-trail" ref={containerRef} style={{ backgroundColor: theme.bg }}>
      <div className="st-content">
        <h2 className="st-heading" style={{ color: theme.text }}>
          BRINGING<br/>BRANDS<br/>TO LIFE
        </h2>
        <div className="st-body">
          <p style={{ color: `${theme.text}99` }}>
            We don't just build interfaces. We build physical, sensory experiences that leave a lasting imprint on the human mind. The web is not a document; it is an endless canvas for expression.
          </p>
        </div>
      </div>
    </section>
  );
}
