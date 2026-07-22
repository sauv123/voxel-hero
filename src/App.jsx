import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import WorkFolder from './components/WorkFolder';
import { AdaptiveDpr, Environment, PerformanceMonitor } from '@react-three/drei';
import HeaderCTA from './components/HeaderCTA';
import InteractiveProjects from './components/InteractiveProjects';
import Preloader from './components/Preloader';
import BrutalistCube from './components/BrutalistCube';
import BottomDrawer from './components/BottomDrawer';
import Footer from './components/Footer';
import ExperimentsGrid from './components/ExperimentsGrid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from './cms/projects';

// Lazy loaded heavy components
const WorkGallery = React.lazy(() => import('./components/WorkGallery'));
const AboutMe = React.lazy(() => import('./components/AboutMe'));
const PlaygroundGallery = React.lazy(() => import('./components/Playground'));
const NotFound = React.lazy(() => import('./components/NotFound'));
const CaseStudyViewer = React.lazy(() => import('./components/CaseStudyViewer'));

gsap.registerPlugin(ScrollTrigger);

// ─── Themes ──────────────────────────────────────────────────────────────────
const THEMES = {
  deer: { bg: '#2ECC40', text: '#0d0d0d', subtitle: '#1a1a1a', ctaBg: '#0d0d0d', ctaText: '#2ECC40', label: '🦌 Deer', brand: '#2ECC40' },
  duck: { bg: '#FFD700', text: '#1a0d00', subtitle: '#2a1a00', ctaBg: '#1a0d00', ctaText: '#FFD700', label: '🦆 Duck', brand: '#FFD700' },
  dino: { bg: '#0e0e0e', text: '#2e2bc4', subtitle: '#2e2bc4', ctaBg: '#2e2bc4', ctaText: '#0e0e0e', label: '🦖 Dino', brand: '#2e2bc4' },
};
const CHARS = ['deer', 'duck', 'dino'];

// ─── Magnetic CTA ────────────────────────────────────────────────────────────
// ─── Minimalist Scroll Indicator ────────────────────────────────────────────────────────────
function ScrollIndicator({ theme }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      onClick={handleClick}
      style={{ 
        position: 'absolute',
        bottom: '4vh',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        opacity: visible ? 0.75 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        zIndex: 10,
        userSelect: 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.75}
    >
      <span style={{ 
        fontFamily: 'Space Mono, monospace', 
        fontSize: '9px', 
        letterSpacing: '0.15em', 
        color: theme.text,
        textTransform: 'uppercase'
      }}>
        Scroll to explore
      </span>
      <div style={{
        color: theme.brand,
        fontSize: '18px',
        animation: 'scrollBounce 1.6s infinite ease-in-out',
        fontWeight: 'bold',
        lineHeight: 1
      }}>
        ↓
      </div>
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
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
  const initialPath = window.location.pathname.slice(1);
  const matchedProjectIndex = PROJECTS.findIndex(p => p.slug === initialPath);
  
  const initialPage = (initialPath === '') ? 'home' : 
                      initialPath === 'work' ? 'work' :
                      initialPath === 'about' ? 'about' :
                      initialPath === 'playground' ? 'playground' : 
                      (matchedProjectIndex !== -1) ? initialPath : '404';

  const [activeChar, setActiveChar] = useState('deer');
  const [isGalleryOpen, setIsGalleryOpen] = useState(initialPage === 'work');
  const [isAboutOpen, setIsAboutOpen] = useState(initialPage === 'about');
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(initialPage === 'playground');
  const [is404Open, setIs404Open] = useState(initialPage === '404');
  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState(matchedProjectIndex !== -1 ? matchedProjectIndex : null);
  const [activePage, setActivePage] = useState(initialPage);
  const [isHoveringCharacter, setIsHoveringCharacter] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const transitionRef = useRef(null);
  const isSwitchingRef = useRef(false);
  const [isPreloaderDone, setIsPreloaderDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('visited') === 'true';
    }
    return false;
  });
  const [isHeroActive, setIsHeroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('visited') === 'true';
    }
    return false;
  });
  const theme    = THEMES[activeChar];
  const rootRef  = useRef();
  const charRef  = useRef(); // forwarded to Scene → CharacterSwitch

  // Save session visited flag
  useEffect(() => {
    if (isPreloaderDone) {
      sessionStorage.setItem('visited', 'true');
    }
  }, [isPreloaderDone]);

  // Entrance animation triggered when preloader transitions out
  useEffect(() => {
    if (!isHeroActive) {
      gsap.set('.char', { y: '110%', opacity: 0 });
      gsap.set('.eyebrow-text', { opacity: 0, y: 18 });
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
    .to('.eyebrow-text', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, "-=1.0");
    
  }, [isHeroActive]);

  // Smooth theme transition
  useEffect(() => {
    // We only animate the body here initially. The ScrollTrigger will handle the blend.
    gsap.to(document.body, { backgroundColor: theme.bg, duration: 0.65, ease: 'power2.inOut' });
    gsap.to(rootRef.current, { backgroundColor: theme.bg, duration: 0.65, ease: 'power2.inOut' });
    gsap.to('.hero-title .char', { color: theme.text, duration: 0.45, stagger: 0.008 });
    gsap.to(['.eyebrow-text', '.meta-tag'], { color: `${theme.text}99`, duration: 0.45 });
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
    if (next === activeChar || isSwitchingRef.current) return;
    isSwitchingRef.current = true;
    
    gsap.killTweensOf('.hero-title .char');
    gsap.to('.hero-title .char', {
      y: '-110%', opacity: 0, duration: 0.35, ease: 'power3.in', stagger: 0.01,
      onComplete: () => {
        setActiveChar(next);
        gsap.to('.hero-title .char', { 
          y: '0%', opacity: 1, duration: 0.6, ease: 'power4.out', stagger: 0.018,
          onComplete: () => {
            isSwitchingRef.current = false;
          }
        });
      },
    });
  }, [activeChar]);

  const handleCharClick = useCallback(() => {
    const idx  = CHARS.indexOf(activeChar);
    switchTo(CHARS[(idx + 1) % CHARS.length]);
  }, [activeChar, switchTo]);

  const navigateWithTransition = useCallback((targetPage) => {
    // Force overlay visibility updates even if the activePage state is already equal to targetPage
    if (targetPage === 'work') {
      setIsGalleryOpen(true);
      setIsAboutOpen(false);
      setIsPlaygroundOpen(false);
      setActiveCaseStudyIndex(null);
    } else if (targetPage === 'about') {
      setIsAboutOpen(true);
      setIsGalleryOpen(false);
      setIsPlaygroundOpen(false);
      setActiveCaseStudyIndex(null);
    } else if (targetPage === 'playground') {
      setIsPlaygroundOpen(true);
      setIsGalleryOpen(false);
      setIsAboutOpen(false);
      setActiveCaseStudyIndex(null);
    } else if (targetPage === 'home') {
      setIsGalleryOpen(false);
      setIsAboutOpen(false);
      setIsPlaygroundOpen(false);
      setIs404Open(false);
      setActiveCaseStudyIndex(null);
    }

    if (activePage === targetPage) return;
    if (gsap.isTweening(transitionRef.current)) return;
    
    // Dynamically set background color to match active theme background
    gsap.set(transitionRef.current, { backgroundColor: theme.bg });

    const tl = gsap.timeline();
    tl.to(transitionRef.current, {
      y: "0%", 
      duration: 0.28, 
      ease: "power2.inOut"
    })
    .call(() => {
      setActivePage(targetPage);
      if (targetPage === 'work') {
        setIsGalleryOpen(true);
        setIsAboutOpen(false);
        setIsPlaygroundOpen(false);
        setActiveCaseStudyIndex(null);
      } else if (targetPage === 'about') {
        setIsAboutOpen(true);
        setIsGalleryOpen(false);
        setIsPlaygroundOpen(false);
        setActiveCaseStudyIndex(null);
      } else if (targetPage === 'playground') {
        setIsPlaygroundOpen(true);
        setIsGalleryOpen(false);
        setIsAboutOpen(false);
        setActiveCaseStudyIndex(null);
      } else if (targetPage === '404') {
        setIs404Open(true);
        setIsGalleryOpen(false);
        setIsAboutOpen(false);
        setIsPlaygroundOpen(false);
        setActiveCaseStudyIndex(null);
      } else {
        const matchIdx = PROJECTS.findIndex(p => p.slug === targetPage);
        if (matchIdx !== -1) {
          setActiveCaseStudyIndex(matchIdx);
          setIsGalleryOpen(false);
          setIsAboutOpen(false);
          setIsPlaygroundOpen(false);
          setIs404Open(false);
        } else {
          setActiveCaseStudyIndex(null);
          setIsGalleryOpen(false);
          setIsAboutOpen(false);
          setIsPlaygroundOpen(false);
          setIs404Open(false);
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }
      
      // Update browser history URL without reloading
      const targetUrl = targetPage === 'home' ? '/' : `/${targetPage}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page: targetPage }, '', targetUrl);
      }
    })
    .to(transitionRef.current, {
      y: "-100%", 
      duration: 0.28, 
      ease: "power2.inOut"
    })
    .set(transitionRef.current, { y: "100%" });
  }, [activePage, theme]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      const matchedProjectIndex = PROJECTS.findIndex(p => p.slug === path);
      const targetPage = (path === '') ? 'home' : 
                         path === 'work' ? 'work' :
                         path === 'about' ? 'about' :
                         path === 'playground' ? 'playground' : 
                         (matchedProjectIndex !== -1) ? path : '404';
                         
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

      <main>

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
          {/* Eyebrow with optimized visual hierarchy and enhanced readability */}
          <div className="hero-text-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '3rem' }}>
            <span style={{ 
              fontFamily: "var(--font-body)",
              fontSize: "clamp(12px, 2vw, 16px)", 
              fontWeight: 900, 
              letterSpacing: "0.15em", 
              textTransform: "uppercase", 
              color: theme.text,
              opacity: 1
            }}>
              HI, I'M SAUVEER
            </span>
            <span style={{ 
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 2.5vw, 18px)", 
              fontWeight: 500, 
              letterSpacing: "0.02em", 
              color: theme.text,
              opacity: 0.75,
              lineHeight: 1.4
            }}>
              UX • AI • Currently based in Milan.
            </span>
          </div>

          {/* Main large headline (now holding the product statement) */}
          <h1 className="hero-title" style={{ color: theme.text, textTransform: 'none' }}>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="I help people understand" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="& trust AI" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.06em', color: theme.brand, display: 'block', margin: '0.15rem 0' }}>
              <SplitChars text="through thoughtful design." />
            </span>
          </h1>
        </div>

        {/* ── 3D Canvas with Cursor Tooltip Tracking ── */}
        <div 
          className="canvas-layer"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }}
        >
          <Canvas shadows dpr={[1, 2]} gl={{ alpha: true }}>
            <Scene
              activeChar={activeChar}
              ctaHover={false}
              onCharacterClick={handleCharClick}
              onCharacterHover={setIsHoveringCharacter}
              charRef={charRef}
            />
          </Canvas>
        </div>

        {/* ── Custom Cursor Tooltip Character Switcher ── */}
        {isPreloaderDone && isHoveringCharacter && (
          <div 
            style={{
              position: "absolute",
              left: tooltipPos.x + 20,
              top: tooltipPos.y + 20,
              pointerEvents: "none",
              backgroundColor: "#0d0d0d",
              color: theme.brand,
              border: `1px solid ${theme.brand}50`,
              padding: "6px 12px",
              borderRadius: "4px",
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              zIndex: 100,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap"
            }}
          >
            Click to switch character ↺
          </div>
        )}
      </div>

      {/* ── Brutalist Dynamic Sculpture ── */}
      <BrutalistCube />

      {/* ── Work Section ── */}
      {!isGalleryOpen && <WorkFolder theme={theme} onOpen={() => navigateWithTransition('work')} />}

      {/* ── Experiments & Artifacts Bento Grid Section ── */}
      {!isGalleryOpen && !isAboutOpen && !isPlaygroundOpen && activeCaseStudyIndex === null && (
        <ExperimentsGrid theme={theme} />
      )}


      <Suspense fallback={null}>
        {/* ── Work Gallery Overlay ── */}
        {isGalleryOpen && <WorkGallery theme={theme} onClose={() => navigateWithTransition('home')} navigate={navigateWithTransition} />}

        {/* ── About Me Overlay ── */}
        {isAboutOpen && <AboutMe theme={theme} onClose={() => navigateWithTransition('home')} />}

        {/* ── Playground Gallery Overlay ── */}
        {isPlaygroundOpen && <PlaygroundGallery theme={theme} activeChar={activeChar} onSwitchChar={switchTo} onClose={() => navigateWithTransition('home')} />}

        {/* ── 404 Error Overlay ── */}
        {is404Open && <NotFound theme={theme} activeChar={activeChar} navigateWithTransition={navigateWithTransition} />}

        {/* ── Case Study Viewer Overlay ── */}
        {activeCaseStudyIndex !== null && (
          <CaseStudyViewer 
            startIndex={activeCaseStudyIndex} 
            onClose={() => navigateWithTransition('work')} 
            theme={theme} 
          />
        )}
      </Suspense>

      {/* ── Bottom Drawer ── */}
      {isPreloaderDone && activePage !== '404' && (
        <BottomDrawer 
          theme={theme} 
          activePage={activePage}
          navigateWithTransition={navigateWithTransition}
        />
      )}

      {/* ── Footer ── */}
      {activePage !== '404' && <Footer theme={theme} activeChar={activeChar} />}
      </main>
    </>
  );
}
