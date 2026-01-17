import React from 'react';
import { Palette, Type, Layout, Zap, Eye } from 'lucide-react';
import './DesignSettings.css';

const DesignSettings = ({ settings, onSettingsChange }) => {
  const handleColorSchemeChange = (scheme) => {
    onSettingsChange({ ...settings, colorScheme: scheme });
  };

  const handleAccentColorChange = (color) => {
    onSettingsChange({ ...settings, accentColor: color });
  };

  const handleTypographyChange = (font) => {
    onSettingsChange({ ...settings, typography: font });
  };

  const handleLayoutChange = (layout) => {
    onSettingsChange({ ...settings, layoutStyle: layout });
  };

  const handleAnimationToggle = () => {
    onSettingsChange({ ...settings, animations: !settings.animations });
  };

  const handleSectionToggle = (section) => {
    const newSections = settings.sections.includes(section)
      ? settings.sections.filter(s => s !== section)
      : [...settings.sections, section];
    onSettingsChange({ ...settings, sections: newSections });
  };

  const accentColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  const fontPairs = [
    { name: 'Inter + JetBrains', value: 'inter-jetbrains' },
    { name: 'Georgia + Monaco', value: 'georgia-monaco' },
    { name: 'System Default', value: 'system' }
  ];

  const layoutStyles = [
    { name: 'Minimalist', value: 'minimalist', icon: '◻' },
    { name: 'Bold', value: 'bold', icon: '⬛' },
    { name: 'Professional', value: 'professional', icon: '▢' }
  ];

  const sections = ['about', 'skills', 'projects', 'contact', 'testimonials', 'blog'];

  return (
    <div className="design-settings">
      <div className="settings-container">
        {/* Color Scheme */}
        <div className="settings-group">
          <div className="settings-header">
            <Palette size={18} />
            <h3>Color Scheme</h3>
          </div>
          <div className="settings-options">
            {['dark', 'light', 'custom'].map(scheme => (
              <button
                key={scheme}
                className={`option-button ${settings.colorScheme === scheme ? 'active' : ''}`}
                onClick={() => handleColorSchemeChange(scheme)}
              >
                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="settings-group">
          <div className="settings-header">
            <Zap size={18} />
            <h3>Accent Color</h3>
          </div>
          <div className="color-picker">
            {accentColors.map(color => (
              <button
                key={color.value}
                className={`color-swatch ${settings.accentColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleAccentColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="settings-group">
          <div className="settings-header">
            <Type size={18} />
            <h3>Typography</h3>
          </div>
          <div className="settings-options">
            {fontPairs.map(font => (
              <button
                key={font.value}
                className={`option-button ${settings.typography === font.value ? 'active' : ''}`}
                onClick={() => handleTypographyChange(font.value)}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Style */}
        <div className="settings-group">
          <div className="settings-header">
            <Layout size={18} />
            <h3>Layout Style</h3>
          </div>
          <div className="settings-options">
            {layoutStyles.map(layout => (
              <button
                key={layout.value}
                className={`option-button ${settings.layoutStyle === layout.value ? 'active' : ''}`}
                onClick={() => handleLayoutChange(layout.value)}
              >
                <span className="layout-icon">{layout.icon}</span>
                {layout.name}
              </button>
            ))}
          </div>
        </div>

        {/* Animations */}
        <div className="settings-group">
          <div className="settings-header">
            <Zap size={18} />
            <h3>Animations</h3>
          </div>
          <button
            className={`toggle-button ${settings.animations ? 'enabled' : 'disabled'}`}
            onClick={handleAnimationToggle}
          >
            {settings.animations ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Portfolio Sections */}
        <div className="settings-group">
          <div className="settings-header">
            <Eye size={18} />
            <h3>Portfolio Sections</h3>
          </div>
          <div className="sections-grid">
            {sections.map(section => (
              <label key={section} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.sections.includes(section)}
                  onChange={() => handleSectionToggle(section)}
                />
                <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preview Info */}
        <div className="settings-info">
          <Eye size={16} />
          <p>Your portfolio preview will update in real-time as you change these settings.</p>
        </div>
      </div>
    </div>
  );
};

export default DesignSettings;
