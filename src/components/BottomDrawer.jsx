import React, { useState, useEffect } from 'react';

export default function BottomDrawer({ theme }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'var(--font-heading)',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: '0.08em',
    padding: '8px',
    textTransform: 'uppercase',
    transition: 'color 0.2s'
  };

  return (
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
        style={{
          background: '#121212',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          borderRadius: '32px',
          padding: '6px 14px 6px 6px',
          boxShadow: `0 12px 32px rgba(0, 0, 0, 0.5)`,
          gap: '12px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Avatar */}
        <div 
          onClick={() => scrollTo('top')}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: '#ffffff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0, cursor: 'pointer'
          }}
        >
          <img src="/sauveerpp.png" alt="Sauveer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => scrollTo('workSection')} style={navBtnStyle} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.8)'}>Work</button>
          <button onClick={() => scrollTo('experimentsSection')} style={navBtnStyle} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.8)'}>Play</button>
          <button onClick={() => scrollTo('top')} style={{...navBtnStyle, color: theme?.brand || '#2ECC40'}}>↑ Top</button>
        </div>
      </div>
    </div>
  );
}
