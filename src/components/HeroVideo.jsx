import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroVideo({ videoSrc = "/0826.mp4" }) {
  const stickyRef = useRef(null);
  const containerRef = useRef(null);
  const panMultiplier = useRef({ value: 1 });
  const lastMousePos = useRef({ xOffset: 0 }); // Track last mouse position
  
  useEffect(() => {
    const sticky = stickyRef.current;
    const container = containerRef.current;
    if (!sticky || !container) return;
    
    const isMobile = window.innerWidth < 768;
    
    // 1. Make it smaller (Initial state)
    gsap.set(container, {
      width: isMobile ? "60vw" : "28vw",
      height: isMobile ? "33.75vw" : "15.75vw", 
      borderRadius: "4px",
      xPercent: -50,
      yPercent: 0,
      left: "50%",
      top: isMobile ? "20vh" : "15vh", 
      boxShadow: "none",
      x: 0,
      y: 0
    });
    
    const xTo = gsap.quickTo(container, "x", { duration: 0.8, ease: "power3.out" });

    // Function to calculate and apply the X position
    const updateXPos = () => {
      const { innerWidth } = window;
      const safeGap = isMobile ? 20 : 40; 
      const maxTravelX = Math.max(0, (innerWidth - container.offsetWidth) / 2 - safeGap);
      const currentMult = panMultiplier.current.value;
      xTo(lastMousePos.current.xOffset * maxTravelX * currentMult);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sticky.parentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: () => {
          // As we scroll, continually update the X position so it naturally
          // gravitates back to 0 (center) even if the mouse is perfectly still.
          updateXPos();
        }
      }
    });

    tl.to(container, {
      width: isMobile ? "calc(100vw - 40px)" : "calc(100vw - 80px)",
      height: isMobile ? "calc(100vh - 40px)" : "calc(100vh - 80px)",
      top: isMobile ? "20px" : "40px",
      borderRadius: isMobile ? "12px" : "16px",
      ease: "power2.inOut" 
    }, 0)
    .to(panMultiplier.current, {
      value: 0,
      ease: "power4.out" 
    }, 0);
    
    const handleMouseMove = (e) => {
      const { innerWidth } = window;
      lastMousePos.current.xOffset = (e.clientX / innerWidth - 0.5) * 2;
      updateXPos();
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sticky.parentElement) t.kill();
      });
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={stickyRef}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1, 
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.9
          }}
        />
      </div>
    </div>
  );
}
