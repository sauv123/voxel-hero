import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    id: 'wireframe',
    thought: "Let's map out the core architecture. No distractions, just structure.",
    notes: [
      { text: "Keep navigation minimal", top: "10%", left: "70%", rot: 5 },
      { text: "Focus on the main CTA", top: "80%", left: "10%", rot: -3 }
    ],
    snippet: "<Container>\n  <Header />\n  <Hero />\n</Container>"
  },
  {
    id: 'lowfi',
    thought: "Fleshing out the hierarchy. Defining the grid and spatial rhythm.",
    notes: [
      { text: "Needs more whitespace", top: "15%", left: "5%", rot: -6 },
      { text: "Use an 8px baseline grid", top: "60%", left: "65%", rot: 4 }
    ],
    snippet: ".grid {\n  display: grid;\n  gap: 24px;\n}"
  },
  {
    id: 'hifi',
    thought: "Injecting brand DNA. Typography, colors, and visual weight.",
    notes: [
      { text: "Try Space Grotesk here", top: "5%", left: "60%", rot: 3 },
      { text: "Too much contrast?", top: "85%", left: "20%", rot: -5 }
    ],
    snippet: "const theme = {\n  primary: '#0F0F0F',\n  accent: '#FF3366'\n};"
  },
  {
    id: 'polished',
    thought: "The final layer. Adding micro-interactions, depth, and polish.",
    notes: [
      { text: "Add spring physics", top: "20%", left: "75%", rot: 8 },
      { text: "Perfect.", top: "70%", left: "5%", rot: -2 }
    ],
    snippet: "gsap.to(el, {\n  y: -10,\n  duration: 0.6,\n  ease: 'back.out'\n});"
  }
];

export default function StickyProcess({ theme }) {
  const containerRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  const layersRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the right side
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: rightRef.current,
        scrub: true
      });

      // Animate the left side items and right side layers
      const steps = gsap.utils.toArray('.process-step');
      
      steps.forEach((step, i) => {
        // Left side animations
        const thought = step.querySelector('.step-thought');
        const notes = step.querySelectorAll('.step-note');
        const snippet = step.querySelector('.step-snippet');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            toggleActions: "play reverse play reverse"
          }
        });

        // Fade in/out left content
        tl.fromTo(thought, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(notes, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4 }, "-=0.2")
          .fromTo(snippet, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 }, "-=0.2")
          .to([thought, notes, snippet], { opacity: 0, y: -30, duration: 0.4 }, "+=0.2");

        // Right side layers evolution
        // Each layer fades in when its corresponding step is active
        if (layersRef.current[i]) {
            // Ensure previous layers stay visible or fade out depending on the effect desired.
            // For an evolving UI, layers might stack. We'll fade them in sequentially.
            gsap.to(layersRef.current[i], {
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: step,
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.5
                }
            });
            
            // If we want previous layers to fade out to show the new one cleanly:
            if (i > 0 && layersRef.current[i-1]) {
                gsap.to(layersRef.current[i-1], {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: step,
                        start: "top center",
                        end: "center center",
                        scrub: 0.5
                    }
                });
            }
        }
      });

      // Initial state for layers
      gsap.set(layersRef.current.slice(1), { opacity: 0, scale: 0.95 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sticky-process" ref={containerRef} style={{ background: theme.bg, color: theme.text }}>
      <div className="process-left" ref={leftRef}>
        <div className="process-padding"></div>
        {PROCESS_STEPS.map((step, i) => (
          <div key={i} className="process-step">
            <h3 className="step-thought">{step.thought}</h3>
            
            {step.notes.map((note, j) => (
              <div 
                key={j} 
                className="step-note" 
                style={{ top: note.top, left: note.left, transform: `rotate(${note.rot}deg)` }}
              >
                {note.text}
              </div>
            ))}
            
            <div className="step-snippet">
              <pre><code>{step.snippet}</code></pre>
            </div>
          </div>
        ))}
        <div className="process-padding"></div>
      </div>
      
      <div className="process-right" ref={rightRef}>
        <div className="ui-evolution-container">
          
          {/* Layer 0: Wireframe */}
          <div className="ui-layer ui-wireframe" ref={el => layersRef.current[0] = el} style={{ borderColor: `${theme.text}33` }}>
            <div className="wf-header" style={{ borderBottomColor: `${theme.text}33` }}>
               <div className="wf-circle" style={{ borderColor: `${theme.text}33` }}></div>
               <div className="wf-rect" style={{ borderColor: `${theme.text}33` }}></div>
            </div>
            <div className="wf-body">
               <div className="wf-hero" style={{ borderColor: `${theme.text}33` }}></div>
               <div className="wf-grid">
                 <div className="wf-card" style={{ borderColor: `${theme.text}33` }}></div>
                 <div className="wf-card" style={{ borderColor: `${theme.text}33` }}></div>
                 <div className="wf-card" style={{ borderColor: `${theme.text}33` }}></div>
               </div>
            </div>
          </div>

          {/* Layer 1: Low-Fi */}
          <div className="ui-layer ui-lowfi" ref={el => layersRef.current[1] = el} style={{ background: `${theme.text}0A`, borderColor: `${theme.text}1A` }}>
            <div className="lf-header" style={{ borderBottomColor: `${theme.text}1A` }}>
               <div className="lf-circle" style={{ background: `${theme.text}1A` }}></div>
               <div className="lf-rect" style={{ background: `${theme.text}1A` }}></div>
            </div>
            <div className="lf-body">
               <div className="lf-hero" style={{ background: `${theme.text}1A` }}>
                   <div className="lf-text-block" style={{ background: `${theme.text}33` }}></div>
                   <div className="lf-text-block short" style={{ background: `${theme.text}33` }}></div>
               </div>
               <div className="lf-grid">
                 <div className="lf-card" style={{ background: `${theme.text}1A` }}></div>
                 <div className="lf-card" style={{ background: `${theme.text}1A` }}></div>
                 <div className="lf-card" style={{ background: `${theme.text}1A` }}></div>
               </div>
            </div>
          </div>

          {/* Layer 2: Hi-Fi */}
          <div className="ui-layer ui-hifi" ref={el => layersRef.current[2] = el} style={{ background: theme.bg, borderColor: `${theme.text}33` }}>
            <div className="hf-header" style={{ borderBottomColor: `${theme.text}1A` }}>
               <div className="hf-logo" style={{ background: theme.text }}></div>
               <div className="hf-nav">
                  <div className="hf-nav-item" style={{ background: `${theme.text}1A` }}></div>
                  <div className="hf-nav-item" style={{ background: `${theme.text}1A` }}></div>
               </div>
            </div>
            <div className="hf-body">
               <div className="hf-hero">
                   <h1 style={{ color: theme.text }}>Dashboard</h1>
                   <p style={{ color: `${theme.text}80` }}>Overview of your analytics</p>
               </div>
               <div className="hf-grid">
                 <div className="hf-card" style={{ background: `${theme.text}05`, borderColor: `${theme.text}1A` }}>
                    <div className="hf-chart" style={{ background: theme.text }}></div>
                 </div>
                 <div className="hf-card" style={{ background: `${theme.text}05`, borderColor: `${theme.text}1A` }}>
                    <div className="hf-chart" style={{ background: theme.text, height: '60%' }}></div>
                 </div>
                 <div className="hf-card" style={{ background: `${theme.text}05`, borderColor: `${theme.text}1A` }}>
                    <div className="hf-chart" style={{ background: theme.text, height: '80%' }}></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Layer 3: Polished */}
          <div className="ui-layer ui-polished" ref={el => layersRef.current[3] = el}>
            <div className="po-glass">
                <div className="po-header">
                  <div className="po-logo">Voxel</div>
                  <div className="po-user"></div>
                </div>
                <div className="po-body">
                  <div className="po-stats">
                     <div className="po-stat-card">
                       <span className="po-label">Revenue</span>
                       <span className="po-value">$124,500</span>
                       <div className="po-trend up">+14.5%</div>
                     </div>
                     <div className="po-stat-card">
                       <span className="po-label">Active Users</span>
                       <span className="po-value">8,432</span>
                       <div className="po-trend up">+5.2%</div>
                     </div>
                  </div>
                  <div className="po-main-chart">
                     <div className="po-chart-bar" style={{height: '40%'}}></div>
                     <div className="po-chart-bar" style={{height: '70%'}}></div>
                     <div className="po-chart-bar" style={{height: '50%'}}></div>
                     <div className="po-chart-bar" style={{height: '90%'}}></div>
                     <div className="po-chart-bar" style={{height: '60%'}}></div>
                     <div className="po-chart-bar" style={{height: '100%', background: '#FF3366'}}></div>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
