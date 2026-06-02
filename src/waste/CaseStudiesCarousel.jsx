import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CASE_STUDIES = [
  {
    id: 1,
    title: 'E-Commerce Redesign',
    category: 'Case Study',
    description: 'A complete overhaul of the checkout experience, increasing conversion rates by 24% and reducing cart abandonment.',
    tags: ['UX Design', 'A/B Testing', 'React'],
    bgImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Fintech Mobile App',
    category: 'Case Study',
    description: 'Designing a secure, intuitive mobile banking application focusing on accessibility and seamless transactions.',
    tags: ['Mobile UI', 'Prototyping', 'Figma'],
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'AI Dashboard',
    category: 'Case Study',
    description: 'Creating a robust data visualization dashboard for complex AI metrics, translating raw data into actionable insights.',
    tags: ['Data Viz', 'Enterprise', 'Design System'],
    bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Health & Wellness Platform',
    category: 'Case Study',
    description: 'An inclusive wellness tracking application featuring gamified goals and vibrant, engaging typography.',
    tags: ['UX/UI', 'Gamification', 'Animation'],
    bgImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop',
  }
];

export default function CaseStudiesCarousel({ theme }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx = gsap.context(() => {
      const track = trackRef.current;
      const cards = cardsRef.current;
      
      if (!track || !cards.length) return;

      // Calculate total scrollable width
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        // We want the last card to stop exactly in the center of the screen
        // Each card is ~40vw, with gaps. Let's just scroll enough so the last card hits the center.
        return trackWidth - viewportWidth;
      };

      const scrollAmount = getScrollAmount();
      
      // Calculate snap points
      // We have 4 cards, so we need 4 snap points mapping to the center of each card
      // Using an array of progress values
      const snapPoints = cards.map((_, i) => i / (cards.length - 1));

      triggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${scrollAmount * 2}`, // Expand scroll height to make scrolling slower and smoother
        pin: true,
        animation: gsap.to(track, {
          x: () => -scrollAmount,
          ease: 'none',
        }),
        scrub: prefersReducedMotion ? false : 1, // Smooth scrubbing
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.3, max: 0.5 },
          delay: 0.1,
          ease: 'power1.inOut',
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Determine active index based on progress
          const progress = self.progress;
          let closestIndex = 0;
          let minDiff = 1;
          
          snapPoints.forEach((point, i) => {
            const diff = Math.abs(progress - point);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = i;
            }
          });

          if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
          }

          // Parallax calculation for background images
          if (!prefersReducedMotion) {
            cards.forEach((card, i) => {
              const bg = card.querySelector('.card-bg-img');
              if (bg) {
                // Background shifts opposite to scroll direction
                // Progress goes 0 -> 1. We map it to -20% -> 20%
                const parallaxX = (progress - snapPoints[i]) * 100; 
                gsap.set(bg, { x: `${parallaxX}%` });
              }
            });
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  const scrollToCard = (index) => {
    if (!triggerRef.current) return;
    
    // Calculate the target scroll position based on the trigger's start and end
    const st = triggerRef.current;
    const scrollRange = st.end - st.start;
    const progress = index / (CASE_STUDIES.length - 1);
    const targetY = st.start + (scrollRange * progress);

    gsap.to(window, {
      scrollTo: targetY,
      duration: 0.8,
      ease: 'power3.inOut'
    });
  };

  const nextCard = () => {
    if (activeIndex < CASE_STUDIES.length - 1) scrollToCard(activeIndex + 1);
  };

  const prevCard = () => {
    if (activeIndex > 0) scrollToCard(activeIndex - 1);
  };

  return (
    <section ref={containerRef} className="carousel-section" style={{ backgroundColor: theme.bg }}>
      <div className="carousel-header">
        <h2 className="carousel-title" style={{ color: theme.text }}>SELECTED WORKS</h2>
        <div className="carousel-nav">
          <button onClick={prevCard} disabled={activeIndex === 0} className="nav-arrow" style={{ borderColor: theme.text, color: theme.text }}>
            ←
          </button>
          <button onClick={nextCard} disabled={activeIndex === CASE_STUDIES.length - 1} className="nav-arrow" style={{ borderColor: theme.text, color: theme.text }}>
            →
          </button>
        </div>
      </div>

      <div className="carousel-track-container">
        <div ref={trackRef} className="carousel-track">
          {/* Spacer block to push first item to center */}
          <div className="carousel-spacer"></div>

          {CASE_STUDIES.map((study, i) => {
            const isActive = activeIndex === i;
            
            return (
              <div 
                key={study.id} 
                ref={el => cardsRef.current[i] = el}
                className={`case-study-card ${isActive ? 'active' : ''}`}
                onClick={() => !isActive && scrollToCard(i)}
              >
                <div className="card-inner">
                  <div className="card-bg">
                    <img className="card-bg-img" src={study.bgImage} alt={study.title} />
                    <div className="card-overlay" style={{ backgroundColor: theme.bg }}></div>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="card-category" style={{ color: theme.text }}>{study.category}</span>
                      <span className="card-index" style={{ color: `${theme.text}80` }}>0{i + 1}</span>
                    </div>
                    
                    <h3 className="card-title" style={{ color: '#fff' }}>{study.title}</h3>
                    
                    <div className="card-details">
                      <p className="card-description" style={{ color: '#ddd' }}>{study.description}</p>
                      <div className="card-tags">
                        {study.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <button className="card-cta" style={{ backgroundColor: theme.text, color: theme.bg }}>
                        View Case Study
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Spacer block to allow last item to center */}
          <div className="carousel-spacer"></div>
        </div>
      </div>
    </section>
  );
}
