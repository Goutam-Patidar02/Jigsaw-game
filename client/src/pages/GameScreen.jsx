import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Layers, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import JigsawBoard from '../components/JigsawBoard';

const PUZZLES = [
  "https://picsum.photos/id/10/1000/600",
  "https://picsum.photos/id/11/1000/600",
  "https://picsum.photos/id/12/1000/600",
  "https://picsum.photos/id/13/1000/600",
  "https://picsum.photos/id/14/1000/600",
  "https://picsum.photos/id/15/1000/600",
  "https://picsum.photos/id/16/1000/600",
  "https://picsum.photos/id/17/1000/600",
  "https://picsum.photos/id/18/1000/600",
  "https://picsum.photos/id/19/1000/600",
  "https://picsum.photos/id/20/1000/600",
  "https://picsum.photos/id/21/1000/600",
  "https://picsum.photos/id/22/1000/600",
  "https://picsum.photos/id/23/1000/600",
  "https://picsum.photos/id/24/1000/600",
  "https://picsum.photos/id/25/1000/600",
  "https://picsum.photos/id/26/1000/600",
  "https://picsum.photos/id/27/1000/600",
  "https://picsum.photos/id/28/1000/600",
  "https://picsum.photos/id/29/1000/600"
];

const GameScreen = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const initialIndex = user?.puzzlesSolved ? user.puzzlesSolved % PUZZLES.length : 0;
  
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(initialIndex);
  const image = PUZZLES[currentPuzzleIndex];
  const [difficulty, setDifficulty] = useState({ rows: 3, cols: 3, label: 'Easy' });
  const [isSolved, setIsSolved] = useState(false);
  const [gameId, setGameId] = useState(Date.now());
  const navigate = useNavigate();

  const handleSolve = async () => {
    setIsSolved(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c4dff', '#b388ff', '#ffffff']
    });

    // Save history to backend
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      try {
        const response = await axios.post('/api/puzzles/solve', {
          phoneNumber: currentUser.phoneNumber,
          image: image,
          difficulty: difficulty.label
        });
        // Update local storage so progress persists when leaving and returning to GameScreen
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (err) {
        console.error('Failed to save puzzle history');
      }
    }
  };

  const restartGame = () => {
    setIsSolved(false);
    setGameId(Date.now());
  };

  const handleNextPuzzle = () => {
    setIsSolved(false);
    setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
    setGameId(Date.now());
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn glass">
          <ArrowLeft size={24} />
        </button>
        <div className="game-meta">
          <h2>Ultimate Jigsaw</h2>
          <span className="diff-badge">{difficulty.label} ({difficulty.rows}x{difficulty.cols})</span>
          <span className="diff-badge" style={{ marginLeft: '10px', background: '#333' }}>
            Puzzle {currentPuzzleIndex + 1} of {PUZZLES.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleNextPuzzle} className="next-puzzle-btn glass" title="Skip to Next Puzzle">
            Next Puzzle
          </button>
          <button onClick={restartGame} className="restart-btn glass" title="Restart">
            <RefreshCw size={24} />
          </button>
        </div>
      </header>

      <main className="game-main">
        <div className="board-wrapper">
          <JigsawBoard 
            key={gameId}
            image={image} 
            rows={difficulty.rows} 
            cols={difficulty.cols} 
            onSolve={handleSolve} 
          />
        </div>

        <aside className="game-controls glass">
          <div className="control-section">
            <label><Layers size={18} /> Difficulty</label>
            <div className="difficulty-options">
              {[
                { rows: 3, cols: 3, label: 'Easy' },
                { rows: 4, cols: 4, label: 'Medium' },
                { rows: 5, cols: 5, label: 'Hard' }
              ].map((d) => (
                <button 
                  key={d.label}
                  className={difficulty.label === d.label ? 'active' : ''}
                  onClick={() => { setDifficulty(d); restartGame(); }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <label><ImageIcon size={18} /> Reference Image</label>
            <div className="reference-card glass">
              <img src={image} alt="Reference" />
            </div>
          </div>

          {isSolved && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="success-alert"
            >
              <CheckCircle size={32} />
              <div>
                <h3>Puzzle Solved!</h3>
                <p>Great work, Master!</p>
              </div>
              <div className="action-buttons">
                <button onClick={handleNextPuzzle} className="finish-btn next-btn">
                  Next Puzzle
                </button>
                <button onClick={() => navigate('/dashboard')} className="finish-btn dash-btn">
                  Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .game-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #050505;
          overflow: hidden;
        }
        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .back-btn, .restart-btn {
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
          border-radius: 12px; color: white; transition: 0.3s;
        }
        .next-puzzle-btn {
          height: 48px; display: flex; align-items: center; justify-content: center;
          border-radius: 12px; color: white; transition: 0.3s;
          padding: 0 16px; font-weight: bold; width: auto;
        }
        .back-btn:hover, .next-puzzle-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .restart-btn:hover { background: rgba(255,255,255,0.1); transform: rotate(180deg); }

        .game-meta { text-align: center; }
        .game-meta h2 { font-size: 1.2rem; margin-bottom: 4px; }
        .diff-badge {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          background: var(--accent); padding: 4px 12px; border-radius: 100px;
          color: white; letter-spacing: 1px;
        }

        .game-main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          padding: 24px;
          overflow: hidden;
        }
        @media (max-width: 1024px) {
          .game-main { grid-template-columns: 1fr; grid-template-rows: 1fr auto; padding: 8px; gap: 16px; overflow: auto; }
          .game-controls { width: 100% !important; order: 2; height: auto !important; padding: 16px; }
          .game-header { flex-wrap: wrap; justify-content: center; padding: 12px; gap: 12px; }
          .game-meta { order: -1; width: 100%; margin-bottom: 4px; }
          .diff-badge { margin: 4px; display: inline-block; }
          .board-wrapper { border-radius: 12px; }
          .game-container { overflow: auto; }
        }

        .board-wrapper {
          position: relative;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          overflow: auto;
        }

        .game-controls {
          display: flex; flex-direction: column; gap: 32px;
          padding: 24px; overflow-y: auto; height: 100%;
        }
        .control-section { display: flex; flex-direction: column; gap: 16px; }
        .control-section label { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
        
        .difficulty-options { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .difficulty-options button {
          padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
          color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1);
          transition: 0.3s; background: rgba(255,255,255,0.03);
        }
        .difficulty-options button.active {
          background: var(--accent); color: white; border-color: var(--accent);
          box-shadow: 0 4px 12px var(--accent-glow); transform: translateY(-2px);
        }
        .difficulty-options button:hover:not(.active) { background: rgba(255,255,255,0.1); }

        .reference-card { padding: 12px; border-radius: 12px; }
        .reference-card img { width: 100%; border-radius: 8px; filter: grayscale(0.5); opacity: 0.8; transition: 0.3s; }
        .reference-card:hover img { filter: none; opacity: 1; }

        .success-alert {
          margin-top: auto;
          background: var(--success); color: black; padding: 24px; border-radius: 16px;
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;
        }
        .success-alert h3 { font-weight: 800; font-size: 1.5rem; }
        .finish-btn {
          width: 100%; padding: 12px; border-radius: 8px;
          font-weight: 700; transition: 0.3s; margin-bottom: 8px;
        }
        .next-btn { background: white; color: black; }
        .dash-btn { background: transparent; border: 1px solid rgba(0,0,0,0.2); color: black; }
        .finish-btn:hover { transform: scale(1.05); }
        .action-buttons { width: 100%; display: flex; flex-direction: column; }
      `}} />
    </div>
  );
};

export default GameScreen;
