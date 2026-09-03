import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import gsap from 'gsap';

const PERSONAS = {
  RECRUITER: 'Recruiter',
  DESIGNER: 'Designer',
  CURIOUS: 'Curious'
};

const PROMPTS = {
  [PERSONAS.RECRUITER]: [
    "What are Sauveer's strongest skills?",
    "Why should I hire him?",
    "How does he approach UX problems?",
    "Show me his best work."
  ],
  [PERSONAS.DESIGNER]: [
    "How does Sauveer design for AI?",
    "What is his visual design philosophy?",
    "Tell me about introverted design.",
    "What's his prototyping process like?"
  ],
  [PERSONAS.CURIOUS]: [
    "What's this deer doing here?",
    "What's Sauveer obsessed with?",
    "What's the weirdest thing he's built?",
    "Does he sleep?"
  ]
};

export default function AiSidekick({ onProjectClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState(PERSONAS.RECRUITER);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const overlayRef = useRef(null);

  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    body: { persona }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // GSAP Message Entrance Animation
  useEffect(() => {
    if (messages.length > 0 && isOpen) {
      const lastMessageEl = document.querySelector(`.ai-message:last-of-type`);
      if (lastMessageEl) {
        gsap.fromTo(lastMessageEl, 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }, [messages.length, isOpen]);

  // GSAP Modal Open/Close Animation
  useEffect(() => {
    if (isOpen) {
      gsap.set([overlayRef.current, chatWindowRef.current], { visibility: 'visible' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(chatWindowRef.current,
        { opacity: 0, x: 20, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(chatWindowRef.current, { 
        opacity: 0, x: 20, scale: 0.98, duration: 0.3, ease: "power2.in",
        onComplete: () => {
          gsap.set([overlayRef.current, chatWindowRef.current], { visibility: 'hidden' });
        }
      });
    }
  }, [isOpen]);

  const handlePromptClick = (prompt) => {
    append({ role: 'user', content: prompt });
  };

  // Parses markdown-like links e.g., [LINK:MICA] into buttons
  const parseMessage = (content) => {
    const linkRegex = /\[LINK:([A-Z0-9]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{content.substring(lastIndex, match.index)}</span>);
      }
      
      const projectName = match[1];
      let linkPath = "";
      if (projectName === 'MICA') linkPath = '/casestudies/mica/index.html';
      if (projectName === 'ORCO') linkPath = '/casestudies/orco/orco-case-study.html';
      if (projectName === 'OLO') linkPath = '/casestudies/olo/index.html';

      parts.push(
        <button 
          key={match.index}
          onClick={() => {
            setIsOpen(false);
            if (onProjectClick && linkPath) onProjectClick(linkPath);
          }}
          className="chat-cta-btn"
        >
          Read {projectName} Case Study →
        </button>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.substring(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <>
      <button 
        className="ai-trigger-btn"
        onClick={() => setIsOpen(true)}
        style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'all' }}
      >
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <span>Ask AI Sidekick</span>
      </button>

      <div ref={overlayRef} className="ai-overlay" onClick={() => setIsOpen(false)} />

      <div ref={chatWindowRef} className="ai-chat-window">
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span style={{fontSize: '1.2rem'}}>✨</span> Sauveer's AI
          </div>
          <button className="ai-chat-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="ai-persona-toggle">
          {Object.values(PERSONAS).map(p => (
            <button 
              key={p}
              className={persona === p ? 'active' : ''}
              onClick={() => setPersona(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="ai-welcome-deer">🦌</div>
              <div className="ai-welcome-text">
                <h3>What are you curious about?</h3>
                <p>I know his entire portfolio. Let's dig in.</p>
              </div>
            </div>
          )}
          
          {messages.map(m => (
            <div key={m.id} className={`ai-message ${m.role}`}>
              {parseMessage(m.content)}
            </div>
          ))}
          
          {isLoading && (
            <div className="ai-message assistant typing-indicator">
               <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        <div className="ai-chat-prompts">
          {PROMPTS[persona].map((prompt, i) => (
            <button 
              key={i} 
              className="ai-prompt-btn"
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
