const { generateContent } = require('../services/contentGenerator');
const Profile = require('../models/Profile');
const mongoose = require('mongoose');

/**
 * POST /api/generate
 * Generate portfolio content from user profile data
 */
const generatePortfolioContent = async (req, res, next) => {
  try {
    const profileData = req.body;

    // Generate content using OpenAI
    const result = await generateContent(profileData);

    // Optionally save to database if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const profile = new Profile({
          inputData: profileData,
          generatedContent: result.content,
          metadata: {
            model: result.model || process.env.OPENAI_MODEL,
            tokensUsed: result.usage.totalTokens
          }
        });
        await profile.save();
        result.profileId = profile._id;
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue even if DB save fails
      }
    }

    res.json({
      success: true,
      data: result.content,
      usage: result.usage,
      ...(result.profileId && { profileId: result.profileId })
    });

  } catch (error) {
    console.error('Generation error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        error: 'OpenAI API quota exceeded. Please check your API key and billing.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        error: 'Invalid OpenAI API key. Please check your configuration.'
      });
    }

    if (error.code === 'model_not_found' || error.status === 404) {
      return res.status(400).json({
        success: false,
        error: 'The specified OpenAI model is unavailable. Defaulting to gpt-4o-mini. Update OPENAI_MODEL or retry.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate portfolio content'
    });
  }
};

module.exports = {
  generatePortfolioContent
};
