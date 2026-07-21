import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../cms/projects';

gsap.registerPlugin(ScrollTrigger);

export default function WorkFolder({ theme, onOpen }) {
  const wordChars = useRef([]);
  const curiousText = useRef();
  const voxelFolder = useRef();
  const workSection = useRef();
  const wordRow = useRef();

  useEffect(() => {
    // Scroll Entrance
    gsap.fromTo(wordChars.current, 
      { y: "100%", skewY: 8, opacity: 0 },
      {
        y: "0%", 
        skewY: 0, 
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: workSection.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // Opacity snap
    wordChars.current.forEach((char, i) => {
      if (char) {
        gsap.to(char, {
          opacity: 1,
          duration: 0.2,
          delay: (i * 0.08) + 0.65,
          ease: "steps(1)"
        });
      }
    });

    // Curious text
    gsap.to(curiousText.current, {
      opacity: 1, 
      y: 0, 
      duration: 0.9, 
      ease: "power2.out",
      scrollTrigger: { trigger: workSection.current, start: "top 65%" }
    });

    // Mobile Work Header Scroll Animation
    gsap.fromTo('.mobile-work-header',
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: workSection.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Folder entrance
    gsap.fromTo(voxelFolder.current,
      { opacity: 0, y: 60, scale: 0.94 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1.1, 
        ease: "back.out(1.6)", 
        delay: 0.2,
        scrollTrigger: { trigger: workSection.current, start: "top 60%" }
      }
    );

    // Hover Animation for "Work"
    let wordHoverTl = gsap.timeline({ paused: true });
    wordHoverTl.to(wordChars.current, {
      color: theme.text,
      stagger: {
        each: 0.1,
        from: "center"
      },
      ease: "power2.inOut",
      duration: 0.5
    });

    const folderEl = voxelFolder.current;
    
    const handleMouseEnter = () => { wordHoverTl.play(); folderEl.classList.add("is-open"); };
    const handleMouseLeave = () => { wordHoverTl.reverse(); folderEl.classList.remove("is-open"); };
    
    // Folder 3D Tilt
    const handleMouseMove = (e) => {
      const rect = folderEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(folderEl, {
        rotationY: x * 4,
        rotationX: y * -2,
        duration: 0.3, 
        ease: "power2.out"
      });
    };

    const handleTiltLeave = () => {
      gsap.to(folderEl, {
        rotationY: 0, 
        rotationX: 0,
        duration: 0.4, 
        ease: "power2.out"
      });
    };

    if (folderEl) {
      folderEl.addEventListener('mouseenter', handleMouseEnter);
      folderEl.addEventListener('mouseleave', handleMouseLeave);
      folderEl.addEventListener('mousemove', handleMouseMove);
      folderEl.addEventListener('mouseleave', handleTiltLeave);
    }

    // Mobile: open folder on scroll
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile && folderEl) {
      ScrollTrigger.create({
        trigger: workSection.current,
        start: "top 45%",
        end: "bottom 30%",
        onEnter: () => {
          folderEl.classList.add("is-open");
          wordHoverTl.play();
        },
        onLeaveBack: () => {
          folderEl.classList.remove("is-open");
          wordHoverTl.reverse();
        },
        onLeave: () => {
          folderEl.classList.remove("is-open");
          wordHoverTl.reverse();
        },
        onEnterBack: () => {
          folderEl.classList.add("is-open");
          wordHoverTl.play();
        }
      });
    }

    return () => {
      if (folderEl) {
        folderEl.removeEventListener('mouseenter', handleMouseEnter);
        folderEl.removeEventListener('mouseleave', handleMouseLeave);
        folderEl.removeEventListener('mousemove', handleMouseMove);
        folderEl.removeEventListener('mouseleave', handleTiltLeave);
      }
    };
  }, [theme]);

  // Handle click on the folder
  const handleFolderClick = () => {
    // Play burst exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        if (onOpen) onOpen();
        // Restore elements after open
        gsap.set([wordChars.current, curiousText.current, voxelFolder.current], { clearProps: "all" });
      }
    });

    // Zoom out the whole row a bit
    tl.to(wordRow.current, { scale: 0.8, opacity: 0, duration: 0.6, ease: "power3.in" }, 0);
    tl.to(curiousText.current, { opacity: 0, y: -20, duration: 0.4 }, 0);
    tl.to('.mobile-work-cta', { opacity: 0, y: 10, duration: 0.4 }, 0);
  };

  // Handle individual file card hover
  const handleCardEnter = (e) => {
    gsap.to(e.currentTarget, { y: -4, scale: 1.03, duration: 0.22, ease: "power2.out" });
  };
  
  const handleCardLeave = (e) => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.22, ease: "power2.out" });
  };

  const addToRefs = (el) => {
    if (el && !wordChars.current.includes(el)) {
      wordChars.current.push(el);
    }
  };

  return (
    <>
      <section className="work-section" id="workSection" ref={workSection}>
          <div className="curious-text" id="curiousText" ref={curiousText} style={{ color: theme.text }}>Curious?... Check out my</div>
          
          <div className="word-row" id="wordRow" ref={wordRow}>
              <span className="word-char desktop-char" ref={addToRefs} style={{ color: `${theme.text}20` }}>W</span>
              
              <div className="mobile-work-header" style={{ color: `${theme.text}90` }}>WORK</div>

              <div className="voxel-folder" id="voxelFolder" ref={voxelFolder} onClick={handleFolderClick}>
                  <div className="folder-hitbox"></div>
                  {/* Back panel */}
                  <div className="folder-back" style={{ background: theme.text, opacity: 0.8 }}>
                      <div className="folder-back-tab" style={{ background: theme.text, opacity: 0.9 }}>
                          <span className="tab-text" style={{ color: theme.bg }}>Portfolio</span>
                      </div>
                  </div>

                  {/* Files inside */}
                  <div className="files-container">
                    {[PROJECTS[1], PROJECTS[0], PROJECTS[2]].map((proj, idx) => (
                      <div key={proj.id} className={`file-card proj-preview-${idx}`} style={{ 
                        position: "absolute", bottom: "10%", left: "10%", width: "80%", height: "120%",
                        padding: 0, overflow: 'hidden', transformOrigin: "bottom center",
                        background: '#0d0d0d', border: `2px solid ${theme.text}40`
                      }}>
                        {proj.img?.endsWith('.mp4') ? (
                          <video src={proj.img} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        ) : (
                          <img src={proj.img} alt={proj.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Front panel */}
                  <div className="folder-front" style={{ background: theme.text }}>
                      <div className="folder-front-tab" style={{ background: theme.text, opacity: 0.9 }}>
                          <span className="tab-text" style={{ color: theme.bg }}>Portfolio</span>
                      </div>
                      <div className="folder-ss">SS</div>
                  </div>
                  {/* Mobile Call To Action */}
                  <div className="mobile-work-cta" style={{
                    display: "none", position: "absolute", bottom: -50, width: "100%", 
                    textAlign: "center", fontSize: 13, fontWeight: 700, 
                    color: theme.text, fontFamily: "var(--font-heading)", letterSpacing: 1
                  }}>TAP FOLDER TO OPEN</div>
              </div>
              
              <span className="word-char desktop-char" ref={addToRefs} style={{ color: `${theme.text}20` }}>r</span>
              <span className="word-char desktop-char" ref={addToRefs} style={{ color: `${theme.text}20` }}>k</span>
          </div>
      </section>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-work-cta {
            display: block !important;
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
}
