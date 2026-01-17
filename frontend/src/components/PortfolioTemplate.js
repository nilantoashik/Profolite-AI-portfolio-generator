import React from 'react';
import { Github, Globe, Code2 } from 'lucide-react';
import './PortfolioTemplate.css';

const PortfolioTemplate = ({ content, settings }) => {
  if (!content) {
    return (
      <div className="portfolio-template empty">
        <div className="empty-state">
          <Code2 size={48} />
          <h2>Your Portfolio Preview</h2>
          <p>Fill in your profile and generate content to see your portfolio here</p>
        </div>
      </div>
    );
  }

  const { about, skills, projects, contact, seo } = content;

  return (
    <div 
      className={`portfolio-template ${settings.colorScheme} ${settings.layoutStyle} ${settings.typography}`}
      style={{ '--accent-color': settings.accentColor }}
    >
      {/* Hero Section */}
      {settings.sections.includes('about') && (
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>{about?.headline}</h1>
              <div className="about-text">
                {about?.paragraphs?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {settings.sections.includes('skills') && skills?.categories && (
        <section className="skills">
          <div className="container">
            <h2>Skills & Expertise</h2>
            <div className="skills-grid">
              {skills.categories.map((category, idx) => (
                <div key={idx} className="skill-category">
                  <h3>{category.name}</h3>
                  <div className="skills-list">
                    {category.skills?.map((skill, sidx) => (
                      <div key={sidx} className="skill-item">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-desc">{skill.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {settings.sections.includes('projects') && projects && (
        <section className="projects">
          <div className="container">
            <h2>Featured Projects</h2>
            <div className="projects-grid">
              {projects.map((project, idx) => (
                <div key={idx} className="project-card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                  </div>
                  <p className="project-summary">{project.summary}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-tech">
                      {project.technologies.map((tech, tidx) => (
                        <span key={tidx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.features && project.features.length > 0 && (
                    <ul className="project-features">
                      {project.features.map((feature, fidx) => (
                        <li key={fidx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  <div className="project-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                        <Globe size={16} />
                        View Live
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-btn">
                        <Github size={16} />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {settings.sections.includes('contact') && contact && (
        <section className="contact">
          <div className="container">
            <h2>{contact.heading}</h2>
            <p className="contact-message">{contact.message}</p>
            <button className="cta-button">{contact.cta}</button>
          </div>
        </section>
      )}
  
        {settings.sections.includes('testimonials') && (
          <section className="testimonials">
          <div className="container">
            <h2>Testimonials</h2>
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
              Client testimonials will appear here
            </p>
          </div>
        </section>
      )}

      {/* Blog Placeholder */}
      {settings.sections.includes('blog') && (
        <section className="blog">
          <div className="container">
            <h2>Latest Articles</h2>
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
              Blog articles will appear here
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default PortfolioTemplate;
