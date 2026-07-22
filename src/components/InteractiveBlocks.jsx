import React, { useState, useEffect } from 'react';
import './InteractiveBlocks.css';

const PATTERNS = [
  { indices: [1, 2, 4, 7, 8, 11, 13, 14], color: 'yellow' }, // SMILEY
  { indices: [1, 4, 5, 6, 9, 10, 11, 15], color: 'orange' }, // FISH
  { indices: [0, 3, 5, 6, 8, 11, 13, 14], color: 'blue' }    // TEDDY
];

export default function InteractiveBlocks() {
  const [patternIndex, setPatternIndex] = useState(0);
  const [revealed, setRevealed] = useState(new Set());
  
  const currentPattern = PATTERNS[patternIndex];
  const activeSet = new Set(currentPattern.indices);

  const handleMouseEnter = (idx) => {
    if (!revealed.has(idx)) {
      setRevealed(prev => new Set(prev).add(idx));
    }
  };

  useEffect(() => {
    // Once all 16 squares are revealed, hold for a moment then reset to the next pattern
    if (revealed.size === 16) {
      const timer = setTimeout(() => {
        setRevealed(new Set());
        setPatternIndex((prev) => (prev + 1) % PATTERNS.length);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [revealed]);

  const cells = Array.from({ length: 16 }, (_, i) => {
    const isRevealed = revealed.has(i);
    const isPartOfPattern = activeSet.has(i);
    return { id: i, isRevealed, isPartOfPattern, color: currentPattern.color };
  });

  return (
    <div 
      className="interactive-blocks-wrapper" 
      style={{ padding: '10px' }}
    >
      <div 
        className="interactive-grid"
        style={{
          gridTemplateColumns: `repeat(4, 1fr)`,
          gridTemplateRows: `repeat(4, 1fr)`,
          width: '100%',
          height: '100%',
          gap: '4px'
        }}
      >
        {cells.map((cell) => (
          <div 
            key={cell.id} 
            className={`cell`}
            onMouseEnter={() => handleMouseEnter(cell.id)}
            onTouchStart={() => handleMouseEnter(cell.id)}
            style={{ 
              backgroundColor: cell.isRevealed 
                ? (cell.isPartOfPattern ? 'transparent' : 'rgba(255, 255, 255, 0.02)') 
                : 'rgba(255, 255, 255, 0.1)',
              borderColor: cell.isRevealed ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
              cursor: 'crosshair'
            }}
          >
            <div 
              className={`cell-inner ${cell.color}`}
              style={{
                opacity: cell.isRevealed && cell.isPartOfPattern ? 1 : 0,
                transform: cell.isRevealed && cell.isPartOfPattern ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
