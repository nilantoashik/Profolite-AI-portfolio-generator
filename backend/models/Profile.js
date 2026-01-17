const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // Input data from user
  inputData: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    skills: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      features: [String],
      link: String,
      github: String
    }],
    goals: String,
    resumeText: String,
    jobDescription: String,
    email: String,
    github: String,
    linkedin: String,
    website: String
  },
  
  // Generated content from AI
  generatedContent: {
    about: {
      headline: String,
      paragraphs: [String]
    },
    skills: {
      categories: [{
        name: String,
        skills: [{
          name: String,
          description: String
        }]
      }]
    },
    projects: [{
      title: String,
      summary: String,
      features: [String],
      technologies: [String],
      link: String,
      github: String
    }],
    contact: {
      heading: String,
      message: String,
      cta: String
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  
  // Metadata
  metadata: {
    model: String,
    tokensUsed: Number,
    generatedAt: { type: Date, default: Date.now }
  },
  
  // Version tracking
  version: { type: Number, default: 1 },
  isPublished: { type: Boolean, default: false },
  publishedUrl: String

}, {
  timestamps: true
});

// Indexes for better query performance
profileSchema.index({ 'inputData.name': 1 });
profileSchema.index({ createdAt: -1 });
profileSchema.index({ 'inputData.email': 1 });

module.exports = mongoose.model('Profile', profileSchema);
