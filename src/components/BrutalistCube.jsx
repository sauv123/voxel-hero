import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './brutalist-cube.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrutalistCube({ inFooter = false }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const wrapperRef = useRef(null);
  const cubeRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Background ASCII System Generation
      const bg = bgRef.current;
      if (bg && bg.children.length === 0) {
        const textToStream = "SAUVEER_UX_AI_SYSTEM_BUILD_CRAFT_INTENTION_EQUIVALENT_TO_HUNDRED_MEN_OPEN_SOURCE_DESIGN_";
        const columns = Math.ceil(window.innerWidth / 20); 
        const charsPerCol = 100;

        for (let i = 0; i < columns; i++) {
            const stream = document.createElement('div');
            stream.className = 'bg-stream';
            stream.style.left = `${i * 20}px`;
            stream.style.top = `${Math.random() * -100}px`;
            
            let contentStr = "";
            for (let j = 0; j < charsPerCol; j++) {
                contentStr += textToStream[Math.floor(Math.random() * textToStream.length)];
                contentStr += "<br>";
            }
            stream.innerHTML = contentStr;
            bg.appendChild(stream);
        }
      }

      // 2. Initial State
      gsap.set(cubeRef.current, { rotateX: 12, rotateY: 18 }); 

      // 3. Hover & Mouse Physics
      const wrapper = wrapperRef.current;
      let floatTL = null; 

      const handleMouseEnter = () => {
          gsap.to(wrapper, { y: -40, scale: 1.05, duration: 0.6, ease: "power2.out" });

          floatTL = gsap.timeline({ repeat: -1, yoyo: true });
          floatTL.to(wrapper, { y: "-=20", duration: 1.5, ease: "sine.inOut" })
                 .to(wrapper, { rotationZ: 2, duration: 2, ease: "sine.inOut" }, 0)
                 .to(wrapper, { rotationX: "+=4", rotationY: "-=4", duration: 3, ease: "sine.inOut"}, 0);
      };

      const handleMouseLeave = () => {
          if (floatTL) floatTL.kill();
          gsap.to(wrapper, { y: 0, scale: 1, rotationZ: 0, rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.6)" });
      };

      wrapper.addEventListener('mouseenter', handleMouseEnter);
      wrapper.addEventListener('mouseleave', handleMouseLeave);

      // Mouse Move Physics
      const sceneEl = document.querySelector('.bc-scene');
      const handleMouseMove = (e) => {
          if (floatTL && floatTL.isActive()) return; 
          const x = (e.clientX / window.innerWidth - 0.5) * 35; 
          const y = (e.clientY / window.innerHeight - 0.5) * -35;
          gsap.to(wrapper, { rotationY: x, rotationX: y, duration: 1.2, ease: "power3.out" });
      };
      
      if (sceneEl) sceneEl.addEventListener('mousemove', handleMouseMove);

      // 4. ScrollTrigger Cinematic Storytelling OR continuous if inFooter
      if (!inFooter) {
          const tl = gsap.timeline({
              scrollTrigger: {
                  trigger: containerRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1.2, 
              }
          });

          const rubikEase = "expo.inOut"; 

          tl.to(cubeRef.current, { rotateY: -75, rotateX: 5, duration: 1, ease: rubikEase })                    
            .to(cubeRef.current, { rotateY: -165, rotateX: -5, duration: 1, ease: rubikEase })                  
            .to(cubeRef.current, { rotateY: -282, rotateX: 12, duration: 1, ease: rubikEase })                  
            .to(cubeRef.current, { rotateX: -78, rotateY: -350, duration: 1, ease: rubikEase })                 
            .to(cubeRef.current, { rotateX: 78, rotateY: -355, duration: 1, ease: rubikEase });                 
              
          // 5. Parallax Background Animation
          ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              onUpdate: (self) => {
                  gsap.to('.bg-stream', { y: self.progress * 500, duration: 0.5, stagger: 0.01, overwrite: true });
              }
          });
      } else {
          // Continuous rotation for footer
          gsap.to(cubeRef.current, {
              rotateY: "+=360",
              rotateX: "+=360",
              duration: 20,
              ease: "none",
              repeat: -1
          });
      }

      return () => {
        wrapper.removeEventListener('mouseenter', handleMouseEnter);
        wrapper.removeEventListener('mouseleave', handleMouseLeave);
        if (sceneEl) sceneEl.removeEventListener('mousemove', handleMouseMove);
      };

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={`bc-container ${inFooter ? 'in-footer' : ''}`} ref={containerRef}>
      <div className={`bc-sticky ${inFooter ? 'in-footer' : ''}`}>

        <div className="bc-scene">
          <div className="bc-cube-wrapper" ref={wrapperRef}>
            <div className="bc-cube" ref={cubeRef}>
              
              {/* SIDE 1: RED */}
              <div className="bc-face bc-face--front">
                <div className="bc-content">
                  <div className="bc-face-body">
                    <span className="bc-highlight">Hi, I'm Sauveer &mdash;</span><br/>
                    equivalent to a hundred men in Sanskrit
                  </div>
                </div>
              </div>

              {/* SIDE 2: BLUE */}
              <div className="bc-face bc-face--right">
                <div className="bc-content">
                  <div className="bc-face-body" style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>
                    <span className="bc-highlight">What i do</span><br/>
                    UX AI / Service / Art Direction
                  </div>
                </div>
              </div>

              {/* SIDE 3: YELLOW */}
              <div className="bc-face bc-face--back">
                <div className="bc-content">
                  <div className="bc-face-body">
                    Over the last 6 years, ive evolved from a ux designer to a <span className="bc-highlight">product builder</span>
                  </div>
                </div>
              </div>

              {/* SIDE 4: GREEN */}
              <div className="bc-face bc-face--left">
                <div className="bc-content">
                  <div className="bc-face-body">
                    <span className="bc-highlight">Open source</span> changed how I build<br/><br/>
                    Experiment, adapt, and create without limitations
                  </div>
                </div>
              </div>

              {/* SIDE 5: ORANGE */}
              <div className="bc-face bc-face--top">
                <div className="bc-content">
                  <div className="bc-face-body">
                    AI turns ideas into reality faster<br/><br/>
                    <span className="bc-highlight">But craft</span> makes the work meaningful
                  </div>
                </div>
              </div>

              {/* SIDE 6: WHITE */}
              <div className="bc-face bc-face--bottom">
                <div className="bc-content">
                  <div className="bc-face-body">
                    <span className="bc-highlight">Direction</span><br/>
                    I’m drawn to teams that value quality, intention, and how things feel
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
