const OpenAI = require('openai');
const https = require('https');
const http = require('http');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Groq Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Use Groq if API key is provided, otherwise use mock or OpenAI
const USE_GROQ = !!GROQ_API_KEY;
const USE_MOCK_MODE = process.env.MOCK_MODE === 'true';

// Preferred model order: env override -> gpt-4o-mini -> gpt-4o
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const FALLBACK_MODEL = 'gpt-4o';

/**
 * Portfolio content generation system prompt
 * This is the core prompt that defines Profolite's content generation behavior
 */
const getSystemPrompt = () => {
  return `You are a senior professional portfolio website copywriter and UX content strategist. Your task is to generate complete, high-quality content for a personal portfolio website based strictly on the provided user profile data.

TONE & STYLE REQUIREMENTS:
- Write in a clear, confident, professional tone that sounds natural and human
- Avoid clichés, buzzwords, and marketing jargon
- Never exaggerate or fabricate skills, experience, or achievements
- Use active voice and concrete language
- Be concise but informative

CONTENT GUIDELINES:
- Base all content strictly on the provided user data
- Normalize informal or unstructured input into professional language
- Standardize capitalization and terminology (e.g., "Javascript" → "JavaScript", "react" → "React")
- Prioritize the most relevant skills and projects based on the user's role
- If a job description is provided, subtly emphasize matching skills without misrepresentation

OUTPUT REQUIREMENTS:
- Generate content optimized for readability, scannability, and basic SEO
- All technology names must use proper capitalization
- Skills should be categorized logically (Frontend, Backend, Tools, etc.)
- Projects should have realistic, specific features (not generic statements)
- Contact CTA must align with user's stated goal

CRITICAL: You must respond with ONLY valid JSON. No markdown formatting, no code blocks, no explanations, no commentary outside the JSON structure.`;
};

/**
 * Build the user prompt with profile data
 */
const buildUserPrompt = (profileData) => {
  const {
    name,
    role,
    experienceLevel,
    skills = [],
    projects = [],
    goals,
    resumeText,
    jobDescription,
    email,
    github,
    linkedin,
    website
  } = profileData;

  let prompt = `Generate complete portfolio website content for the following profile:\n\n`;
  
  prompt += `NAME: ${name}\n`;
  prompt += `ROLE: ${role}\n`;
  prompt += `EXPERIENCE LEVEL: ${experienceLevel}\n\n`;
  
  if (skills.length > 0) {
    prompt += `SKILLS:\n${skills.map(s => `- ${s}`).join('\n')}\n\n`;
  }
  
  if (projects.length > 0) {
    prompt += `PROJECTS:\n`;
    projects.forEach((project, index) => {
      prompt += `\nProject ${index + 1}:\n`;
      prompt += `  Name: ${project.name || 'Untitled'}\n`;
      if (project.description) prompt += `  Description: ${project.description}\n`;
      if (project.technologies && project.technologies.length > 0) {
        prompt += `  Technologies: ${project.technologies.join(', ')}\n`;
      }
      if (project.features && project.features.length > 0) {
        prompt += `  Features: ${project.features.join(', ')}\n`;
      }
      if (project.link) prompt += `  Link: ${project.link}\n`;
      if (project.github) prompt += `  GitHub: ${project.github}\n`;
    });
    prompt += '\n';
  }
  
  if (goals) {
    prompt += `PROFESSIONAL GOALS: ${goals}\n\n`;
  }
  
  if (resumeText) {
    prompt += `RESUME/ADDITIONAL CONTEXT:\n${resumeText}\n\n`;
  }
  
  if (jobDescription) {
    prompt += `TARGET JOB DESCRIPTION (emphasize relevant skills):\n${jobDescription}\n\n`;
  }
  
  if (email || github || linkedin || website) {
    prompt += `CONTACT INFORMATION:\n`;
    if (email) prompt += `- Email: ${email}\n`;
    if (github) prompt += `- GitHub: ${github}\n`;
    if (linkedin) prompt += `- LinkedIn: ${linkedin}\n`;
    if (website) prompt += `- Website: ${website}\n`;
    prompt += '\n';
  }

  prompt += getOutputSchemaPrompt();
  
  return prompt;
};

/**
 * Define the expected output JSON schema
 */
const getOutputSchemaPrompt = () => {
  return `You must output ONLY valid JSON following this exact schema:

{
  "about": {
    "headline": "A concise, impactful one-sentence professional headline (50-80 characters)",
    "paragraphs": [
      "First paragraph: professional background and current focus (2-3 sentences)",
      "Second paragraph: key skills and approach (2-3 sentences)",
      "Third paragraph (optional): interests, values, or what drives them (2-3 sentences)"
    ]
  },
  "skills": {
    "categories": [
      {
        "name": "Category name (e.g., Frontend Development, Backend Development, Tools & Platforms)",
        "skills": [
          {
            "name": "Skill name (properly capitalized, e.g., JavaScript, React, Node.js)",
            "description": "Brief practical description (10-20 words) focusing on how it's used"
          }
        ]
      }
    ]
  },
  "projects": [
    {
      "title": "Professional, polished project title",
      "summary": "One clear sentence describing what the project does and its purpose",
      "features": [
        "Specific, realistic feature (not generic)",
        "Another concrete feature",
        "Third feature if applicable"
      ],
      "technologies": ["Tech1", "Tech2", "Tech3"],
      "link": "project URL if provided",
      "github": "GitHub URL if provided"
    }
  ],
  "contact": {
    "heading": "Contact section heading",
    "message": "Professional call-to-action paragraph (2-3 sentences) aligned with user's goals",
    "cta": "Call-to-action button text (e.g., 'Get In Touch', 'View My Resume')"
  },
  "seo": {
    "title": "Page title optimized for search (50-60 characters)",
    "description": "Meta description (140-160 characters) summarizing the portfolio",
    "keywords": ["keyword1", "keyword2", "keyword3", "etc"]
  }
}

Remember: Output ONLY the JSON. No markdown, no explanations, no extra text.`;
};

/**
 * Call Groq API for content generation (free alternative to OpenAI)
 */
const callGroqAPI = async (messages) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'mixtral-8x7b-32768', // Groq's fastest model
      messages: messages,
      temperature: 0.7,
      max_tokens: 3000
      // Note: Groq doesn't support response_format parameter, response will be raw text
    });

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };

    const req = https.request(GROQ_API_URL, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(`Groq API Error: ${result.error.message}`));
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(new Error(`Failed to parse Groq response: ${err.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Groq API request failed: ${error.message}`));
    });

    req.write(payload);
    req.end();
  });
};

/**
 * Generate mock content for free testing (no API costs)
 */
const generateMockContent = (profileData) => {
  const { name, role, skills = [], projects = [], goals } = profileData;
  const skillsArray = Array.isArray(skills) ? skills : [];
  const projectsArray = Array.isArray(projects) ? projects : [];

  return {
    about: {
      headline: `${role} passionate about building scalable solutions`,
      paragraphs: [
        `${name} is a dedicated ${role} with a proven track record of delivering high-quality software solutions. With expertise in ${skillsArray.slice(0, 3).join(', ') || 'modern technologies'}, they bring both technical excellence and collaborative spirit to every project.`,
        `Specializing in problem-solving and clean architecture, ${name} is committed to writing maintainable code and mentoring junior developers. They thrive in fast-paced environments where innovation and continuous learning are valued.`,
        goals ? `Currently focused on ${goals.toLowerCase()}, ${name} is actively seeking opportunities to contribute to impactful projects.` : `${name} is eager to take on challenging projects and expand their skillset.`
      ]
    },
    skills: {
      categories: [
        {
          name: 'Core Technologies',
          skills: skillsArray.slice(0, 4).map(skill => ({
            name: skill,
            description: `Proficient in ${skill} with hands-on production experience`
          })) || []
        },
        {
          name: 'Tools & Platforms',
          skills: skillsArray.slice(4).map(skill => ({
            name: skill,
            description: `Experienced using ${skill} in professional projects`
          })) || []
        }
      ]
    },
    projects: projectsArray.filter(p => p.name).map((proj, idx) => ({
      title: proj.name,
      summary: proj.description || `A well-architected project showcasing ${proj.name}`,
      features: proj.features && proj.features.length > 0 ? proj.features : [
        'Responsive design and user-focused interface',
        'Robust backend architecture',
        'Scalable data management'
      ],
      technologies: proj.technologies && proj.technologies.length > 0 ? proj.technologies : ['Modern Tech Stack'],
      link: proj.link || null,
      github: proj.github || null
    })) || [],
    contact: {
      heading: 'Get In Touch',
      message: `${name} is always interested in hearing about new opportunities and exciting projects. Whether you have a question or just want to say hello, feel free to reach out.`,
      cta: goals && goals.includes('freelance') ? 'Hire Me' : 'Contact Me'
    },
    seo: {
      title: `${name} - ${role}`,
      description: `Professional portfolio of ${name}, a talented ${role} specializing in ${skillsArray.slice(0, 2).join(' and ')}. View my projects and experience.`,
      keywords: [...skillsArray.slice(0, 5), role, 'portfolio', 'developer'].filter(Boolean)
    }
  };
};

/**
 * Main function to generate portfolio content using Groq, OpenAI, or mock data
 */
const generateContent = async (profileData) => {
  try {
    // Prefer Groq if API key is available
    if (USE_GROQ) {
      try {
        const systemPrompt = getSystemPrompt();
        const userPrompt = buildUserPrompt(profileData);

        const completion = await callGroqAPI([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]);

        let content = completion.choices[0].message.content;
        
        // Extract JSON from response (Groq might include markdown formatting)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        
        const parsedContent = JSON.parse(content);
        validateGeneratedContent(parsedContent);

        return {
          success: true,
          content: parsedContent,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0
          },
          model: 'mixtral-8x7b-32768 (Groq)'
        };
      } catch (groqError) {
        console.warn('Groq API failed, falling back to mock mode:', groqError.message);
        // Fall back to mock mode if Groq fails
        const mockContent = generateMockContent(profileData);
        validateGeneratedContent(mockContent);
        
        return {
          success: true,
          content: mockContent,
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          },
          model: 'mock-mode (Groq fallback)'
        };
      }
    }

    // Use mock mode if enabled
    if (USE_MOCK_MODE) {
      const mockContent = generateMockContent(profileData);
      validateGeneratedContent(mockContent);
      
      return {
        success: true,
        content: mockContent,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        model: 'mock-mode'
      };
    }

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(profileData);

    let modelUsed = DEFAULT_MODEL;
    let completion;

    try {
      completion = await openai.chat.completions.create({
        model: modelUsed,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      });
    } catch (err) {
      // Retry with fallback model if the primary is unavailable
      if ((err.status === 404 || err.code === 'model_not_found') && modelUsed !== FALLBACK_MODEL) {
        modelUsed = FALLBACK_MODEL;
        completion = await openai.chat.completions.create({
          model: modelUsed,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: "json_object" }
        });
      } else {
        throw err;
      }
    }

    const content = completion.choices[0].message.content;
    
    // Parse and validate JSON
    const parsedContent = JSON.parse(content);
    
    // Basic validation
    validateGeneratedContent(parsedContent);
    
    return {
      success: true,
      content: parsedContent,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      },
      model: modelUsed
    };
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};

/**
 * Validate the structure of generated content
 */
const validateGeneratedContent = (content) => {
  const required = ['about', 'skills', 'projects', 'contact', 'seo'];
  
  for (const field of required) {
    if (!content[field]) {
      throw new Error(`Generated content missing required field: ${field}`);
    }
  }
  
  if (!content.about.headline || !content.about.paragraphs || content.about.paragraphs.length < 2) {
    throw new Error('Invalid about section structure');
  }
  
  if (!content.skills.categories || content.skills.categories.length === 0) {
    throw new Error('Invalid skills section structure');
  }
  
  if (!Array.isArray(content.projects) || content.projects.length === 0) {
    throw new Error('Invalid projects section structure');
  }
  
  if (!content.contact.heading || !content.contact.message || !content.contact.cta) {
    throw new Error('Invalid contact section structure');
  }
  
  if (!content.seo.title || !content.seo.description || !content.seo.keywords) {
    throw new Error('Invalid SEO section structure');
  }
};

module.exports = {
  generateContent,
  getSystemPrompt,
  buildUserPrompt
};
