import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// ─── STYLISH TEXT LINK COMPONENT ──────────────────────────────────────
function FooterTextLink({ href, text, brandColor, ariaLabel }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        minWidth: "44px",
        padding: "10px",
        color: isHovered ? brandColor : "#ffffff",
        textDecoration: "none",
        fontFamily: "Space Mono, monospace",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isClicked ? "scale(0.93) translateX(2px)" : isHovered ? "translateX(4px)" : "none",
        opacity: isHovered ? 1.0 : 0.65
      }}
    >
      {text}
      <span style={{
        marginLeft: "4px",
        display: "inline-block",
        transform: isHovered ? "translate(3px, -3px)" : "none",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        ↗
      </span>
    </a>
  );
}

// ─── MAIN FOOTER COMPONENT ──────────────────────────────────────────
export default function Footer({ theme, activeChar = 'deer' }) {
  const footerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  const brandColor = theme?.brand || '#2ECC40';
  const isDinoTheme = theme?.bg === '#0e0e0e';

  // Core Puzzle positions forming a pixel monogram
  const initialBlocks = [
    { id: 1, targetX: 0, targetY: 0, currentX: 0, currentY: 0, shade: 0 },
    { id: 2, targetX: 1, targetY: 0, currentX: 1, currentY: 0, shade: 1 },
    { id: 3, targetX: 2, targetY: 0, currentX: 2, currentY: 0, shade: 2 },
    { id: 4, targetX: 3, targetY: 0, currentX: 3, currentY: 0, shade: 0 },
    { id: 5, targetX: 0, targetY: 1, currentX: 0, currentY: 1, shade: 1 },
    { id: 6, targetX: 0, targetY: 2, currentX: 0, currentY: 2, shade: 2 },
    { id: 7, targetX: 1, targetY: 2, currentX: 1, currentY: 2, shade: 0 },
    { id: 8, targetX: 2, targetY: 2, currentX: 2, currentY: 2, shade: 1 },
    { id: 9, targetX: 2, targetY: 3, currentX: 2, currentY: 3, shade: 2 },
    { id: 10, targetX: 2, targetY: 4, currentX: 2, currentY: 4, shade: 0 },
    { id: 11, targetX: 1, targetY: 4, currentX: 1, currentY: 4, shade: 1 },
    { id: 12, targetX: 0, targetY: 4, currentX: 0, currentY: 4, shade: 2 }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Entrance reveals
  useEffect(() => {
    const el = footerRef.current;
    gsap.set('.footer-fade', { opacity: 0, y: 35 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to('.footer-fade', { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out" 
        });
      },
      onLeaveBack: () => {
        gsap.set('.footer-fade', { opacity: 0, y: 35 });
      }
    });

    return () => trigger.kill();
  }, []);


  return (
    <footer 
      ref={footerRef} 
      style={{
        width: "100%",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden", 
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: isMobile ? "48px 24px 40px 24px" : "80px 6vw 48px 6vw",
        zIndex: 20
      }}
    >
      
      {/* Editorial Dot Grid Texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
        backgroundSize: "24px 24px"
      }} />

      {/* Merged Continuous Stack Layout */}
      <div 
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          maxWidth: "1320px",
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: "48px",
          position: "relative",
          boxSizing: "border-box",
          gap: isMobile ? "48px" : "80px"
        }}
      >
        
        {/* Left Column: Typography & Connect details */}
        <div 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
            zIndex: 10,
            boxSizing: "border-box"
          }}
        >
          {/* Main Headline */}
          <h2 
            className="footer-fade"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: isMobile ? "34px" : "48px",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "8px",
              letterSpacing: "-0.03em"
            }}
          >
            Design is better when you have fun.
          </h2>

          {/* Subtext directly under the headline */}
          <p 
            className="footer-fade"
            style={{
              fontSize: isMobile ? "13px" : "15px",
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.5,
              maxWidth: "520px",
              margin: "0 0 32px 0"
            }}
          >
            I hope you had as much fun exploring the site as much as I had building it.
          </p>

          {/* Static, low opacity labels & Stacked Link items underneath */}
          <div 
            className="footer-fade"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            {/* Say Hi Label (Static text, no link action, lower opacity) */}
            <div 
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.4, // Reduced opacity as requested
                color: "#ffffff",
                marginBottom: "16px",
                userSelect: "none"
              }}
            >
              Say Hi
            </div>

            {/* Spaced grid of links */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, auto)",
                gap: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              <FooterTextLink href="mailto:sauveersinha@gmail.com" text="Gmail" brandColor={brandColor} ariaLabel="Email Sauveer via Gmail" />
              <FooterTextLink href="https://sauveer.com/resume.pdf" text="Résumé" brandColor={brandColor} ariaLabel="View Sauveer's Resume" />
              <FooterTextLink href="https://www.linkedin.com/in/sauveer-sinha-684409215/" text="LinkedIn" brandColor={brandColor} ariaLabel="Visit Sauveer's LinkedIn profile" />
              <FooterTextLink href="https://wa.me/393508124320" text="WhatsApp" brandColor={brandColor} ariaLabel="Message Sauveer on WhatsApp" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Line */}
      <div 
        style={{
          width: "100%",
          maxWidth: "1320px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Space Mono, monospace",
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}
      >
        <span>© 2026 Sauveer Sinha, Milan</span>
      </div>

    </footer>
  );
}
