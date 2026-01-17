const Profile = require('../models/Profile');
const mongoose = require('mongoose');

/**
 * POST /api/profiles
 * Save a new profile
 */
const saveProfile = async (req, res) => {
  // Check if DB is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected. Profile storage is unavailable.'
    });
  }

  try {
    const profile = new Profile(req.body);
    await profile.save();
    
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET /api/profiles
 * Get all profiles
 */
const getProfiles = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected.'
    });
  }

  try {
    const { limit = 50, page = 1, sort = '-createdAt' } = req.query;
    
    const profiles = await Profile.find()
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');
    
    const total = await Profile.countDocuments();
    
    res.json({
      success: true,
      data: profiles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET /api/profiles/:id
 * Get specific profile by ID
 */
const getProfileById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected.'
    });
  }

  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * PUT /api/profiles/:id
 * Update profile
 */
const updateProfile = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected.'
    });
  }

  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        version: { $inc: 1 }
      },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * DELETE /api/profiles/:id
 * Delete profile
 */
const deleteProfile = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected.'
    });
  }

  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  saveProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
};
