import React, { useState } from 'react';
import { Wand2, Plus, Trash2 } from 'lucide-react';
import './ProfileForm.css';

const ProfileForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experienceLevel: 'Mid-Level',
    skills: '',
    projects: [{ name: '', description: '', technologies: '', features: '', link: '', github: '' }],
    goals: '',
    resumeText: '',
    jobDescription: '',
    email: '',
    github: '',
    linkedin: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData(prev => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', features: '', link: '', github: '' }]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transform data to match API schema
    const profileData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      projects: formData.projects.map(p => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies.split(',').map(t => t.trim()).filter(t => t),
        features: p.features.split(',').map(f => f.trim()).filter(f => f),
        link: p.link,
        github: p.github
      })).filter(p => p.name)
    };

    onGenerate(profileData);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>Basic Information</h2>
        
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Professional Role *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="Full Stack Developer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experienceLevel">Experience Level *</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Principal">Principal</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills * (comma-separated)</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            rows="3"
            placeholder="JavaScript, React, Node.js, Python, MongoDB"
          />
          <small>Separate skills with commas</small>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Projects *</h2>
        </div>

        {formData.projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-header">
              <h3>Project {index + 1}</h3>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="btn-remove"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                required
                placeholder="E-commerce Platform"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                rows="2"
                placeholder="Brief description of the project"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="form-group">
                <label>Features (comma-separated)</label>
                <input
                  type="text"
                  value={project.features}
                  onChange={(e) => handleProjectChange(index, 'features', e.target.value)}
                  placeholder="User authentication, Real-time updates"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project Link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="project-add-row">
          <button type="button" onClick={addProject} className="btn-add">
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="form-section">
        <h2>Additional Information</h2>

        <div className="form-group">
          <label htmlFor="goals">Professional Goals</label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows="3"
            placeholder="What are you looking for? (e.g., seeking frontend opportunities, open to freelance work)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="resumeText">Resume / Additional Context</label>
          <textarea
            id="resumeText"
            name="resumeText"
            value={formData.resumeText}
            onChange={handleChange}
            rows="4"
            placeholder="Paste relevant sections of your resume or additional background information"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">Target Job Description (Optional)</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Paste a job description to tailor content toward specific role requirements"
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Contact Information</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Personal Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn-generate" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Generating Content...
          </>
        ) : (
          <>
            <Wand2 size={18} />
            Generate Portfolio Content
          </>
        )}
      </button>
    </form>
  );
};

export default ProfileForm;
