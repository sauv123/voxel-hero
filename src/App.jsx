import React, { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import VoxelDS from './components/VoxelDS';
import WorkFolder from './components/WorkFolder';
import WorkGallery from './components/WorkGallery';
import { AdaptiveDpr, Environment, PerformanceMonitor } from '@react-three/drei';
import HeaderCTA from './components/HeaderCTA';
import InteractiveProjects from './components/InteractiveProjects';
import Preloader from './components/Preloader';
import AboutMe from './components/AboutMe';
import BrutalistCube from './components/BrutalistCube';
import BottomDrawer from './components/BottomDrawer';
import PlaygroundGallery from './components/Playground';
import NotFound from './components/NotFound';
import FluidUnjumble from './components/FluidUnjumble';
import BrandsSection from './components/BrandsSection';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Themes ──────────────────────────────────────────────────────────────────
const THEMES = {
  deer: { bg: '#2ECC40', text: '#0d0d0d', subtitle: '#1a1a1a', ctaBg: '#0d0d0d', ctaText: '#2ECC40', label: '🦌 Deer', brand: '#2ECC40' },
  duck: { bg: '#FFD700', text: '#1a0d00', subtitle: '#2a1a00', ctaBg: '#1a0d00', ctaText: '#FFD700', label: '🦆 Duck', brand: '#FFD700' },
  dino: { bg: '#0e0e0e', text: '#2e2bc4', subtitle: '#2e2bc4', ctaBg: '#2e2bc4', ctaText: '#0e0e0e', label: '🦖 Dino', brand: '#2e2bc4' },
};
const CHARS = ['deer', 'duck', 'dino'];

// ─── Emoji burst helper ──────────────────────────────────────────────────────
function spawnEmoji(emoji, originEl, count = 8) {
  const rect = originEl.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = emoji;
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      font-size:${1.4 + Math.random()}rem;
      left:${rect.left + rect.width / 2}px;
      top:${rect.top + rect.height / 2}px;
      transform:translate(-50%,-50%);
      user-select:none;
    `;
    document.body.appendChild(el);
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const dist = 60 + Math.random() * 80;
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      opacity: 0,
      scale: 0.3,
      duration: 0.9 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    });
  }
}

// ─── Magnetic CTA ────────────────────────────────────────────────────────────
function ExplorePill({ theme }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className={`explore-pill ${visible ? 'visible' : ''}`} 
      onClick={handleClick}
      style={{ background: `${theme.text}10`, color: theme.text, borderColor: `${theme.text}20` }}
    >
      <span>Explore Work ↓</span>
    </div>
  );
}

// ─── Character Picker ────────────────────────────────────────────────────────
function CharacterPicker({ activeChar, onSelect, theme }) {
  return (
    <div className="char-picker">
      {CHARS.map((c) => (
        <button
          key={c}
          className={`char-chip ${activeChar === c ? 'active' : ''}`}
          style={{
            borderColor: activeChar === c ? theme.text : `${theme.text}55`,
            color: theme.text,
            backgroundColor: activeChar === c ? `${theme.text}18` : 'transparent',
          }}
          onClick={() => onSelect(c)}
        >
          {THEMES[c].label}
        </button>
      ))}
      <span className="char-hint" style={{ color: `${theme.text}70` }}>click to switch</span>
    </div>
  );
}

// ─── Split text ───────────────────────────────────────────────────────────────
function SplitChars({ text }) {
  return <>{text.split('').map((ch, i) => (
    <span key={i} className="char">{ch === ' ' ? '\u00A0' : ch}</span>
  ))}</>;
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const initialPath = window.location.pathname;
  const initialPage = (initialPath === '/' || initialPath === '') ? 'home' : 
                      initialPath.slice(1) === 'work' ? 'work' :
                      initialPath.slice(1) === 'about' ? 'about' :
                      initialPath.slice(1) === 'playground' ? 'playground' : '404';

  const [activeChar, setActiveChar] = useState('deer');
  const [ctaHover, setCtaHover]     = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(initialPage === 'work');
  const [isAboutOpen, setIsAboutOpen] = useState(initialPage === 'about');
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(initialPage === 'playground');
  const [is404Open, setIs404Open] = useState(initialPage === '404');
  const [activePage, setActivePage] = useState(initialPage);
  const transitionRef = useRef(null);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(false);
  const theme    = THEMES[activeChar];
  const rootRef  = useRef();
  const charRef  = useRef(); // forwarded to Scene → CharacterSwitch
  const ctaRef   = useRef();

  // Entrance animation triggered when preloader transitions out
  useEffect(() => {
    if (!isHeroActive) {
      gsap.set('.char', { y: '110%', opacity: 0 });
      gsap.set('.eyebrow-text', { opacity: 0, y: 18 });
      gsap.set('.subtitle', { opacity: 0, y: 20 });
      gsap.set('.subtitle', { opacity: 0, y: 20 });
      gsap.set(rootRef.current, { scale: 1.03, opacity: 0 });
      return;
    }

    const tl = gsap.timeline();

    tl.to(rootRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power3.out"
    })
    .to('.char', {
      y: '0%', opacity: 1,
      duration: 1.1, ease: 'power4.out',
      stagger: 0.022
    }, "-=0.2")
    .to('.eyebrow-text', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, "-=1.0")
    .to('.subtitle', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, "-=0.8");
    
  }, [isHeroActive]);

  // Smooth theme transition
  useEffect(() => {
    // We only animate the body here initially. The ScrollTrigger will handle the blend.
    gsap.to(document.body, { backgroundColor: theme.bg, duration: 0.65, ease: 'power2.inOut' });
    gsap.to(rootRef.current, { backgroundColor: theme.bg, duration: 0.65, ease: 'power2.inOut' });
    gsap.to('.hero-title .char', { color: theme.text, duration: 0.45, stagger: 0.008 });
    gsap.to(['.eyebrow-text', '.subtitle', '.meta-tag'], { color: `${theme.text}99`, duration: 0.45 });
  }, [theme]);

  // Premium GSAP scroll-driven background color scrub
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero -> Brutalist Cube (#050505)
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "bottom 90%",
        end: "bottom 10%",
        scrub: 1.5,
        onUpdate: (self) => {
          const blendedColor = gsap.utils.interpolate(theme.bg, '#050505', self.progress);
          gsap.set([document.body, rootRef.current], { backgroundColor: blendedColor });
        }
      });

      // Brutalist Cube -> Work Folder (#FCFAF2)
      ScrollTrigger.create({
        trigger: '.bc-container',
        start: "bottom 100%",
        end: "bottom 20%",
        scrub: 1.5,
        onUpdate: (self) => {
          const blendedColor = gsap.utils.interpolate('#050505', '#FCFAF2', self.progress);
          gsap.set(document.body, { backgroundColor: blendedColor });
        }
      });
    });
    return () => ctx.revert();
  }, [theme]);

  // Character switching with flash
  const switchTo = useCallback((next) => {
    if (next === activeChar) return;
    gsap.to('.hero-title .char', {
      y: '-110%', opacity: 0, duration: 0.35, ease: 'power3.in', stagger: 0.01,
      onComplete: () => {
        setActiveChar(next);
        gsap.to('.hero-title .char', { y: '0%', opacity: 1, duration: 0.6, ease: 'power4.out', stagger: 0.018 });
      },
    });
  }, [activeChar]);

  const handleCharClick = useCallback(() => {
    const idx  = CHARS.indexOf(activeChar);
    switchTo(CHARS[(idx + 1) % CHARS.length]);
  }, [activeChar, switchTo]);

  const navigateWithTransition = useCallback((targetPage) => {
    if (activePage === targetPage) return;
    if (gsap.isTweening(transitionRef.current)) return;
    
    const tl = gsap.timeline();
    tl.to(transitionRef.current, {
      y: "0%", 
      duration: 0.5, 
      ease: "power3.inOut"
    })
    .call(() => {
      setActivePage(targetPage);
      if (targetPage === 'work') {
        setIsGalleryOpen(true);
        setIsAboutOpen(false);
        setIsPlaygroundOpen(false);
      } else if (targetPage === 'about') {
        setIsAboutOpen(true);
        setIsGalleryOpen(false);
        setIsPlaygroundOpen(false);
      } else if (targetPage === 'playground') {
        setIsPlaygroundOpen(true);
        setIsGalleryOpen(false);
        setIsAboutOpen(false);
      } else if (targetPage === '404') {
        setIs404Open(true);
        setIsGalleryOpen(false);
        setIsAboutOpen(false);
        setIsPlaygroundOpen(false);
      } else {
        setIsGalleryOpen(false);
        setIsAboutOpen(false);
        setIsPlaygroundOpen(false);
        setIs404Open(false);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      
      // Update browser history URL without reloading
      const targetUrl = targetPage === 'home' ? '/' : `/${targetPage}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page: targetPage }, '', targetUrl);
      }
    })
    .to(transitionRef.current, {
      y: "-100%", 
      duration: 0.5, 
      ease: "power3.inOut",
      delay: 0.1
    })
    .set(transitionRef.current, { y: "100%" });
  }, [activePage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      const path = window.location.pathname;
      const targetPage = (path === '/' || path === '') ? 'home' : 
                         path.slice(1) === 'work' ? 'work' :
                         path.slice(1) === 'about' ? 'about' :
                         path.slice(1) === 'playground' ? 'playground' : '404';
                         
      if (targetPage !== activePage) {
        navigateWithTransition(targetPage);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activePage, navigateWithTransition]);

  return (
    <>
      <div 
        ref={transitionRef}
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: theme.text, zIndex: 9999999, transform: "translateY(100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
      </div>

      {!isPreloaderDone && (
        <Preloader 
          onStartReveal={() => setIsHeroActive(true)}
          onComplete={() => setIsPreloaderDone(true)} 
        />
      )}
      
      {isPreloaderDone && activePage !== '404' && <HeaderCTA theme={theme} />}      
      <div ref={rootRef} className="hero-container" style={{ backgroundColor: theme.bg }}>

        {/* ── Background text layer (behind canvas) ── */}
        <div className="text-layer" aria-hidden="true">
          {/* Small eyebrow */}
          <p className="eyebrow-text" style={{ color: `${theme.text}99` }}>
            TECHNOLOGY KEEPS GETTING SMARTER
          </p>

          {/* Main large headline */}
          <h1 className="hero-title" style={{ color: theme.text }}>
            {['I DESIGN', 'EXPERIENCES', 'THAT KEEP', 'THINGS HUMAN'].map((line, li) => (
              <span key={li} className="line-wrap">
                <SplitChars text={line} />
              </span>
            ))}
          </h1>
        </div>

        {/* ── 3D Canvas ── */}
        <div className="canvas-layer">
          <Canvas shadows dpr={[1, 2]} gl={{ alpha: true }}>
            <Scene
              activeChar={activeChar}
              ctaHover={ctaHover}
              onCharacterClick={handleCharClick}
              charRef={charRef}
            />
          </Canvas>
        </div>

        {/* ── CTA ── */}
        <ExplorePill theme={theme} />
        
        {/* ── Character Switcher Lever ── */}
        <div 
          onClick={handleCharClick}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '5vw',
            cursor: 'pointer',
            opacity: isHeroActive ? 0.8 : 0,
            transition: 'opacity 1s ease, transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '0.8';
          }}
        >
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.text, fontWeight: 800 }}>
            SWITCH
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
            <div style={{ width: 36, height: 3, backgroundColor: theme.text, borderRadius: 2 }} />
            <div style={{ width: 24, height: 3, backgroundColor: theme.text, borderRadius: 2 }} />
            <div style={{ width: 12, height: 3, backgroundColor: theme.text, borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* ── Brutalist Dynamic Sculpture ── */}
      <BrutalistCube />

      {/* ── Work Section ── */}
      {!isGalleryOpen && <WorkFolder theme={theme} onOpen={() => setIsGalleryOpen(true)} />}

      {/* ── Fluid Un-Jumble Interactive Section ── */}
      <FluidUnjumble theme={theme} />

      {/* ── Brands Collaboration Section ── */}
      <BrandsSection theme={theme} />

      {/* ── Work Gallery Overlay ── */}
      {isGalleryOpen && <WorkGallery theme={theme} onClose={() => navigateWithTransition('home')} />}

      {/* ── About Me Overlay ── */}
      {isAboutOpen && <AboutMe theme={theme} onClose={() => navigateWithTransition('home')} />}

      {/* ── Playground Gallery Overlay ── */}
      {isPlaygroundOpen && <PlaygroundGallery theme={theme} activeChar={activeChar} onClose={() => navigateWithTransition('home')} />}

      {/* ── 404 Error Overlay ── */}
      {is404Open && <NotFound theme={theme} activeChar={activeChar} navigateWithTransition={navigateWithTransition} />}

      {/* ── Bottom Drawer ── */}
      {isPreloaderDone && activePage !== '404' && (
        <BottomDrawer 
          theme={theme} 
          activePage={activePage}
          navigateWithTransition={navigateWithTransition}
        />
      )}

      {/* ── Footer ── */}
      {activePage !== '404' && <Footer theme={theme} />}
    </>
  );
}
