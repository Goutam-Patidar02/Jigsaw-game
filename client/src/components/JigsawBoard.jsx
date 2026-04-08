import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const JigsawBoard = ({ image, rows = 3, cols = 3, onSolve }) => {
  const [pieces, setPieces] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  // Calculate sizes based on viewport
  useEffect(() => {
    let lastWidth = 0;
    const updateSize = () => {
      const currentWidth = window.innerWidth;
      // Ignore height-only changes (common on mobile when scrolling hides the URL bar)
      if (lastWidth === currentWidth) return;
      lastWidth = currentWidth;

      let calcWidth = currentWidth - 40;
      if (calcWidth > 800) calcWidth = 800;
      
      let calcHeight = calcWidth * 0.6; // Maintain 5:3 aspect ratio
      
      const maxVH = window.innerHeight - 250;
      if (calcHeight > maxVH) {
        calcHeight = Math.max(maxVH, 200);
        calcWidth = calcHeight / 0.6;
      }
      
      setBoardSize({ width: Math.max(calcWidth, 250), height: Math.max(calcHeight, 150) });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const initializePuzzle = useCallback(() => {
    if (boardSize.width === 0) return;

    const pieceWidth = boardSize.width / cols;
    const pieceHeight = boardSize.height / rows;
    
    const newPieces = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Target position (solved state)
        const targetX = c * pieceWidth;
        const targetY = r * pieceHeight;
        
        // Random starting position (shuffled effect)
        // Spread pieces across the board area roughly
        const startX = Math.random() * (boardSize.width - pieceWidth);
        const startY = Math.random() * (boardSize.height - pieceHeight);

        newPieces.push({
          id: `${r}-${c}`,
          r,
          c,
          targetX,
          targetY,
          currentX: startX,
          currentY: startY,
          isSnapped: false
        });
      }
    }
    
    setPieces(newPieces);
  }, [boardSize, rows, cols]);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const handleDragEnd = (id, info) => {
    setPieces(prevPieces => {
      const updatedPieces = prevPieces.map(p => {
        if (p.id === id) {
          const newX = p.currentX + info.offset.x;
          const newY = p.currentY + info.offset.y;

          // Check if close to target position (snapping)
          const distance = Math.sqrt(
            Math.pow(newX - p.targetX, 2) + Math.pow(newY - p.targetY, 2)
          );

          if (distance < 30) { // 30px threshold for snapping
            return { ...p, currentX: p.targetX, currentY: p.targetY, isSnapped: true };
          }

          // Keep within board bounds
          const constrainedX = Math.max(0, Math.min(newX, boardSize.width - boardSize.width / cols));
          const constrainedY = Math.max(0, Math.min(newY, boardSize.height - boardSize.height / rows));

          return { ...p, currentX: constrainedX, currentY: constrainedY, isSnapped: false };
        }
        return p;
      });

      // Check if all pieces are snapped
      const solved = updatedPieces.every(p => p.isSnapped);
      if (solved) onSolve();

      return updatedPieces;
    });
  };

  const pieceWidth = boardSize.width / cols;
  const pieceHeight = boardSize.height / rows;

  return (
    <div className="jigsaw-board" style={{ width: boardSize.width, height: boardSize.height }}>
      {/* Grid Guide */}
      <div className="board-grid-guide">
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={i} className="grid-cell" style={{ width: pieceWidth, height: pieceHeight }} />
        ))}
      </div>

      {/* Pieces */}
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          drag
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={(e, info) => handleDragEnd(p.id, info)}
          animate={{ x: p.currentX, y: p.currentY }}
          className={`jigsaw-piece ${p.isSnapped ? 'snapped' : ''}`}
          style={{
            width: pieceWidth,
            height: pieceHeight,
            position: 'absolute',
            backgroundImage: `url(${image})`,
            backgroundSize: `${boardSize.width}px ${boardSize.height}px`,
            backgroundPosition: `-${p.c * pieceWidth}px -${p.r * pieceHeight}px`,
            zIndex: p.isSnapped ? 1 : 10,
            cursor: p.isSnapped ? 'default' : 'grab'
          }}
          whileHover={!p.isSnapped ? { scale: 1.05, zIndex: 20 } : {}}
          whileDrag={{ scale: 1.1, zIndex: 100 }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        .jigsaw-board {
          position: relative;
          background: rgba(0,0,0,0.4);
          border: 2px solid rgba(255,255,255,0.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          overflow: hidden;
          margin: 0 auto;
        }
        .board-grid-guide {
          display: grid;
          grid-template-columns: repeat(${cols}, 1fr);
          grid-template-rows: repeat(${rows}, 1fr);
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.2; pointer-events: none;
        }
        .grid-cell { border: 1px dashed rgba(255,255,255,0.2); }
        
        .jigsaw-piece {
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: border-radius 0.3s;
        }
        .jigsaw-piece.snapped {
          box-shadow: none;
          border-radius: 0;
          border-color: rgba(255,255,255,0.05);
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default JigsawBoard;
