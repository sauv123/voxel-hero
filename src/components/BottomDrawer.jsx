import React, { useState, useEffect } from 'react';

export default function BottomDrawer({ theme }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* BOTTOM BAR / SCROLL TO TOP */}
      <div 
        className="glass-island-menu"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <div 
          className="glass-island-inner" 
          onClick={scrollToTop}
          style={{
            background: '#121212',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderRadius: '16px',
            padding: '8px 16px 8px 8px',
            boxShadow: `0 12px 32px rgba(0, 0, 0, 0.5)`,
            gap: '14px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Left Side: White Avatar Square Box */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src="/sauveerpp.png" 
              alt="SAUVEER SINHA" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Middle Section: Text Title */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.2
            }}>
              SAUVEER SINHA
            </span>
            <span style={{
              fontSize: '9px',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.02em',
              marginTop: '1px',
              textTransform: 'uppercase'
            }}>
              Scroll to top
            </span>
          </div>

          {/* Right Side: Up Arrow Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            color: theme.brand,
            flexShrink: 0
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
