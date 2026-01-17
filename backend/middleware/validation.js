const Joi = require('joi');

/**
 * Validation schema for profile input
 */
const profileSchema = Joi.object({
  name: Joi.string().required().min(2).max(100)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  
  role: Joi.string().required().min(2).max(100)
    .messages({
      'string.empty': 'Role/title is required',
      'string.min': 'Role must be at least 2 characters'
    }),
  
  experienceLevel: Joi.string()
    .valid('Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal')
    .required()
    .messages({
      'any.only': 'Experience level must be one of: Entry Level, Junior, Mid-Level, Senior, Lead, Principal'
    }),
  
  skills: Joi.array()
    .items(Joi.string().min(1).max(50))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one skill is required'
    }),
  
  projects: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().min(1).max(100),
        description: Joi.string().allow('').max(500),
        technologies: Joi.array().items(Joi.string()).default([]),
        features: Joi.array().items(Joi.string()).default([]),
        link: Joi.string().uri().allow(''),
        github: Joi.string().uri().allow('')
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one project is required'
    }),
  
  goals: Joi.string().allow('').max(500),
  resumeText: Joi.string().allow('').max(5000),
  jobDescription: Joi.string().allow('').max(3000),
  
  email: Joi.string().email().allow(''),
  github: Joi.string().uri().allow(''),
  linkedin: Joi.string().uri().allow(''),
  website: Joi.string().uri().allow('')
});

/**
 * Middleware to validate profile input
 */
const validateProfileInput = (req, res, next) => {
  const { error, value } = profileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateProfileInput,
  profileSchema
};
