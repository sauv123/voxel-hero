import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveBlocks from './InteractiveBlocks';

gsap.registerPlugin(ScrollTrigger);

// ─── DRAGGABLE PIXEL BLOCK COMPONENT ─────────────────────────────────
function DraggableBlock({ id, targetX, targetY, currentX, currentY, brandColor, isDinoTheme, shade, onBlockMove }) {
  const blockRef = useRef(null);
  const cellSize = 50; 
  const [position, setPosition] = useState({ x: currentX * cellSize, y: currentY * cellSize });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const blockStart = useRef({ x: 0, y: 0 });

  // Synced movement when solved/reset is triggered from parent controls
  useEffect(() => {
    if (!isDragging) {
      gsap.to(blockRef.current, {
        x: currentX * cellSize,
        y: currentY * cellSize,
        duration: 0.5,
        ease: "back.out(1.2)",
        onComplete: () => {
          setPosition({ x: currentX * cellSize, y: currentY * cellSize });
        }
      });
    }
  }, [currentX, currentY, isDragging]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    blockStart.current = { x: position.x, y: position.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Grid boundary clamping (4x5 grid: max X is 150, max Y is 200)
    const clampedDragX = Math.max(-4, Math.min(154, blockStart.current.x + dx));
    const clampedDragY = Math.max(-4, Math.min(204, blockStart.current.y + dy));

    setPosition({ x: clampedDragX, y: clampedDragY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const snappedX = Math.round(position.x / cellSize);
    const snappedY = Math.round(position.y / cellSize);
    
    const clampedGridX = Math.max(0, Math.min(3, snappedX));
    const clampedGridY = Math.max(0, Math.min(4, snappedY));

    // Notify parent to update coordinates
    onBlockMove(id, clampedGridX, clampedGridY);
  };

  const handlePointerCancel = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Puzzle feedback: block glows solid brand color when aligned correctly
  const isAligned = currentX === targetX && currentY === targetY;

  const getShadedColor = () => {
    if (isAligned) return brandColor; // Solid glow when correct
    // Translucent shading when misplaced
    return brandColor.startsWith('#')
      ? `${brandColor}${shade === 1 ? 'aa' : '77'}`
      : brandColor;
  };

  return (
    <div
      ref={blockRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        position: "absolute",
        width: `${cellSize - 4}px`,
        height: `${cellSize - 4}px`,
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        backgroundColor: getShadedColor(),
        borderRadius: "4px",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 100 : 10,
        boxShadow: isDragging 
          ? `0 12px 24px ${brandColor}50` 
          : (isAligned ? `0 2px 8px ${brandColor}30` : "0 4px 8px rgba(0, 0, 0, 0.4)"),
        transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: isAligned ? `1px solid #ffffff` : "1px solid rgba(255, 255, 255, 0.15)",
        touchAction: "none"
      }}
    >
      <div style={{
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        backgroundColor: isDinoTheme ? "#fff" : "#000",
        opacity: isAligned ? 0.6 : 0.25
      }} />
    </div>
  );
}

// ─── STYLISH TEXT LINK COMPONENT ──────────────────────────────────────
function FooterTextLink({ href, text, brandColor }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  return (
    <a
      href={href}
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
        fontFamily: "Elms Sans, monospace",
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

  const [blocks, setBlocks] = useState(initialBlocks);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Entrance reveals
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    
    // Find closest scrollable container or default to window
    const scrollContainer = el.closest('.scroll-container') || window;
    
    // Scope animations to this specific footer instance
    const fadeElements = el.querySelectorAll('.footer-fade');

    gsap.set(fadeElements, { opacity: 0, y: 35 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      scroller: scrollContainer,
      start: "top 95%",
      onEnter: () => {
        gsap.to(fadeElements, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out" 
        });
      },
      onLeaveBack: () => {
        gsap.set(fadeElements, { opacity: 0, y: 35 });
      }
    });

    return () => trigger.kill();
  }, []);

  // Update specific block position on drag snapping
  const handleBlockMove = (id, newX, newY) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, currentX: newX, currentY: newY } : b));
  };

  // Scramble block locations
  const handleScramble = () => {
    setBlocks(prev => prev.map(b => {
      const rx = Math.floor(Math.random() * 4);
      const ry = Math.floor(Math.random() * 5);
      return { ...b, currentX: rx, currentY: ry };
    }));
  };

  // Solve block locations instantly
  const handleSolve = () => {
    setBlocks(prev => prev.map(b => ({ ...b, currentX: b.targetX, currentY: b.targetY })));
  };

  // Detect if the puzzle grid monogram layout matches the solved target coordinates
  const isSolved = blocks.every(b => b.currentX === b.targetX && b.currentY === b.targetY);

  // Playful success stagger loop when puzzle is solved
  useEffect(() => {
    if (isSolved) {
      gsap.fromTo('.puzzle-success-glow', 
        { scale: 0.95, opacity: 0.5 }, 
        { scale: 1.05, opacity: 1, duration: 0.4, repeat: 3, yoyo: true, ease: "power2.inOut" }
      );
    }
  }, [isSolved]);

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
        padding: isMobile ? "48px 24px 180px 24px" : "80px 6vw 160px 6vw",
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
            alignItems: "flex-start",
            textAlign: "left",
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
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "8px",
              letterSpacing: "-0.03em"
            }}
          >
            Design is better when you have <span style={{ color: brandColor }}>fun</span>.
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
            I hope you had as much fun exploring the site as I had building it.
          </p>

          <div 
            className="footer-fade"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "40px" // Pushed down to improve visual spacing
            }}
          >
            {/* Say Hi Label (Static text, no link action, lower opacity) */}
            <div 
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.4,
                color: "#ffffff",
                marginBottom: "4px",
                userSelect: "none"
              }}
            >
              Say Hi
            </div>

            {/* Spaced horizontal row of links placed directly under Say Hi */}
            <div 
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: isMobile ? "16px" : "24px",
                boxSizing: "border-box"
              }}
            >
              <FooterTextLink href="mailto:sauveersinha@gmail.com" text="Gmail" brandColor={brandColor} />
              <FooterTextLink href="https://sauveer.com/resume.pdf" text="Résumé" brandColor={brandColor} />
              <FooterTextLink href="https://www.linkedin.com/in/sauveer-sinha-684409215/" text="LinkedIn" brandColor={brandColor} />
              <FooterTextLink href="https://wa.me/393508124320" text="WhatsApp" brandColor={brandColor} />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Blocks */}
        <div 
          className="footer-fade"
          style={{
            position: "relative",
            width: "260px",
            height: "290px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            boxSizing: "border-box"
          }}
        >
          <InteractiveBlocks />
        </div>

      </div>
    </footer>
  );
}
