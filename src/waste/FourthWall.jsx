import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FourthWall({ theme }) {
  const containerRef = useRef();
  const wallRef = useRef();
  const roomRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Perspective shift timeline
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Long scroll for dramatic effect
        pin: true,
        scrub: true,
        animation: gsap.timeline()
          // Step 1: Normal flat reading -> Sudden tilt backwards
          .to(wallRef.current, { rotationX: 45, rotationY: -15, scale: 0.6, z: -500, duration: 2, ease: "power2.inOut" })
          // Step 2: The room lights up, revealing floating notes in the 3D space around the "wall"
          .to(".fw-note", { opacity: 1, stagger: 0.2, duration: 1 }, "<1")
          // Step 3: Pan around the room
          .to(roomRef.current, { rotationY: 30, duration: 3, ease: "none" })
          // Step 4: Snap back to flat to continue scrolling
          .to(wallRef.current, { rotationX: 0, rotationY: 0, scale: 1, z: 0, duration: 2, ease: "power3.inOut" })
          .to(".fw-note", { opacity: 0, duration: 1 }, "<")
          .to(roomRef.current, { rotationY: 0, duration: 2 }, "<")
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="fourth-wall" ref={containerRef}>
      <div className="fw-room" ref={roomRef}>
        
        {/* The fake "website" wall */}
        <div className="fw-wall" ref={wallRef} style={{ backgroundColor: '#FCFAF2', color: '#080808' }}>
          <h2 className="fw-title">BREAKING THE FOURTH WALL</h2>
          <p className="fw-desc">
            A website is often just a flat 2D plane of pixels. But true interactive design treats the viewport as a window into a vast, dimensional space. Scroll to shift your perspective.
          </p>
          <div className="fw-mock-ui">
            <div className="fwm-header"></div>
            <div className="fwm-body"></div>
            <div className="fwm-body-small"></div>
          </div>
        </div>

        {/* The hidden notes in the 3D room */}
        <div className="fw-note n1" style={{ color: theme.text }}>ROUGH SKETCH V1</div>
        <div className="fw-note n2" style={{ color: theme.text }}>USER JOURNEY MAP</div>
        <div className="fw-note n3" style={{ color: theme.text }}>"MAKE IT POP"</div>
        <div className="fw-note n4" style={{ color: theme.text }}>WIREFRAMES</div>

      </div>
    </section>
  );
}
