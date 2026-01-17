# Profolite - AI Portfolio Generator

<div align="center">
  <h3>✨ AI-Powered Portfolio Content Generator ✨</h3>
  <p>Transform your professional profile into polished, SEO-optimized portfolio content using OpenAI</p>
</div>

---

## 🎯 Overview

Profolite is a full-stack web application that generates complete, professional portfolio website content using AI. Simply provide your basic information, skills, projects, and career goals—Profolite creates polished copy for your About section, Skills, Projects, Contact page, and SEO metadata.

### Key Features

- **AI-Powered Content Generation** - Uses OpenAI GPT-4 to create professional, human-sounding copy
- **Structured Output** - Generates complete portfolio sections with proper formatting
- **Multiple Export Formats** - Export as JSON, HTML, or Markdown
- **Real-time Preview** - See generated content instantly in a beautiful UI
- **Skill Categorization** - Automatically organizes skills into logical categories
- **Project Enhancement** - Transforms project descriptions into polished summaries with features
- **SEO Optimization** - Generates meta titles, descriptions, and keywords
- **Job Description Matching** - Optionally tailor content to specific job requirements
- **Optional Database Storage** - Save and version your generated content (MongoDB)

---

## 🏗️ Technology Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** (GPT-4) for content generation
- **MongoDB** with Mongoose (optional)
- **Joi** for input validation
- **Helmet** and rate limiting for security

### Frontend
- **React** 18 with hooks
- **Axios** for API communication
- **CSS3** with responsive design
- **Lucide React** for icons

---

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- MongoDB (optional, for profile storage)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Profolite-AI portfolio generator"
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### 3. Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# REQUIRED: Your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# OPTIONAL: MongoDB for profile storage (leave empty to run without DB)
MONGODB_URI=mongodb://localhost:27017/profolite
```

#### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Option A: Run Both Backend and Frontend Together (Recommended)

```bash
# From the root directory
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 📖 Usage Guide

### 1. Fill Out Your Profile

Navigate to `http://localhost:3000` and fill in the form:

- **Basic Info**: Name, role, experience level
- **Skills**: List your technical skills (comma-separated)
- **Projects**: Add projects with descriptions, technologies, features
- **Goals**: Your professional objectives
- **Optional**: Resume text, job description for tailored content
- **Contact**: Email, GitHub, LinkedIn, website

### 2. Generate Content

Click "Generate Portfolio Content" and wait 10-30 seconds for AI processing.

### 3. Preview & Edit

Review the generated content across five sections:
- About
- Skills
- Projects
- Contact
- SEO

### 4. Export

Export your content in multiple formats:
- **JSON** - Structured data for custom integrations
- **HTML** - Ready-to-deploy webpage
- **Markdown** - For GitHub, documentation, or static site generators

---

## 🔌 API Documentation

### Generate Portfolio Content

**POST** `/api/generate`

**Request Body:**
```json
{
  "name": "John Doe",
  "role": "Full Stack Developer",
  "experienceLevel": "Mid-Level",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Online shopping platform with payment integration",
      "technologies": ["React", "Node.js", "Stripe"],
      "features": ["User authentication", "Shopping cart", "Payment processing"],
      "link": "https://example.com",
      "github": "https://github.com/username/repo"
    }
  ],
  "goals": "Seeking senior full-stack opportunities",
  "resumeText": "5 years experience...",
  "jobDescription": "Looking for a senior developer...",
  "email": "john@example.com",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "website": "https://johndoe.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "about": {
      "headline": "Full Stack Developer crafting scalable web solutions",
      "paragraphs": ["...", "...", "..."]
    },
    "skills": {
      "categories": [...]
    },
    "projects": [...],
    "contact": {...},
    "seo": {...}
  },
  "usage": {
    "promptTokens": 1234,
    "completionTokens": 567,
    "totalTokens": 1801
  }
}
```

### Export Endpoints

- **POST** `/api/export/json` - Export as JSON
- **POST** `/api/export/html` - Export as HTML
- **POST** `/api/export/markdown` - Export as Markdown

### Profile Management (Requires MongoDB)

- **POST** `/api/profiles` - Save profile
- **GET** `/api/profiles` - List all profiles
- **GET** `/api/profiles/:id` - Get specific profile
- **PUT** `/api/profiles/:id` - Update profile
- **DELETE** `/api/profiles/:id` - Delete profile

---

## 🎨 Content Generation System

### Prompt Architecture

Profolite uses a sophisticated prompt system that:

1. **Professional Tone**: Generates clear, confident copy that sounds human
2. **Avoids Clichés**: Eliminates buzzwords and marketing jargon
3. **Fact-Based**: Never exaggerates or fabricates skills
4. **Structured Output**: Enforces JSON schema for consistency
5. **Skill Normalization**: Standardizes technology names (e.g., "javascript" → "JavaScript")
6. **Project Enhancement**: Creates realistic, specific features (not generic statements)
7. **SEO Optimization**: Generates relevant metadata
8. **Job Matching**: Subtly emphasizes relevant skills when job description provided

### Output Schema

```json
{
  "about": {
    "headline": "50-80 character professional headline",
    "paragraphs": ["2-3 sentences each", "..."]
  },
  "skills": {
    "categories": [
      {
        "name": "Frontend Development",
        "skills": [
          {
            "name": "React",
            "description": "10-20 word practical description"
          }
        ]
      }
    ]
  },
  "projects": [
    {
      "title": "Professional project title",
      "summary": "One clear sentence about the project",
      "features": ["Specific feature", "Another feature"],
      "technologies": ["Tech1", "Tech2"],
      "link": "URL",
      "github": "GitHub URL"
    }
  ],
  "contact": {
    "heading": "Contact section heading",
    "message": "2-3 sentence CTA aligned with goals",
    "cta": "Button text"
  },
  "seo": {
    "title": "50-60 character page title",
    "description": "140-160 character meta description",
    "keywords": ["keyword1", "keyword2", "..."]
  }
}
```

---

## 🔒 Security Features

- **Rate Limiting**: 20 generations per hour per IP
- **Input Validation**: Joi schema validation on all inputs
- **Helmet.js**: Security headers protection
- **CORS**: Configured for frontend-backend communication
- **Environment Variables**: Sensitive data kept secure

---

## 🐛 Troubleshooting

### OpenAI API Errors

**Error: Invalid API Key**
- Verify your `OPENAI_API_KEY` in `backend/.env`
- Ensure no extra spaces or quotes around the key

**Error: Insufficient Quota**
- Check your OpenAI account billing
- Verify you have credits available

### Database Connection Issues

**MongoDB Connection Failed**
- If you don't need database features, leave `MONGODB_URI` empty
- The app will run without database functionality
- For local MongoDB: Ensure MongoDB is running (`mongod`)
- For MongoDB Atlas: Check connection string and network access

### Port Already in Use

```bash
# Change ports in .env files
# Backend: PORT=5001
# Frontend: Update REACT_APP_API_URL accordingly
```

---

## 📦 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables on your hosting platform
2. Ensure `NODE_ENV=production`
3. Set `FRONTEND_URL` to your deployed frontend URL
4. Deploy `backend` directory

### Frontend Deployment (Vercel, Netlify, GitHub Pages)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Set `REACT_APP_API_URL` to your deployed backend URL
3. Deploy the `build` directory

#### GitHub Pages CI (Auto-deploy)

This repo is configured to automatically deploy the React frontend to the `gh-pages` branch on each push to `main`/`master`.

- Workflow: see [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
- Build output: publishes from [frontend/build](frontend/build) to `gh-pages`
- SPA support: adds `.nojekyll` and a `404.html` redirect for client-side routing

Manual trigger:

```bash
# From the repo on GitHub: Actions → "Deploy Frontend to GitHub Pages" → Run workflow
```

Manual deploy (local):

```bash
cd frontend
npm run build
npm run deploy
```

---

## 🛣️ Roadmap

- [ ] Real-time collaborative editing
- [ ] Multiple design themes for HTML export
- [ ] Portfolio hosting/deployment integration
- [ ] Resume parsing (PDF/DOCX upload)
- [ ] LinkedIn profile import
- [ ] A/B testing different versions
- [ ] Analytics integration
- [ ] Multi-language support

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 💬 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

<div align="center">
  <p>Built with ❤️ using Node.js, React, and OpenAI</p>
  <p><strong>Profolite</strong> - Making portfolio creation effortless</p>
</div>
