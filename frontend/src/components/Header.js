import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import './Header.css';

const Header = ({ theme, onToggleTheme }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon" aria-hidden="true">
            <Sparkles size={26} strokeWidth={1.8} />
          </span>
          <div>
            <h1>Profolite</h1>
            <p className="tagline">AI-Powered Portfolio Content Generator</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="toggle-icon" aria-hidden="true">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
