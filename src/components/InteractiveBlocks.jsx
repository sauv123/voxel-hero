import React, { useState } from 'react';
import './InteractiveBlocks.css';

const COLORS = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

const PATTERNS = [
  // SMILEY
  [7, 10, 18, 23, 25, 26, 27, 28],
  // FISH
  [9, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 33],
  // TEDDY
  [0, 5, 7, 8, 9, 10, 13, 16, 19, 20, 21, 22, 26, 27],
  // ALIEN
  [2, 3, 7, 8, 9, 10, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 29, 30, 35]
];

export default function InteractiveBlocks() {
  const [step, setStep] = useState(0); 
  
  // step 0: empty
  // step 1: pattern 0
  // step 2: empty
  // step 3: pattern 1
  // ...

  const handleMouseEnter = () => {
    setStep(prev => (prev + 1) % (PATTERNS.length * 2));
  };

  const isVisible = step % 2 !== 0;
  const patternIndex = Math.floor(step / 2) % PATTERNS.length;
  const activePattern = new Set(PATTERNS[patternIndex]);

  // grid 6x6 = 36 cells
  const cells = Array.from({ length: 36 }, (_, i) => {
    const active = isVisible && activePattern.has(i);
    // Use a stable color based on index so it doesn't flicker when hiding
    const color = COLORS[i % COLORS.length];
    return { id: i, active, color };
  });

  return (
    <div 
      className="interactive-blocks-wrapper" 
      onMouseEnter={handleMouseEnter}
      style={{ cursor: 'pointer', padding: '10px' }}
    >
      <div 
        className="interactive-grid"
        style={{
          gridTemplateColumns: `repeat(6, 1fr)`,
          gridTemplateRows: `repeat(6, 1fr)`,
          width: '100%',
          height: '100%'
        }}
      >
        {cells.map((cell) => (
          <div key={cell.id} className={`cell ${cell.active ? 'active' : ''}`}>
            <div 
              className={`cell-inner ${cell.color}`}
              style={{
                opacity: cell.active ? 1 : 0,
                transform: cell.active ? 'scale(1)' : 'scale(0.8)',
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
