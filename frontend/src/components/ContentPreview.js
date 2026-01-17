import React, { useState } from 'react';
import { Clipboard, Download, Globe2, FileText, RotateCw } from 'lucide-react';
import './ContentPreview.css';
import { exportAsJSON, exportAsHTML, exportAsMarkdown } from '../services/api';

const ContentPreview = ({ content, onReset }) => {
  const [activeSection, setActiveSection] = useState('about');
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      let blob;
      let filename;

      switch (format) {
        case 'json':
          blob = await exportAsJSON(content);
          filename = 'portfolio-content.json';
          break;
        case 'html':
          blob = await exportAsHTML(content);
          filename = 'portfolio.html';
          break;
        case 'markdown':
          blob = await exportAsMarkdown(content);
          filename = 'portfolio.md';
          break;
        default:
          return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export content. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    alert('Content copied to clipboard!');
  };

  return (
    <div className="content-preview">
      <div className="preview-header">
        <h2>Generated Portfolio Content</h2>
        <div className="preview-actions">
          <button onClick={copyToClipboard} className="btn-action">
            <Clipboard size={16} />
            Copy JSON
          </button>
          <button onClick={() => handleExport('json')} className="btn-action" disabled={exporting}>
            <Download size={16} />
            Export JSON
          </button>
          <button onClick={() => handleExport('html')} className="btn-action" disabled={exporting}>
            <Globe2 size={16} />
            Export HTML
          </button>
          <button onClick={() => handleExport('markdown')} className="btn-action" disabled={exporting}>
            <FileText size={16} />
            Export MD
          </button>
          <button onClick={onReset} className="btn-reset">
            <RotateCw size={16} />
            New Generation
          </button>
        </div>
      </div>

      <div className="preview-navigation">
        <button
          className={`nav-btn ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          About
        </button>
        <button
          className={`nav-btn ${activeSection === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveSection('skills')}
        >
          Skills
        </button>
        <button
          className={`nav-btn ${activeSection === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveSection('projects')}
        >
          Projects
        </button>
        <button
          className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          Contact
        </button>
        <button
          className={`nav-btn ${activeSection === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveSection('seo')}
        >
          SEO
        </button>
      </div>

      <div className="preview-content">
        {activeSection === 'about' && (
          <div className="section-preview">
            <h3>About Section</h3>
            <div className="preview-card">
              <p className="headline">{content.about.headline}</p>
              {content.about.paragraphs.map((para, index) => (
                <p key={index} className="paragraph">{para}</p>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="section-preview">
            <h3>Skills Section</h3>
            {content.skills.categories.map((category, catIndex) => (
              <div key={catIndex} className="preview-card">
                <h4>{category.name}</h4>
                <div className="skills-grid">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-desc">{skill.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="section-preview">
            <h3>Projects Section</h3>
            {content.projects.map((project, index) => (
              <div key={index} className="preview-card project-card">
                <h4>{project.title}</h4>
                <p className="project-summary">{project.summary}</p>
                
                <div className="features-list">
                  <strong>Features:</strong>
                  <ul>
                    {project.features.map((feature, fIndex) => (
                      <li key={fIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="tech-stack">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {project.technologies.map((tech, tIndex) => (
                      <span key={tIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                {(project.link || project.github) && (
                  <div className="project-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project →
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        GitHub →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="section-preview">
            <h3>Contact Section</h3>
            <div className="preview-card">
              <h4>{content.contact.heading}</h4>
              <p className="paragraph">{content.contact.message}</p>
              <button className="cta-button">{content.contact.cta}</button>
            </div>
          </div>
        )}

        {activeSection === 'seo' && (
          <div className="section-preview">
            <h3>SEO Metadata</h3>
            <div className="preview-card">
              <div className="seo-item">
                <strong>Page Title:</strong>
                <p>{content.seo.title}</p>
              </div>
              <div className="seo-item">
                <strong>Meta Description:</strong>
                <p>{content.seo.description}</p>
              </div>
              <div className="seo-item">
                <strong>Keywords:</strong>
                <div className="keywords">
                  {content.seo.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPreview;
