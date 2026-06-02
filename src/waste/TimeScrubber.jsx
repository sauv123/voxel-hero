import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// The raw stream of thoughts — from chaos to clarity
const THOUGHTS = [
  { type: 'raw',    text: '// a person is frustrated.\n// they cannot find what they need.', label: null },
  { type: 'raw',    text: '// why?\n// too much noise. zero hierarchy.', label: null },
  { type: 'insight',text: '"How might we surface the\nright information at the\nright moment?"', label: 'HMW STATEMENT' },
  { type: 'code',   text: 'const user = { goal: "find help fast",\n  frustration: 9.2,\n  time: "< 30 seconds" };', label: 'USER DATA' },
  { type: 'code',   text: 'function solve(user) {\n  const signal = distillNoise(user);\n  return buildClarity(signal);\n}', label: 'LOGIC' },
  { type: 'shipped',text: '// shipped.\n// 94% task success rate.\n// 3.2s → 0.8s avg. time-on-task.', label: 'OUTCOME' },
];

export default function TimeScrubber({ theme }) {
  const sectionRef = useRef();
  const thoughtRefs = useRef([]);

  // Right side UI mock refs
  const uiFrameRef = useRef();
  const uiHeaderRef = useRef();
  const uiNavDot1 = useRef();
  const uiNavDot2 = useRef();
  const uiNavDot3 = useRef();
  const uiHeroBlockRef = useRef();
  const uiBodyLine1 = useRef();
  const uiBodyLine2 = useRef();
  const uiBodyLine3 = useRef();
  const uiCardRef = useRef();
  const uiButtonRef = useRef();
  const uiGlowRef = useRef();
  const progressRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {

      const SCROLL_DIST = window.innerHeight * 6; // Long cinematic scroll

      // Set all items invisible to start
      gsap.set(thoughtRefs.current, { opacity: 0, y: 20 });
      gsap.set([
        uiFrameRef.current,
        uiHeaderRef.current,
        uiNavDot1.current, uiNavDot2.current, uiNavDot3.current,
        uiHeroBlockRef.current,
        uiBodyLine1.current, uiBodyLine2.current, uiBodyLine3.current,
        uiCardRef.current,
        uiButtonRef.current,
        uiGlowRef.current,
      ], { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${SCROLL_DIST}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        }
      });

      // ── Progress bar scrubs with timeline
      tl.to(progressRef.current, { scaleX: 1, transformOrigin: 'left', ease: 'none', duration: 18 }, 0);

      // ── Act 1: Frame appears — like a napkin sketch
      tl.to(uiFrameRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, 0)
        .to(thoughtRefs.current[0], { opacity: 1, y: 0, duration: 1 }, 0.5);

      // ── Act 2: The header bar draws in
      tl.to(uiHeaderRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 2)
        .to(thoughtRefs.current[1], { opacity: 1, y: 0, duration: 1 }, 2)
        .to(thoughtRefs.current[0], { opacity: 0.25, duration: 0.5 }, 2);

      // ── Act 3: Nav dots pop in one by one
      tl.to(uiNavDot1.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 3.2)
        .to(uiNavDot2.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 3.5)
        .to(uiNavDot3.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 3.8)
        .to(thoughtRefs.current[2], { opacity: 1, y: 0, duration: 1 }, 3.5)
        .to(thoughtRefs.current[1], { opacity: 0.25, duration: 0.5 }, 3.5);

      // ── Act 4: Hero content block
      tl.to(uiHeroBlockRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, 5)
        .to(thoughtRefs.current[3], { opacity: 1, y: 0, duration: 1 }, 5.2)
        .to(thoughtRefs.current[2], { opacity: 0.25, duration: 0.5 }, 5.2);

      // ── Act 5: Body content lines
      tl.to(uiBodyLine1.current, { opacity: 1, scale: 1, duration: 0.6 }, 7)
        .to(uiBodyLine2.current, { opacity: 1, scale: 1, duration: 0.6 }, 7.4)
        .to(uiBodyLine3.current, { opacity: 1, scale: 1, duration: 0.6 }, 7.8)
        .to(thoughtRefs.current[4], { opacity: 1, y: 0, duration: 1 }, 7.2)
        .to(thoughtRefs.current[3], { opacity: 0.25, duration: 0.5 }, 7.2);

      // ── Act 6: The card + button — the designed product
      tl.to(uiCardRef.current, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.2)' }, 10)
        .to(uiButtonRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }, 11)
        .to(thoughtRefs.current[5], { opacity: 1, y: 0, duration: 1 }, 10.5)
        .to(thoughtRefs.current[4], { opacity: 0.25, duration: 0.5 }, 10.5);

      // ── Act 7: Glow — the moment of shipping
      tl.to(uiGlowRef.current, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 13);

    }, sectionRef);

    return () => ctx.revert();
  }, [theme]);

  // Helper to store thought refs
  const setThoughtRef = (el, i) => { thoughtRefs.current[i] = el; };

  const isDark = theme.bg === '#0e0e0e';
  const frameColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const strokeColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';

  return (
    <section ref={sectionRef} className="ts-cinematic" style={{ backgroundColor: '#080808' }}>

      {/* ── Progress bar at the very top ── */}
      <div className="ts-cin-progress-track">
        <div ref={progressRef} className="ts-cin-progress-fill" style={{ backgroundColor: theme.text }} />
      </div>

      <div className="ts-cin-inner">

        {/* ── LEFT: The thought stream ── */}
        <div className="ts-cin-left">
          <div className="ts-cin-label">
            <span className="ts-cin-label-text" style={{ color: 'rgba(255,255,255,0.3)' }}>DESIGN PROCESS</span>
            <span className="ts-cin-label-text" style={{ color: 'rgba(255,255,255,0.3)' }}>SCROLL ↓</span>
          </div>

          <div className="ts-thought-stream">
            {THOUGHTS.map((t, i) => (
              <div
                key={i}
                ref={(el) => setThoughtRef(el, i)}
                className={`ts-thought ts-thought--${t.type}`}
              >
                {t.label && (
                  <span className="ts-thought-label">{t.label}</span>
                )}
                <pre className="ts-thought-text">{t.text}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: The idea becoming a product ── */}
        <div className="ts-cin-right">
          <div className="ts-product-stage">

            {/* Outer device frame */}
            <div ref={uiFrameRef} className="ts-ui-frame" style={{ borderColor: strokeColor }}>

              {/* Browser chrome */}
              <div ref={uiHeaderRef} className="ts-ui-chrome" style={{ backgroundColor: frameColor, borderBottomColor: strokeColor }}>
                <div ref={uiNavDot1} className="ts-chrome-dot" style={{ backgroundColor: '#ff5f56' }} />
                <div ref={uiNavDot2} className="ts-chrome-dot" style={{ backgroundColor: '#ffbd2e' }} />
                <div ref={uiNavDot3} className="ts-chrome-dot" style={{ backgroundColor: '#27c93f' }} />
                <div className="ts-chrome-address" style={{ backgroundColor: frameColor, borderColor: strokeColor }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'Space Mono', letterSpacing: '0.05em' }}>sauveersinha.com</span>
                </div>
              </div>

              {/* Website body */}
              <div className="ts-ui-body">

                {/* Hero block */}
                <div ref={uiHeroBlockRef} className="ts-ui-hero" style={{ background: `linear-gradient(135deg, ${theme.ctaBg}22, ${theme.bg}44)`, borderColor: strokeColor }}>
                  <div className="ts-ui-hero-line" style={{ backgroundColor: theme.text }} />
                  <div className="ts-ui-hero-line short" style={{ backgroundColor: theme.text, opacity: 0.5 }} />
                </div>

                {/* Body text lines */}
                <div className="ts-ui-content-area">
                  <div ref={uiBodyLine1} className="ts-ui-line" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '85%' }} />
                  <div ref={uiBodyLine2} className="ts-ui-line" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '70%' }} />
                  <div ref={uiBodyLine3} className="ts-ui-line" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '55%' }} />
                </div>

                {/* The card — the polished output */}
                <div ref={uiCardRef} className="ts-ui-card" style={{ backgroundColor: theme.text, borderColor: strokeColor }}>
                  <div className="ts-ui-card-body" style={{ color: theme.bg }}>
                    <p className="ts-ui-card-label" style={{ color: theme.bg }}>SHIPPED PRODUCT</p>
                    <p className="ts-ui-card-stat" style={{ color: theme.bg }}>94% task success</p>
                  </div>
                </div>

                {/* The CTA button */}
                <div ref={uiButtonRef} className="ts-ui-btn" style={{ backgroundColor: theme.ctaBg, color: theme.ctaText }}>
                  EXPLORE CASE STUDY →
                </div>

              </div>

              {/* Glow overlay — the "shipped" moment */}
              <div ref={uiGlowRef} className="ts-ui-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${theme.text}18 0%, transparent 70%)` }} />

            </div>

            {/* Stage label */}
            <p className="ts-stage-label" style={{ color: 'rgba(255,255,255,0.3)' }}>LIVE PRODUCT ASSEMBLY</p>
          </div>
        </div>

      </div>
    </section>
  );
}
