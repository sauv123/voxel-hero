import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { PROJECTS } from '../cms/projects';

export default function CaseStudyViewer({
  startIndex,
  onClose,
  onSelectProject,
}) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const [showTraceNext, setShowTraceNext] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const clickedProj = PROJECTS[startIndex] || PROJECTS[0];

  // Next 2 relevant case studies in portfolio order
  const nextProjects = useMemo(() => {
    if (!PROJECTS.length) return [];
    const first = PROJECTS[(startIndex + 1) % PROJECTS.length];
    const second = PROJECTS[(startIndex + 2) % PROJECTS.length];
    return [first, second].filter(Boolean);
  }, [startIndex]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initial container setup - start slightly scaled and transparent
    gsap.set(containerRef.current, { opacity: 0, scale: 0.98, y: 20 });

    // Entrance animation
    gsap.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.55,
      ease: 'power4.out',
    });

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Reset loading state when switching between case studies
  useEffect(() => {
    setShowTraceNext(false);
    if (loadingOverlayRef.current) {
      loadingOverlayRef.current.style.display = 'flex';
      gsap.set(loadingOverlayRef.current, { opacity: 1 });
    }
  }, [startIndex]);

  // Listen for postMessage events from inside the case study iframe
  useEffect(() => {
    const handleMessage = (e) => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'OPEN_CASE_STUDY' && data.slug) {
        if (onSelectProject) onSelectProject(data.slug);
      } else if (data.type === 'CLOSE_CASE_STUDY') {
        handleClose();
      } else if (typeof data.slideIndexChanged === 'number') {
        // /trace deck-stage posts { slideIndexChanged: N }
        const deckEl =
          iframeRef.current?.contentDocument?.querySelector('deck-stage');
        const totalSlides = deckEl?.slides?.length || 9;
        setShowTraceNext(data.slideIndexChanged >= totalSlides - 1);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectProject]);

  // Inject the "Next 2 Relevant Case Studies" section at the bottom in LIGHT MODE matching WorkFolder
  const injectUpNextSection = (doc) => {
    if (!doc || !doc.body) return;
    if (doc.getElementById('sauveer-up-next-section')) return;

    const styleEl = doc.createElement('style');
    styleEl.textContent = `
      #sauveer-up-next-section {
        background: #FFFFFF !important;
        color: #000000 !important;
        padding: 90px 6vw calc(120px + env(safe-area-inset-bottom, 0px)) 6vw;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        position: relative;
        z-index: 90;
        box-sizing: border-box;
      }
      #sauveer-up-next-section * {
        box-sizing: border-box;
      }
      .sun-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .sun-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        padding-bottom: 20px;
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sun-title {
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        font-size: clamp(1.2rem, 2vw, 1.8rem);
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #000000;
        margin: 0;
        line-height: 1.2;
      }
      .sun-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: 100%;
      }
      .sun-card {
        height: 420px;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background-color: #111111;
        border: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 36px 32px;
        text-align: left;
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @media (hover: hover) and (pointer: fine) {
        .sun-card {
          cursor: none;
        }
      }
      .sun-card-media {
        position: absolute;
        inset: 0;
        z-index: 1;
        overflow: hidden;
      }
      .sun-card-media video,
      .sun-card-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sun-card:hover .sun-card-media video,
      .sun-card:hover .sun-card-media img {
        transform: scale(1.03);
      }
      .sun-card-scrim {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 70%);
      }
      .sun-card-content {
        position: relative;
        z-index: 2;
      }
      .sun-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        height: 0px;
        overflow: hidden;
      }
      .sun-card:hover .sun-tags {
        opacity: 1;
        transform: translateY(0);
        height: auto;
      }
      .sun-tag {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.95);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .sun-card-title {
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        font-size: clamp(2rem, 3.2vw, 2.8rem);
        font-weight: 900;
        color: #ffffff;
        margin: 0 0 8px 0;
        line-height: 1.05;
        letter-spacing: -0.03em;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
      }
      .sun-card-desc {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
        max-width: 520px;
        opacity: 0;
        max-height: 0px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sun-card:hover .sun-card-desc {
        opacity: 1;
        max-height: 80px;
      }
      .sun-mobile-cta {
        display: none;
      }
      /* Custom Hover Cursor Pill for Cards inside Iframe */
      #sun-custom-cursor {
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        background: #000000;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 0px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 8px 14px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.08s ease-out;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      }
      @media (max-width: 768px) {
        #sauveer-up-next-section {
          padding: 60px 5vw calc(100px + env(safe-area-inset-bottom, 0px)) 5vw;
        }
        .sun-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .sun-card {
          height: 380px;
          padding: 28px 24px;
          cursor: pointer;
        }
        .sun-tags {
          opacity: 1;
          transform: translateY(0);
          height: auto;
        }
        .sun-card-desc {
          opacity: 1;
          max-height: 80px;
        }
        .sun-mobile-cta {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2ECC40;
        }
        #sun-custom-cursor {
          display: none !important;
        }
      }
    `;
    doc.head.appendChild(styleEl);

    // Create custom cursor element
    const cursorEl = doc.createElement('div');
    cursorEl.id = 'sun-custom-cursor';
    cursorEl.textContent = 'VIEW CASE STUDY';
    doc.body.appendChild(cursorEl);

    const section = doc.createElement('section');
    section.id = 'sauveer-up-next-section';
    section.setAttribute('aria-label', 'Selected Works Up Next');

    const cardsHtml = nextProjects
      .map((proj) => {
        const isVideo =
          proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov');
        const mediaHtml = isVideo
          ? `<video src="${proj.img}" autoplay muted loop playsinline preload="metadata" style="object-position: ${proj.objectPosition || 'center'}"></video>`
          : `<img src="${proj.img}" alt="${proj.title}" loading="lazy" style="object-position: ${proj.objectPosition || 'center'}" />`;
        const tagsHtml = (proj.tags || [])
          .map((t) => `<span class="sun-tag">${t}</span>`)
          .join('');

        return `
          <div class="sun-card" role="button" tabindex="0" data-slug="${proj.slug}">
            <div class="sun-card-media">
              ${mediaHtml}
              <div class="sun-card-scrim"></div>
            </div>
            <div class="sun-card-content">
              <div class="sun-tags">${tagsHtml}</div>
              <h3 class="sun-card-title">${proj.displayName || proj.name || proj.title}</h3>
              <p class="sun-card-desc">${proj.cta || ''}</p>
              <div class="sun-mobile-cta">
                <span>View Case Study</span>
                <span>➔</span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    section.innerHTML = `
      <div class="sun-container">
        <div class="sun-header">
          <h2 class="sun-title">Selected Works</h2>
        </div>
        <div class="sun-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    doc.body.appendChild(section);

    // Custom cursor movement & card triggers
    const cards = section.querySelectorAll('.sun-card');
    cards.forEach((card) => {
      const triggerOpen = () => {
        const slug = card.getAttribute('data-slug');
        if (slug) {
          window.parent.postMessage({ type: 'OPEN_CASE_STUDY', slug }, '*');
        }
      };
      card.addEventListener('click', triggerOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });

      card.addEventListener('mouseenter', () => {
        cursorEl.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        cursorEl.style.opacity = '0';
      });
      card.addEventListener('mousemove', (e) => {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
      });
    });
  };

  const handleIframeLoad = () => {
    if (loadingOverlayRef.current) {
      gsap.to(loadingOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          if (loadingOverlayRef.current) {
            loadingOverlayRef.current.style.display = 'none';
          }
        },
      });
    }

    try {
      const iframeWin = iframeRef.current?.contentWindow;
      const iframeDoc = iframeRef.current?.contentDocument;

      // Forward Escape key inside iframe to close viewer
      if (iframeWin) {
        iframeWin.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') handleClose();
        });
      }

      if (iframeDoc) {
        const deck = iframeDoc.querySelector('deck-stage');
        if (deck) {
          deck.addEventListener('slidechange', (e) => {
            const { index, total } = e.detail || {};
            if (typeof index === 'number' && typeof total === 'number') {
              setShowTraceNext(index >= total - 1);
            }
          });
        } else {
          injectUpNextSection(iframeDoc);
        }
      }
    } catch {
      // Cross-origin fallback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      y: 30,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Case Study Viewer"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Loading Skeleton / Overlay to prevent white flash */}
      <div
        ref={loadingOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: clickedProj.bgColor || '#000000',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            opacity: 0.6,
            letterSpacing: '0.1em',
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          Loading {clickedProj.title}
        </div>
      </div>



      {/* Subtle Light-Mode Next Bar for /trace slide deck at final slide */}
      {showTraceNext && (
        <div
          role="region"
          aria-label="Next Case Studies"
          style={{
            position: 'absolute',
            left: isMobile ? '12px' : '5vw',
            right: isMobile ? '12px' : '5vw',
            bottom: isMobile ? '24px' : '36px',
            zIndex: 260,
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '20px',
            padding: isMobile ? '20px 16px' : '24px 28px',
            color: '#000000',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
            animation: 'fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <style>{`
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              paddingBottom: '12px',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
                color: '#000000',
              }}
            >
              Selected Works • Up Next
            </h4>
            <button
              onClick={() => setShowTraceNext(false)}
              aria-label="Dismiss"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? '12px' : '16px',
            }}
          >
            {nextProjects.map((proj) => {
              const isVideo =
                proj.img?.endsWith('.mp4') || proj.img?.endsWith('.mov');
              return (
                <div
                  key={proj.slug}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectProject && onSelectProject(proj.slug)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (onSelectProject) onSelectProject(proj.slug);
                    }
                  }}
                  style={{
                    position: 'relative',
                    height: isMobile ? '140px' : '180px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: isMobile ? '16px' : '20px',
                    background: '#111111',
                    border: 'none',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                    }}
                  >
                    {isVideo ? (
                      <video
                        src={proj.img}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: proj.objectPosition || 'center',
                        }}
                      />
                    ) : (
                      <img
                        src={proj.img}
                        alt={proj.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: proj.objectPosition || 'center',
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)',
                      }}
                    />
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: '12px',
                      }}
                    >
                      <h5
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: isMobile ? '1.2rem' : '1.45rem',
                          fontWeight: 800,
                          margin: 0,
                          color: '#fff',
                        }}
                      >
                        {proj.displayName || proj.name || proj.title}
                      </h5>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#2ECC40',
                        }}
                      >
                        View Case Study ➔
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {clickedProj?.link ? (
        <iframe
          key={clickedProj.slug}
          ref={iframeRef}
          src={clickedProj.link}
          title={clickedProj.title}
          allow="autoplay; fullscreen"
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: clickedProj.bgColor || '#000000',
          }}
        />
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>📐</span>
          <h3>No Preview Available</h3>
        </div>
      )}
    </div>
  );
}
