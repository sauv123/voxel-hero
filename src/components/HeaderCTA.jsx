import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIdle from '../hooks/useIdle';

gsap.registerPlugin(ScrollTrigger);

export default function HeaderCTA({ theme }) {
    const safeTheme = theme || { bg: '#39FF14', text: '#000' };
    const accentColor = (safeTheme.bg === '#0e0e0e' || safeTheme.bg === '#000' || safeTheme.bg === '#111') ? safeTheme.text : safeTheme.bg;

    const ctaTrigger = useRef();
    const emojiCircle = useRef();
    const progressBtn = useRef();
    const progressFill = useRef();
    const modalBackdrop = useRef();
    
    const [isOpen, setIsOpen] = useState(false);
    const isIdle = useIdle(2000);

    const dockItemsRef = useRef([]);

    useEffect(() => {
        const handleOpenContact = () => setIsOpen(true);
        window.addEventListener('openContactModal', handleOpenContact);
        return () => window.removeEventListener('openContactModal', handleOpenContact);
    }, []);

    // Scroll Progress
    useEffect(() => {
        const fill = progressFill.current;
        const btn = progressBtn.current;
        
        const handleScroll = (e) => {
            const target = e.target;
            let scrollY = 0;
            let scrollMax = 1;

            if (target === document || target === document.documentElement) {
                scrollY = window.scrollY;
                scrollMax = document.documentElement.scrollHeight - window.innerHeight;
            } else if (target.scrollHeight > target.clientHeight) {
                scrollY = target.scrollTop;
                scrollMax = target.scrollHeight - target.clientHeight;
            } else {
                return;
            }

            if (scrollMax <= 0) scrollMax = 1;
            const progress = Math.min(1, Math.max(0, scrollY / scrollMax));
            
            gsap.to(fill, {
                width: `${progress * 100}%`,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            if (progress > 0.5) {
                btn.classList.add('dark-text');
            } else {
                btn.classList.remove('dark-text');
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    // Modal Animations
    useEffect(() => {
        if (isOpen) {
            modalBackdrop.current.classList.add('active');
            
            gsap.fromTo(modalBackdrop.current, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
            
            gsap.fromTo('.contact-card',
                { scale: 0.9, y: 30, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
            
            gsap.fromTo('.card-avatar',
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 }
            );
            
            gsap.fromTo(['.card-name', '.card-role', '.card-bio'],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
            
            gsap.fromTo('.divider',
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: "power3.out", delay: 0.4 }
            );
            
            gsap.fromTo('.social-item',
                { y: 30, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)", delay: 0.5 }
            );
        } else {
            // Check if it's already rendered to avoid animating on mount
            if (modalBackdrop.current && modalBackdrop.current.classList.contains('active')) {
                gsap.to('.contact-card', {
                    scale: 0.95,
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });
                
                gsap.to(modalBackdrop.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        if (modalBackdrop.current) {
                            modalBackdrop.current.classList.remove('active');
                        }
                    }
                });
            }
        }
    }, [isOpen]);

    // macOS Dock Hover Physics
    const handleDockEnter = (index) => {
        const items = dockItemsRef.current;
        items.forEach((item, i) => {
            if (!item) return;
            const isHovered = i === index;
            const scale = isHovered ? 1.5 : 1;
            const y = isHovered ? -16 : 0;
            const zIndex = isHovered ? 10 : 1;
            
            gsap.to(item, {
                scale,
                y,
                zIndex,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            // Show label for hovered item
            if (isHovered) {
                gsap.to(item.querySelector('.dock-label'), {
                    opacity: 1, y: -10, duration: 0.2
                });
            }
        });
    };

    const handleDockLeave = () => {
        const items = dockItemsRef.current;
        items.forEach((item) => {
            if (!item) return;
            gsap.to(item, {
                scale: 1,
                y: 0,
                zIndex: 1,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(item.querySelector('.dock-label'), {
                opacity: 0, y: 0, duration: 0.2
            });
        });
    };

    // CTA Hover
    const handleMouseEnter = () => {
        gsap.to(emojiCircle.current, {
            x: -36,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out"
        });
        gsap.to(progressBtn.current, {
            y: -2,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(emojiCircle.current, {
            x: 16,
            scale: 0.85,
            opacity: 0,
            duration: 0.4,
            ease: "power3.in"
        });
        gsap.to(progressBtn.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.in"
        });
    };


    return (
        <>
            {/* Header Bar */}
            <div 
              className="header-bar" 
              style={{ 
                opacity: isIdle ? 0 : 1, 
                pointerEvents: isIdle ? 'none' : 'auto', 
                transition: 'opacity 0.4s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 6vw',
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 99
              }}
            >
                <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: accentColor,
                    cursor: 'pointer',
                    mixBlendMode: 'difference'
                }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    Sauveer.
                </div>

                {/* Mobile Hamburger */}
                <div 
                    className="mobile-nav-toggle"
                    onClick={() => setIsOpen(true)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '8px',
                        mixBlendMode: 'difference'
                    }}
                >
                    <div style={{ width: '32px', height: '2px', background: accentColor }} />
                    <div style={{ width: '32px', height: '2px', background: accentColor }} />
                </div>

                <div 
                    className="cta-wrapper desktop-nav" 
                    ref={ctaTrigger}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsOpen(true)}
                >
                    <div 
                        className="emoji-circle" 
                        ref={emojiCircle} 
                        style={{ 
                            backgroundColor: accentColor, 
                            border: '2px solid #ffffff',
                            color: '#0d0d0d',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1
                        }}
                    >
                        👋
                    </div>
                    {/* Keep menu black, progress fill uses accent color */}
                    <div className="get-in-touch-btn" ref={progressBtn} style={{ background: '#111', color: '#fff' }}>
                        <div className="progress-fill" ref={progressFill} style={{ background: accentColor }}></div>
                        <span className="btn-text">GET IN TOUCH</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal-backdrop" ref={modalBackdrop} onClick={() => setIsOpen(false)}>
                <div 
                    className="contact-card" 
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: '#0a0a0a', borderColor: '#222' }}
                >
                    <img src={`/sauveerpp.png`} alt="Sauveer Sinha avatar profile" className="card-avatar" loading="lazy" style={{ borderColor: '#333', borderRadius: '32px' }} />
                    
                    <div className="card-header">
                        <div className="card-name" style={{ color: '#fff' }}>Sauveer Sinha</div>
                        <div className="card-role" style={{ color: safeTheme.text }}>Product Designer</div>
                        <div className="card-bio" style={{ color: '#888' }}>Designing thoughtful interfaces that balance sophistication with personality.</div>
                    </div>

                    <div className="divider" style={{ background: '#222' }}></div>

                    {/* Links List */}
                    <div className="contact-links-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '16px' }}>
                        {[
                            { name: "Gmail", href: "mailto:sauveersinha@gmail.com", color: "#EA4335", svg: <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 8.336l8.073-4.843C21.691 2.28 24 3.434 24 5.457z"/> },
                            { name: "WhatsApp", href: "https://wa.me/393508124320", color: "#25D366", svg: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/> },
                            { name: "LinkedIn", href: "https://www.linkedin.com/in/sauveer-sinha-684409215/", color: "#0A66C2", svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                            { name: "Instagram", href: "https://www.instagram.com/sauveer.design/", color: "#E1306C", target: "_blank", svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> },
                            { name: "Resume", href: "https://sauveer.com/resume.pdf", color: "#222", target: "_blank", isResume: true, svg: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-2 18H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/> }
                        ].map((item, i) => (
                            <a 
                                key={item.name}
                                href={item.href}
                                aria-label={`Open ${item.name}`}
                                target={item.target || "_self"}
                                className={`contact-list-item ${item.isResume ? 'resume-btn' : ''}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: item.isResume ? theme.brand : 'rgba(255,255,255,0.05)',
                                    color: item.isResume ? '#000' : '#fff',
                                    textDecoration: 'none',
                                    fontWeight: item.isResume ? '800' : '500',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ 
                                    width: '28px', height: '28px', 
                                    borderRadius: '6px', 
                                    background: item.isResume ? 'transparent' : item.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg viewBox="0 0 24 24" fill={item.isResume ? '#000' : '#fff'} stroke="none" style={{ width: '16px', height: '16px' }}>
                                        {item.svg}
                                    </svg>
                                </div>
                                {item.name}
                                {item.isResume && (
                                    <span style={{ marginLeft: 'auto', opacity: 0.6 }}>→</span>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
