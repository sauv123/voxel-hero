import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { audioManager } from '../utils/audioManager';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const rippleRef = useRef(null);
  const hoveredTarget = useRef(null);

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const delayedMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Dispatch global custom event for 3D Scene Light / Parallax tracking
      window.dispatchEvent(new CustomEvent('voxel-mouse-move', {
        detail: {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
          pixelX: e.clientX,
          pixelY: e.clientY
        }
      }));
    };

    window.addEventListener('mousemove', onMouseMove);

    // 60fps Razor-Sharp Cursor Tracking Loop
    let animId;
    const render = () => {
      // Fluid lerp tracking
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * 0.16;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * 0.16;

      // 1:1 Instant Tracking for Micro-Dot
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: mouse.current.x, y: mouse.current.y });
      }

      // Smooth Outer Ring Tracking
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: delayedMouse.current.x,
          y: delayedMouse.current.y
        });
      }

      // True Element Magnetism: Pull hovered element toward mouse position
      if (hoveredTarget.current) {
        const rect = hoveredTarget.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distMon = Math.hypot(mouse.current.x - cx, mouse.current.y - cy);

        if (distMon < 120) {
          const pullX = (mouse.current.x - cx) * 0.25;
          const pullY = (mouse.current.y - cy) * 0.25;

          gsap.to(hoveredTarget.current, {
            x: pullX,
            y: pullY,
            duration: 0.2,
            ease: 'power2.out'
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Tactile Click Response (Whisper-Quiet Audio + Micro Implosion)
    const handleGlobalClick = (e) => {
      audioManager.playClickSound();

      if (rippleRef.current) {
        gsap.killTweensOf(rippleRef.current);
        gsap.set(rippleRef.current, {
          x: e.clientX,
          y: e.clientY,
          scale: 0.2,
          opacity: 0.8
        });

        gsap.to(rippleRef.current, {
          scale: 2.4,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out'
        });
      }

      gsap.fromTo(cursorRef.current,
        { scale: 0.75 },
        { scale: hoveredTarget.current ? 1.4 : 1, duration: 0.3, ease: 'back.out(2)' }
      );
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Hover States (Element Magnetism Binding)
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target.closest('.magnetic, a, button');
      if (target) {
        hoveredTarget.current = target;
        audioManager.playHoverSound();

        gsap.to(cursorRef.current, {
          scale: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.9)',
          duration: 0.25,
          ease: 'power3.out'
        });

        gsap.to(dotRef.current, {
          scale: 0.6,
          duration: 0.2
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('.magnetic, a, button');
      if (target) {
        // Reset magnetic position of the element
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        });

        hoveredTarget.current = null;

        gsap.to(cursorRef.current, {
          scale: 1,
          borderColor: 'rgba(255, 255, 255, 0.35)',
          duration: 0.25,
          ease: 'power3.out'
        });

        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.2
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div className="sotd-cursor-wrapper">
        <div ref={rippleRef} className="sotd-cursor-ripple"></div>
        <div ref={cursorRef} className="sotd-cursor-outer"></div>
        <div ref={dotRef} className="sotd-cursor-dot"></div>
      </div>
    </>
  );
}
