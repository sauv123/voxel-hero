import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './InteractiveBlocks.css';

const COLORS = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

export default function InteractiveBlocks() {
  const containerRef = useRef(null);
  const [cells, setCells] = useState([]);
  
  // Initialize grid
  useEffect(() => {
    // We adjust columns based on screen width for responsiveness
    const updateGrid = () => {
      let currentCols = 4;
      let currentRows = 4;
      
      const totalCells = currentRows * currentCols;
      
      // A connected smile shape in 4x4 grid:
      // 0  1  2  3
      // 4  5  6  7
      // 8  9 10 11
      // 12 13 14 15
      // Left cheek: 4, 8
      // Bottom lip: 12, 13, 14, 15
      // Right cheek: 11, 7
      const smileIndices = new Set([4, 8, 12, 13, 14, 15, 11, 7]);
      
      const newCells = Array.from({ length: totalCells }, (_, i) => {
        const isPreFilled = smileIndices.has(i);
        const color = isPreFilled ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
        
        return {
          id: i,
          color: color,
          active: isPreFilled,
        };
      });
      
      setCells({ rows: currentRows, cols: currentCols, items: newCells });
    };
    
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  const handleMouseEnter = (index, el) => {
    setCells(prev => {
      if (!prev.items || prev.items[index].active) return prev;
      
      const newItems = [...prev.items];
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      newItems[index] = { ...newItems[index], active: true, color: randomColor };
      
      // Animate entry
      const inner = el.querySelector('.cell-inner');
      if (inner) {
        gsap.fromTo(inner, {
          opacity: 0,
          scale: 0.8
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)"
        });
      }
      
      // Bounce container
      gsap.fromTo(el, {
        scale: 1
      }, {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      
      return { ...prev, items: newItems };
    });
  };

  if (!cells.items) return null;

  return (
    <div className="interactive-blocks-wrapper" ref={containerRef}>
      <div 
        className="interactive-grid"
        style={{
          gridTemplateColumns: `repeat(${cells.cols}, 1fr)`,
          gridTemplateRows: `repeat(${cells.rows}, 1fr)`
        }}
      >
        {cells.items.map((cell, idx) => (
          <div 
            key={`${cell.id}-${cells.cols}`}
            className={`cell ${cell.active ? 'active' : ''}`}
            onMouseEnter={(e) => handleMouseEnter(idx, e.currentTarget)}
            onTouchStart={(e) => handleMouseEnter(idx, e.currentTarget)}
          >
            <div 
              className={`cell-inner ${cell.color || ''}`}
              style={{
                opacity: cell.active ? 1 : 0,
                transform: cell.active ? 'scale(1)' : 'scale(0.8)'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
