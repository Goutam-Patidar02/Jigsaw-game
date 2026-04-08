import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Phone, LogIn, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card glass"
      >
        <div className="brand">
          <Gamepad2 size={48} className="accent-color" />
          <h1>Jigsaw <span>Master</span></h1>
          <p>Sign in to your puzzle profile</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <Phone className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Entering...' : (
              <>
                <LogIn size={20} />
                <span>Join Game</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%);
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .brand {
          margin-bottom: 40px;
        }
        .brand h1 {
          font-size: 2.5rem;
          font-family: var(--font-serif);
          margin-top: 16px;
        }
        .brand h1 span {
          color: var(--accent);
        }
        .brand p {
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
        .accent-color { color: var(--accent); }
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          transition: color 0.3s;
        }
        input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          outline: none;
          transition: 0.3s;
        }
        input:focus {
          border-color: var(--accent);
          background: rgba(255,255,255,0.08);
        }
        input:focus + .input-icon {
          color: var(--accent);
        }
        .login-btn {
          width: 100%;
          margin-top: 16px;
          padding: 14px;
          background: var(--accent);
          color: white;
          font-weight: 600;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: 0.3s;
          font-size: 1.1rem;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px var(--accent-glow);
          background: var(--accent-light);
        }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .error-text { color: var(--error); font-size: 0.9rem; margin-bottom: 12px; }
      `}} />
    </div>
  );
};

export default Login;
