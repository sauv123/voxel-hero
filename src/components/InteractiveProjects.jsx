import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Footer from './Footer';

export const PROJECTS = [
  {
    id: "01",
    name: "OLO",
    title: "Olo",
    tags: ["EMOTIONAL DESIGN", "UX", "UI"],
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/olo.webp",
    cta: "Turning small hellos into meaningful growth through introverted design.",
    link: "https://olocasestudy.netlify.app"
  },
  {
    id: "02",
    name: "ELI5",
    title: "ELI5",
    tags: ["UX DESIGN", "INTERACTION & UX SYSTEMS"],
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/works/media__1777587436505.webp",
    cta: "Transforms complexity into visual clarity instantly.",
    link: "https://eli5casestudy.netlify.app"
  },
  {
    id: "03",
    name: "IKEAXPEANUTS",
    title: "IkeaxPeanuts",
    tags: ["EMOTIONAL EXPERIENCE DESIGN", "NARRATIVE SERVICE DESIGN"],
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/ikeapeanuts.webp",
    cta: "Transforming retail spaces into emotional storytelling experiences.",
    link: "https://ikeapeanutscasestudy.netlify.app/"
  },
  {
    id: "04",
    name: "KRIZIA",
    title: "Krizia",
    tags: ["Web Design", "Branding"],
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/krizia.mp4",
    cta: "Transforming sound into a global visual experience.",
    link: "https://kriziacasestudy.netlify.app/"
  },
  {
    id: "05",
    name: "MICA",
    title: "MICA",
    tags: ["UX DESIGN", "CO-LIVING DESIGN"],
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/mica.webp", 
    cta: "Designing belonging through emotionally intelligent housing experiences."
  }
];

export default function InteractiveProjects({ theme, onProjectSelect }) {
  const containerRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const wrappers = gsap.utils.toArray('.folder-wrapper');
      
      // 1. PAGE LOAD — staggered entrance
      gsap.set(wrappers, { y: 60, opacity: 0 });
      gsap.to(wrappers, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.2 });

      // 2. PARALLAX AND ENTRANCE
      wrappers.forEach((wrapper, i) => {
        const shoeImg = wrapper.querySelector('.ps-shoe img');
        const aside = wrapper.querySelector('.ps-aside');

        ScrollTrigger.create({
          trigger: wrapper, 
          start: 'top 80%', 
          once: true,
          scroller: document.querySelector(".gallery-overlay"),
          onEnter: () => {
            if (aside) gsap.fromTo(aside, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out' });
            if (shoeImg) gsap.fromTo(shoeImg, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power3.out' });
          }
        });

        // Tab Hover Interactions
        const tab = wrapper.querySelector('.fn-tab');
        if (tab) {
          tab.addEventListener('mouseenter', () => {
            gsap.to(tab, { height: 56, y: -16, duration: 0.4, ease: 'back.out(2)' });
          });
          tab.addEventListener('mouseleave', () => {
            gsap.to(tab, { height: 40, y: 0, duration: 0.4, ease: 'power2.out' });
          });
          tab.addEventListener('click', (e) => {
            // Prevent the folder click from triggering if they click the tab
            e.stopPropagation();
            document.querySelector('.gallery-overlay')?.scrollTo({
              top: wrapper.offsetTop - 40,
              behavior: 'smooth'
            });
          });
        }
      });

      // Custom Cursor Logic
      const cursor = document.querySelector('.f-custom-cursor');
      const cursorText = document.querySelector('.f-custom-cursor-text');
      const cursorCta = document.querySelector('.f-custom-cursor-cta');
      
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      const xSet = gsap.quickSetter(cursor, "x", "px");
      const ySet = gsap.quickSetter(cursor, "y", "px");

      window.addEventListener('mousemove', (e) => {
        xSet(e.clientX);
        ySet(e.clientY);
      });

      const folderContents = gsap.utils.toArray('.folder-content');
      folderContents.forEach(content => {
        content.addEventListener('mouseenter', (e) => {
          const bg = e.currentTarget.dataset.txt;
          const txt = e.currentTarget.dataset.bg;
          const title = e.currentTarget.dataset.title;
          const cta = e.currentTarget.dataset.cta;
          
          cursorText.innerText = cta;
          cursorCta.innerText = "VIEW NOW";
          gsap.to(cursorCta, { color: bg, backgroundColor: txt, duration: 0 });

          gsap.to(cursor, { 
            scale: 1, 
            autoAlpha: 1, 
            backgroundColor: bg, 
            color: txt, 
            duration: 0.4, 
            ease: 'back.out(1.5)' 
          });
        });

        content.addEventListener('mouseleave', () => {
          gsap.to(cursor, { scale: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.out' });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="illustrative-work-container" ref={containerRef}>
      
      {/* GLOBAL CUSTOM CURSOR */}
      <div className="f-custom-cursor">
        <span className="f-custom-cursor-text"></span>
        <div className="f-custom-cursor-cta"></div>
      </div>

      {/* HERO */}
      <section className="f-hero">
        <div className="paper-texture"></div>
        <div className="f-hero-content">
          <h1 className="f-hero-title">
            Creative<br/>Visions.
          </h1>
          <p className="f-hero-subtitle">
            A COLLECTION OF HUMAN-CENTRIC, TACTILE,<br/>
            AND IMAGINATIVE CASE STUDIES.
          </p>
        </div>
        <div className="f-hero-badge">
          <span>SAUVEER SINHA</span>
          <br/>
          <span>WORKS '24</span>
        </div>
      </section>

      {/* STAGGERED FOLDERS */}
      {PROJECTS.map((proj, i) => (
        <div key={proj.id} className={`folder-wrapper nr-0${i+1}`} style={{ '--bg': proj.bgColor, '--txt': proj.textColor }}>
          
          {/* STAGGERED TAB */}
          <div className="fn-tab" style={{ left: `${i * 20}%`, width: '20%' }}>
            <span className="fn-tab-label">{proj.name}</span>
            <span className="fn-tab-id mobile-only">{proj.id}</span>
          </div>

          {/* FOLDER BODY */}
          <div 
            className="folder-content" 
            data-bg={proj.bgColor} 
            data-txt={proj.textColor} 
            data-title={proj.title}
            data-cta={proj.cta}
            onClick={() => {
              if (onProjectSelect) onProjectSelect(i);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="paper-texture"></div>
            
            <div className="fc-header">
              <span className="fn-num">{proj.id}</span>
              <span className="fn-name">{proj.title}</span>
              <div className="fn-tags">
                {proj.tags.map(tag => (
                  <span key={tag} className="ftag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="fc-body">
              <div className="ps-shoe">
                {proj.img ? (
                  proj.img.endsWith('.mp4') ? (
                    <video 
                      src={proj.img} autoPlay loop muted playsInline 
                    />
                  ) : (
                    <img src={proj.img} alt={proj.title} loading="lazy" />
                  )
                ) : (
                  <div className="ps-shoe-placeholder"><div className="shoe-icon">🎨</div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* FOOTER */}
      <Footer theme={theme} />
    </div>
  );
}
