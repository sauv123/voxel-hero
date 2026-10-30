import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroVideo({ videoSrc = "/0826.mp4", isPreloading, onVideoReady }) {
  const stickyRef = useRef(null);
  const containerRef = useRef(null);
  const videoElRef = useRef(null);
  const panMultiplier = useRef({ value: 1 });
  const lastMousePos = useRef({ xOffset: 0 }); // Track last mouse position
  
  useEffect(() => {
    const sticky = stickyRef.current;
    const container = containerRef.current;
    const video = videoElRef.current;
    if (!sticky || !container) return;
    
    const isMobile = window.innerWidth < 768;
    
    // Ensure video plays reliably on mobile browsers (low power / autoplay policies)
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires touch interaction
        });
      }
    }

    const handleFirstTouch = () => {
      if (videoElRef.current && videoElRef.current.paused) {
        videoElRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true, passive: true });

    // Safety fallback: if video event doesn't fire within 800ms, unlock preloader
    const timer = setTimeout(() => {
      if (onVideoReady) onVideoReady();
    }, 800);

    // Initial state: On mobile, cleanly dock UNDER the headline text without overlapping
    gsap.set(container, {
      width: isMobile ? "86vw" : "28vw",
      height: isMobile ? "48vw" : "15.75vw", 
      borderRadius: isMobile ? "14px" : "6px",
      xPercent: -50,
      yPercent: 0,
      left: "50%",
      top: isMobile ? "44vh" : "7vh", // On mobile: perfectly positioned under the editorial text!
      boxShadow: isMobile ? "0 12px 36px rgba(0,0,0,0.22)" : "none",
      x: 0,
      y: 0
    });
    
    const xTo = gsap.quickTo(container, "x", { duration: 0.5, ease: "power3.out" });

    // Function to calculate and apply the X position on desktop hover
    const updateXPos = () => {
      if (isMobile) return;
      const { innerWidth } = window;
      const safeGap = 40; 
      const maxTravelX = Math.max(0, (innerWidth - container.offsetWidth) / 2 - safeGap);
      const currentMult = panMultiplier.current.value;
      
      const videoX = lastMousePos.current.xOffset * maxTravelX * currentMult;
      xTo(videoX);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sticky.parentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: () => {
          updateXPos();
        }
      }
    });

    // Expand video to full-screen viewport
    tl.to(container, {
      width: isMobile ? "calc(100vw - 32px)" : "calc(100vw - 80px)",
      height: isMobile ? "calc(100vh - 48px)" : "calc(100vh - 80px)",
      top: isMobile ? "24px" : "40px",
      borderRadius: "16px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
      ease: "power2.inOut" 
    }, 0)
    .to(panMultiplier.current, {
      value: 0,
      ease: "power4.out" 
    }, 0);

    // On mobile: smoothly fade out text as video expands so they never awkwardly collide
    if (isMobile) {
      tl.to('.text-layer', {
        opacity: 0,
        y: -30,
        ease: "power1.inOut"
      }, 0);
    }
    
    const handleMouseMove = (e) => {
      if (isMobile) return;
      const { innerWidth } = window;
      lastMousePos.current.xOffset = (e.clientX / innerWidth - 0.5) * 2;
      updateXPos();
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sticky.parentElement) t.kill();
      });
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('touchstart', handleFirstTouch);
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
        zIndex: isPreloading ? 1000000 : 1, 
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
          ref={videoElRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          onLoadedData={() => onVideoReady && onVideoReady()}
          onCanPlay={() => onVideoReady && onVideoReady()}
          onLoadedMetadata={() => onVideoReady && onVideoReady()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.95
          }}
        />
      </div>
    </div>
  );
}
