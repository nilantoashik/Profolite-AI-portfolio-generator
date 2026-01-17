import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Settings } from 'lucide-react';
import './App.css';
import ProfileForm from './components/ProfileForm';
import Header from './components/Header';
import DesignSettings from './components/DesignSettings';
import PortfolioTemplate from './components/PortfolioTemplate';
import { generatePortfolioContent } from './services/api';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [theme, setTheme] = useState('light');
  
  const [designSettings, setDesignSettings] = useState({
    colorScheme: 'dark',
    accentColor: '#3b82f6',
    typography: 'inter-jetbrains',
    layoutStyle: 'professional',
    animations: true,
    sections: ['about', 'skills', 'projects', 'contact']
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleGenerate = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePortfolioContent(profileData);
      setGeneratedContent(result.data);
      setActiveTab('preview');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate content');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setError(null);
    setActiveTab('form');
  };

  return (
    <div className="App">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span className="error-icon" aria-hidden="true"><AlertTriangle size={18} /></span>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="close-btn" aria-label="Close error">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Profile Input
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              Design Settings
            </button>
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
              disabled={!generatedContent}
            >
              Preview
            </button>
          </div>

          {activeTab === 'form' && (
            <ProfileForm 
              onGenerate={handleGenerate} 
              loading={loading}
            />
          )}

          {activeTab === 'settings' && (
            <DesignSettings 
              settings={designSettings}
              onSettingsChange={setDesignSettings}
            />
          )}

          {activeTab === 'preview' && generatedContent && (
            <div className="preview-container">
              <PortfolioTemplate 
                content={generatedContent}
                settings={designSettings}
              />
              <button 
                className="reset-button"
                onClick={handleReset}
              >
                ← Back to Edit
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Profolite &copy; 2026 - AI-Powered Portfolio Generator</p>
      </footer>
    </div>
  );
}

export default App;
