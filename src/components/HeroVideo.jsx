import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroVideo({ videoSrc = "/orco.mp4" }) {
  const stickyRef = useRef(null);
  const containerRef = useRef(null);
  const panMultiplier = useRef({ value: 1 });
  
  useEffect(() => {
    const sticky = stickyRef.current;
    const container = containerRef.current;
    if (!sticky || !container) return;
    
    const isMobile = window.innerWidth < 768;
    
    // Decreased size, explicitly spaced from top border using yPercent: 0
    gsap.set(container, {
      width: isMobile ? "80vw" : "40vw",
      height: isMobile ? "45vw" : "22.5vw", // 16:9 aspect ratio
      borderRadius: "4px",
      xPercent: -50,
      yPercent: 0, // Pivot is at the top edge of the container
      left: "50%",
      top: isMobile ? "15vh" : "12vh", // Strict initial spacing from the top
      boxShadow: "none"
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sticky.parentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
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
      ease: "power2.inOut"
    }, 0);
    
    const xTo = gsap.quickTo(container, "x", { duration: 1.2, ease: "expo.out" });
    const yTo = gsap.quickTo(container, "y", { duration: 1.2, ease: "expo.out" });
    
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xOffset = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yOffset = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      
      const currentMult = panMultiplier.current.value;
      const safeGap = isMobile ? 20 : 40; // minimum pixels away from ANY border
      
      // X travel: mathematically constrained to never touch side borders
      const maxTravelX = Math.max(0, (innerWidth - container.offsetWidth) / 2 - safeGap);
      
      // Y travel: strictly bounded to never touch top or bottom borders
      const initialTopPx = innerHeight * 0.12; // 12vh
      let yPan = 0;
      
      if (yOffset < 0) {
        // Panning UP: Cannot exceed the safe gap from the top border
        const maxUp = Math.max(0, initialTopPx - safeGap);
        yPan = yOffset * maxUp;
      } else {
        // Panning DOWN: Cannot exceed the safe gap from the bottom border
        const maxDown = Math.max(0, innerHeight - (initialTopPx + container.offsetHeight) - safeGap);
        yPan = yOffset * maxDown;
      }
      
      xTo(xOffset * maxTravelX * currentMult);
      yTo(yPan * currentMult);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
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
        zIndex: 1, // Sits slightly below the initial hero text wrapper (which is zIndex: 2)
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
