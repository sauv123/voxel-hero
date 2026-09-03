import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

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

  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    body: { persona }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            if (onProjectClick && linkPath) onProjectClick(linkPath);
          }}
          className="chat-cta-btn"
        >
          Read {projectName} case study →
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
      {/* Floating Trigger Button */}
      <button 
        className="ai-trigger-btn"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <span style={{ fontSize: '1.2rem' }}>🦌</span>
        <span>Ask my digital twin →</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <span>🦌</span> SAUVEER'S AI SIDEKICK
            </div>
            <button className="ai-chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Persona Toggle */}
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

          {/* Messages Area */}
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p>Hey 👋 I'm Sauveer's AI sidekick.</p>
                <p>I know his work, his process, and probably more about his projects than his friends do.</p>
                <p><strong>What are you curious about?</strong></p>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`ai-message ${m.role}`}>
                <div className="ai-message-content">
                  {parseMessage(m.content)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="ai-message assistant loading">
                <div className="dot-typing"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompts Area */}
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
      )}
    </>
  );
}
