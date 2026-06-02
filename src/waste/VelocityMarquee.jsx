import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VelocityMarquee({ theme }) {
  const containerRef = useRef();
  const text1Ref = useRef();
  const text2Ref = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Simple scroll-scrubbed horizontal movement
      gsap.to(text1Ref.current, {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.fromTo(text2Ref.current, 
        { xPercent: -30 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="velocity-marquee" ref={containerRef}>
      <div className="marquee-row">
        <h1 className="marquee-text" ref={text1Ref} style={{ color: theme.text }}>
          DIGITAL CRAFTSMANSHIP • HUMAN CENTRIC UX • SEAMLESS INTERACTION • DIGITAL CRAFTSMANSHIP • HUMAN CENTRIC UX •
        </h1>
      </div>
      <div className="marquee-row">
        <h1 className="marquee-text outline" ref={text2Ref} style={{ WebkitTextStroke: `2px ${theme.text}` }}>
          INNOVATIVE SYSTEMS • BOLD AESTHETICS • EXPERIMENTAL DESIGN • INNOVATIVE SYSTEMS • BOLD AESTHETICS • EXPERIMENTAL DESIGN •
        </h1>
      </div>
    </section>
  );
}
