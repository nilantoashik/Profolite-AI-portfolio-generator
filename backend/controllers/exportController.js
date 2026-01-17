/**
 * Export controllers for different format exports
 */

/**
 * POST /api/export/json
 * Export generated content as JSON
 */
const exportAsJSON = async (req, res) => {
  try {
    const { content, metadata } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'No content provided for export'
      });
    }

    const exportData = {
      ...content,
      exportedAt: new Date().toISOString(),
      ...metadata
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio-content.json"');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * POST /api/export/html
 * Export generated content as HTML
 */
const exportAsHTML = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'No content provided for export'
      });
    }

    const html = generateHTML(content);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio.html"');
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * POST /api/export/markdown
 * Export generated content as Markdown
 */
const exportAsMarkdown = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'No content provided for export'
      });
    }

    const markdown = generateMarkdown(content);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio.md"');
    res.send(markdown);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Generate HTML from content
 */
const generateHTML = (content) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.seo.title}</title>
    <meta name="description" content="${content.seo.description}">
    <meta name="keywords" content="${content.seo.keywords.join(', ')}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1a1a1a; }
        h2 { font-size: 2rem; margin: 2rem 0 1rem; color: #1a1a1a; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; color: #2a2a2a; }
        p { margin-bottom: 1rem; color: #555; }
        .headline { font-size: 1.25rem; color: #666; margin-bottom: 2rem; }
        .skill-category { margin-bottom: 2rem; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .skill-item { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
        .skill-name { font-weight: 600; color: #1a1a1a; margin-bottom: 0.25rem; }
        .skill-desc { font-size: 0.9rem; color: #666; }
        .project { background: #f9f9f9; padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 8px; border-left: 4px solid #007bff; }
        .project-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
        .project-summary { margin-bottom: 1rem; color: #555; }
        .features { list-style: none; margin: 1rem 0; }
        .features li { padding: 0.25rem 0 0.25rem 1.5rem; position: relative; }
        .features li:before { content: "✓"; position: absolute; left: 0; color: #28a745; font-weight: bold; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
        .tech-tag { background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; }
        .contact-section { background: #f0f0f0; padding: 2rem; border-radius: 8px; margin-top: 2rem; text-align: center; }
        .cta-button { display: inline-block; background: #007bff; color: white; padding: 0.75rem 2rem; text-decoration: none; border-radius: 4px; margin-top: 1rem; font-weight: 600; }
        .cta-button:hover { background: #0056b3; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <section id="about">
        <h1>About Me</h1>
        <p class="headline">${content.about.headline}</p>
        ${content.about.paragraphs.map(p => `<p>${p}</p>`).join('\n        ')}
    </section>

    <section id="skills">
        <h2>Skills</h2>
        ${content.skills.categories.map(category => `
        <div class="skill-category">
            <h3>${category.name}</h3>
            <div class="skills-grid">
                ${category.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-desc">${skill.description}</div>
                </div>`).join('\n                ')}
            </div>
        </div>`).join('\n        ')}
    </section>

    <section id="projects">
        <h2>Projects</h2>
        ${content.projects.map(project => `
        <div class="project">
            <div class="project-title">${project.title}</div>
            <p class="project-summary">${project.summary}</p>
            <ul class="features">
                ${project.features.map(f => `<li>${f}</li>`).join('\n                ')}
            </ul>
            <div class="tech-stack">
                ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('\n                ')}
            </div>
            ${project.link || project.github ? `
            <div style="margin-top: 1rem;">
                ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ''}
                ${project.link && project.github ? ' | ' : ''}
                ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
            </div>` : ''}
        </div>`).join('\n        ')}
    </section>

    <section id="contact" class="contact-section">
        <h2>${content.contact.heading}</h2>
        <p>${content.contact.message}</p>
        <a href="#" class="cta-button">${content.contact.cta}</a>
    </section>
</body>
</html>`;
};

/**
 * Generate Markdown from content
 */
const generateMarkdown = (content) => {
  let md = `# About Me\n\n`;
  md += `**${content.about.headline}**\n\n`;
  md += content.about.paragraphs.map(p => p).join('\n\n') + '\n\n';
  
  md += `## Skills\n\n`;
  content.skills.categories.forEach(category => {
    md += `### ${category.name}\n\n`;
    category.skills.forEach(skill => {
      md += `- **${skill.name}**: ${skill.description}\n`;
    });
    md += '\n';
  });
  
  md += `## Projects\n\n`;
  content.projects.forEach(project => {
    md += `### ${project.title}\n\n`;
    md += `${project.summary}\n\n`;
    md += `**Features:**\n`;
    project.features.forEach(f => {
      md += `- ${f}\n`;
    });
    md += `\n**Technologies:** ${project.technologies.join(', ')}\n\n`;
    if (project.link) md += `[View Project](${project.link})`;
    if (project.link && project.github) md += ` | `;
    if (project.github) md += `[GitHub](${project.github})`;
    md += '\n\n';
  });
  
  md += `## ${content.contact.heading}\n\n`;
  md += `${content.contact.message}\n\n`;
  md += `**${content.contact.cta}**\n`;
  
  return md;
};

module.exports = {
  exportAsJSON,
  exportAsHTML,
  exportAsMarkdown
};
