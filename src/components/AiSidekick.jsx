import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const DECISION_TREE = {
  start: {
    message: "Hey 👋 I'm Sauveer's AI sidekick.\n\nI can give you the quick version—or we can go down the rabbit hole. What are you curious about?",
    options: [
      { label: "His work", next: "work" },
      { label: "His approach", next: "approach" },
      { label: "AI + experiments", next: "ai" },
      { label: "About Sauveer", next: "about" }
    ]
  },
  work: {
    message: "I've got a few favourites.\n\n**MICA**\nHousing × loneliness × intergenerational living\n\n**ORCO**\nFood × discovery × digital experience\n\n**OLO**\nIntroverted design × meaningful growth",
    options: [
      { label: "Tell me about MICA", next: "mica" },
      { label: "Tell me about ORCO", next: "orco" },
      { label: "Go back", next: "start" }
    ]
  },
  mica: {
    message: "MICA explores how technology can help younger and older people find better housing arrangements in Milan.\n\nSauveer worked across research, service design, UX and interaction design.",
    cta: { label: "Read MICA case study →", link: "/casestudies/mica/index.html" },
    options: [
      { label: "What else has he done?", next: "work" },
      { label: "Go back", next: "start" }
    ]
  },
  orco: {
    message: "Orco was all about transforming a heritage Italian food brand into an interactive culinary experience. It merges rich brand storytelling with a seamless digital interface.",
    cta: { label: "Read ORCO case study →", link: "/casestudies/orco/orco-case-study.html" },
    options: [
      { label: "What else has he done?", next: "work" },
      { label: "Go back", next: "start" }
    ]
  },
  approach: {
    message: "Sauveer believes in 'introverted design'—creating calm, deliberate, and emotionally intelligent digital spaces that don't overwhelm the user.\n\nHe turns messy problems into clear, human-centered experiences.",
    options: [
      { label: "How does this apply to AI?", next: "ai" },
      { label: "Go back", next: "start" }
    ]
  },
  ai: {
    message: "He approaches AI design not as a technical challenge, but as an exercise in trust and clarity.\n\nHis goal is to make AI less intimidating and design interfaces that empower users rather than replace them.",
    options: [
      { label: "See his work", next: "work" },
      { label: "Go back", next: "start" }
    ]
  },
  about: {
    message: "He's a UX/Product Designer with a strong focus on creative technology, splitting his time between Milan and India. He probably spends too much time experimenting with new tools (like me!).",
    options: [
      { label: "See his work", next: "work" },
      { label: "Go back", next: "start" }
    ]
  }
};

export default function AiSidekick({ onProjectClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { role: 'assistant', ...DECISION_TREE.start }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Smooth scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTyping, isOpen]);

  // Entrance/Exit animation
  useEffect(() => {
    if (isOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out"
      });
    } else {
      gsap.to(panelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    // Add user's choice to history
    const newHistory = [...history, { role: 'user', message: option.label }];
    
    // We only keep options on the LAST assistant message, so we strip them from history
    const cleanHistory = newHistory.map(item => ({ ...item, options: [] }));
    
    setHistory(cleanHistory);
    setIsTyping(true);

    // Simulate network delay / typing
    setTimeout(() => {
      const nextNode = DECISION_TREE[option.next];
      setHistory([...cleanHistory, { role: 'assistant', ...nextNode }]);
      setIsTyping(false);
    }, 600);
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold text handling
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <p key={i} style={{ minHeight: line === '' ? '0.5rem' : 'auto', margin: '0.2rem 0' }}>{parts}</p>;
    });
  };

  return (
    <>
      <button 
        className="ai-trigger-minimal"
        onClick={() => setIsOpen(true)}
        style={{ 
          opacity: isOpen ? 0 : 1, 
          pointerEvents: isOpen ? 'none' : 'all' 
        }}
      >
        <span className="ai-trigger-icon">🦌</span>
        <span>Ask my digital twin</span>
      </button>

      {/* Backdrop */}
      <div 
        className={`ai-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div ref={panelRef} className="ai-sidebar">
        <div className="ai-sidebar-header">
          <div className="ai-sidebar-title">
            <span className="ai-title-icon">🦌</span> SAUVEER'S AI SIDEKICK
          </div>
          <button className="ai-sidebar-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="ai-sidebar-content">
          {history.map((item, idx) => (
            <div key={idx} className={`ai-msg-wrapper ${item.role}`}>
              <div className="ai-msg-bubble">
                {renderMessageText(item.message)}
                
                {item.cta && (
                  <button 
                    className="ai-msg-cta"
                    onClick={() => {
                      setIsOpen(false);
                      if (onProjectClick) onProjectClick(item.cta.link);
                    }}
                  >
                    {item.cta.label}
                  </button>
                )}
              </div>
              
              {/* Only show options for the most recent message */}
              {idx === history.length - 1 && item.options && item.options.length > 0 && (
                <div className="ai-options-grid">
                  {item.options.map((opt, oIdx) => (
                    <button 
                      key={oIdx}
                      className="ai-option-btn"
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="ai-msg-wrapper assistant">
              <div className="ai-msg-bubble typing">
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>
      </div>
    </>
  );
}
