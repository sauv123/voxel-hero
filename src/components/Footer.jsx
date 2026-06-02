import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ theme }) {
  const safeTheme = theme || { bg: '#39FF14', text: '#000' };
  const accentColor = (safeTheme.bg === '#0e0e0e' || safeTheme.bg === '#000' || safeTheme.bg === '#111') ? safeTheme.text : safeTheme.bg;

  const footerRef = useRef();
  const flameContainerRef = useRef();
  const [audioReady, setAudioReady] = useState(false);

  // Audio State Context 
  const audioCtxRef = useRef(null);
  const mainGainRef = useRef(null);
  const throttleFilterRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const subOscRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  // High performance guitar strum synth
  const initGuitarStrum = () => {
    if (audioCtxRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.5, ctx.currentTime);
    mainGain.connect(ctx.destination);
    mainGainRef.current = mainGain;

    setAudioReady(true);
  };

  const playStrum = async () => {
    if (!audioCtxRef.current) {
      initGuitarStrum();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    const now = ctx.currentTime;
    
    // Sweet Cmaj9 open chord: C3, G3, B3, D4, E4
    const freqs = [130.81, 196.00, 246.94, 293.66, 329.63];
    const strumDuration = 0.05; // Time between each string pluck

    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Plucked string approximation (Karplus-Strong-ish envelope)
      osc.type = 'triangle'; // Sweeter sounding
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 2.0);

      gain.gain.setValueAtTime(0, now);
      const pluckTime = now + (index * strumDuration);
      
      gain.gain.setValueAtTime(0, pluckTime);
      gain.gain.linearRampToValueAtTime(0.4, pluckTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, pluckTime + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(mainGainRef.current);

      osc.start(pluckTime);
      osc.stop(pluckTime + 3.0);
    });
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!audioCtxRef.current) {
        initGuitarStrum();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    const events = ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown', 'mousemove'];
    events.forEach(e => window.addEventListener(e, handleInteraction, { once: true }));
    return () => events.forEach(e => window.removeEventListener(e, handleInteraction));
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const flameContainer = flameContainerRef.current;

    gsap.set(flameContainer, { yPercent: 65, scaleY: 0.3 });

    let played = false;
    let st = ScrollTrigger.create({
      trigger: footer,
      start: "top 70%", 
      end: "bottom bottom", 
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.set(flameContainer, {
          yPercent: (1 - progress) * 65,
          scaleY: 0.3 + (progress * 0.7)
        });

        if (progress >= 0.98 && !played) {
          played = true;
          playStrum();
        } else if (progress < 0.9) {
          played = false; // Reset so it can play again when scrolling back up and down
        }
      }
    });

    return () => {
      st.kill();
    };
  }, [audioReady]);

  const handleLinkEnter = (e) => {
    const primary = e.currentTarget.querySelector('.primary-text') || e.currentTarget.querySelector('.social-primary-text');
    const clone = e.currentTarget.querySelector('.clone-text') || e.currentTarget.querySelector('.social-clone-text');
    if (primary && clone) gsap.to([primary, clone], { yPercent: -100, duration: 0.3, ease: "power3.inOut" });
  };

  const handleLinkLeave = (e) => {
    const primary = e.currentTarget.querySelector('.primary-text') || e.currentTarget.querySelector('.social-primary-text');
    const clone = e.currentTarget.querySelector('.clone-text') || e.currentTarget.querySelector('.social-clone-text');
    if (primary && clone) gsap.to([primary, clone], { yPercent: 0, duration: 0.3, ease: "power3.inOut" });
  };

  const sayHiRef = useRef();

  const handleSayHiMove = (e) => {
    const rect = sayHiRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    gsap.to(sayHiRef.current, { x: (e.clientX - cx) * 0.6, y: (e.clientY - cy) * 0.6, duration: 0.4, ease: 'power2.out' });
  };

  const handleSayHiLeave = () => {
    gsap.to(sayHiRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div className="footer-wrapper">
      <footer id="brutalist-footer" className="brutalist-footer" ref={footerRef}>
        <div className="flame-bg-container">
          <div id="flame-container" className="flame-wrapper" ref={flameContainerRef}>
            <svg className="flame-svg" viewBox="0 0 1440 400" preserveAspectRatio="xMidYBottom slice" xmlns="http://www.w3.org/2000/svg">
              <path fill={accentColor} d="
                M 0,400 
                L 0,100 
                Q 40,20 90,160 
                T 220,180 
                Q 260,80 320,240 
                T 460,250 
                Q 520,110 580,260
                L 1440,400 Z" 
              />
              <path fill={accentColor} d="
                M 1440,400 
                L 1440,100 
                Q 1400,20 1350,160 
                T 1220,180 
                Q 1180,80 1120,240 
                T 980,250 
                Q 920,110 860,260
                L 0,400 Z" 
              />

              <g stroke="#0d0d0d" strokeWidth="14" fill="none" strokeLinejoin="round" strokeLinecap="round">
                <path id="char-body" fill={accentColor} d="M 600,400 C 580,240 640,120 720,100 C 780,85 840,160 830,260 C 880,240 910,320 880,400" />
                <path d="M 870,160 L 910,60" />
                <circle cx="858" cy="195" r="10" fill="#0d0d0d" />
                <path d="M 680,285 Q 700,270 720,285" />
                <path d="M 740,285 Q 760,270 780,285" />
                <path d="M 710,320 L 710,360 M 740,320 L 740,360" fill="none" />
                <path d="M 570,360 L 620,350 L 630,390 L 580,400 Z" fill="#0d0d0d" />
                <path d="M 860,350 L 910,360 L 900,400 L 850,390 Z" fill="#0d0d0d" />
              </g>
            </svg>
            <div className="solid-floor" style={{ backgroundColor: accentColor }}></div>
          </div>
        </div>

        <div className="footer-content">
          <div className="footer-col-1">
            {['Home', 'Work', 'Playground', 'About'].map((text, idx) => (
              <a 
                href="#" 
                key={idx}
                className="brutal-nav-link"
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                <span className="primary-text text-[#0d0d0d]">{text}</span>
                <span className="clone-text text-white">{text}</span>
              </a>
            ))}
          </div>

          <div className="footer-col-2">
            <h2 
              className="say-hi" 
              ref={sayHiRef}
              style={{ color: '#0d0d0d', cursor: 'pointer', display: 'inline-block' }}
              onMouseMove={handleSayHiMove}
              onMouseLeave={handleSayHiLeave}
              onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              Say Hi!
            </h2>
          </div>

          <div className="footer-col-3">
            <div className="social-links" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/sauveer-sinha-684409215/' },
                { name: 'GMAIL', url: 'mailto:hello@example.com' },
                { name: 'INSTAGRAM', url: '#' }
              ].map((social, idx) => (
                <a 
                  href={social.url}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-nav-link"
                  onMouseEnter={handleLinkEnter}
                  onMouseLeave={handleLinkLeave}
                  style={{ marginBottom: '1rem', justifyContent: 'flex-end' }}
                >
                  <span className="primary-text text-[#0d0d0d]">{social.name} ↗</span>
                  <span className="clone-text text-white">{social.name} ↗</span>
                </a>
              ))}
            </div>

            <div className="footer-meta" style={{ marginTop: '24px' }}>
              <span className="copyright" style={{ color: '#0d0d0d', fontWeight: 700 }}>© 2026 Sauveer Sinha</span>
              <p className="meta-text" style={{ color: '#0d0d0d', fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, maxWidth: '280px', marginTop: '16px' }}>
                I hope you had as much fun exploring this site as I had building it.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
