import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, LogOut, Award, Clock, History, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      navigate('/');
      return;
    }
    fetchUserData(savedUser.phoneNumber);
  }, [navigate]);

  const fetchUserData = async (phoneNumber) => {
    try {
      const response = await axios.get(`/api/users/${phoneNumber}`);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Failed to sync user data.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header glass">
        <div className="nav-brand">
          <Award className="accent-text" size={32} />
          <h1>Player Profile</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </header>

      <main className="dashboard-main">
        <section className="profile-section">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="player-card glass"
          >
            <div className="avatar-placeholder">
              <UserIcon size={64} />
            </div>
            <div className="player-info">
              <h2>{user.name}</h2>
              <p className="phone">{user.phoneNumber}</p>
              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">Puzzles Solved</span>
                  <span className="stat-value">{user.puzzlesSolved}</span>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/game')} className="play-btn">
              <Play fill="white" size={24} />
              <span>Start New Puzzle</span>
            </button>
          </motion.div>
        </section>

        <section className="history-section">
          <div className="section-title">
            <History size={24} />
            <h3>Recent Solved Puzzles</h3>
          </div>
          
          <div className="history-grid">
            <AnimatePresence>
              {user.history && user.history.length > 0 ? (
                user.history.slice().reverse().map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="history-card glass"
                  >
                    <div className="history-icon">
                      <Award className="accent-text" size={24} />
                    </div>
                    <div className="history-detail">
                      <h4>Puzzle #{index + 1}</h4>
                      <p className="difficulty">{item.difficulty || 'Normal'}</p>
                      <p className="date"><Clock size={12} /> {new Date(item.completedAt).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Your history is empty. Start playing to build your legacy!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          min-height: 100vh;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          margin-bottom: 40px;
        }
        .nav-brand { display: flex; align-items: center; gap: 16px; h1 { font-size: 1.5rem; } }
        .accent-text { color: var(--accent); }
        .logout-btn {
          display: flex; align-items: center; gap: 8px; color: var(--text-secondary);
          padding: 8px 16px; border-radius: 8px; transition: 0.3s;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.05); color: var(--error); }

        .dashboard-main {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .dashboard-main { grid-template-columns: 1fr; }
        }

        .player-card {
          padding: 40px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 24px;
          position: sticky; top: 100px;
        }
        .avatar-placeholder {
          width: 120px; height: 120px; border-radius: 50%; background: var(--bg-tertiary);
          display: flex; align-items: center; justify-content: center;
          border: 4px solid var(--accent); color: var(--accent);
          box-shadow: 0 0 20px var(--accent-glow);
        }
        .player-info h2 { font-size: 2rem; font-family: var(--font-serif); }
        .player-info .phone { color: var(--text-secondary); margin-bottom: 16px; }
        .stat-label { display: block; color: var(--text-secondary); font-size: 0.9rem; }
        .stat-value { font-size: 2.5rem; font-weight: 800; color: var(--accent); }

        .play-btn {
          width: 100%; padding: 18px; background: var(--accent); color: white;
          border-radius: 12px; font-weight: 700; display: flex; align-items: center;
          justify-content: center; gap: 12px; font-size: 1.2rem; transition: 0.3s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .play-btn:hover { transform: scale(1.05); background: var(--accent-light); }

        .section-title {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
          color: var(--text-secondary); h3 { color: white; font-size: 1.4rem; }
        }
        .history-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
        }
        .history-card {
          padding: 20px; display: flex; align-items: center; gap: 16px;
          transition: 0.3s; cursor: default;
        }
        .history-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
        .history-icon {
          background: rgba(124, 77, 255, 0.1); width: 48px; height: 48px;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .history-detail h4 { margin-bottom: 4px; }
        .history-detail .difficulty { color: var(--accent-light); font-size: 0.85rem; font-weight: 600; }
        .history-detail .date { color: var(--text-secondary); font-size: 0.8rem; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .empty-state {
          grid-column: 1 / -1; padding: 60px; text-align: center; border: 2px dashed rgba(255,255,255,0.05);
          border-radius: 20px; color: var(--text-secondary); font-style: italic;
        }
        .loading {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: var(--accent);
        }
      `}} />
    </div>
  );
};

export default Dashboard;
