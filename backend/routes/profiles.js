const express = require('express');
const router = express.Router();
const {
  saveProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} = require('../controllers/profileController');

// POST /api/profiles - Save a new profile
router.post('/', saveProfile);

// GET /api/profiles - Get all profiles (optional - requires DB)
router.get('/', getProfiles);

// GET /api/profiles/:id - Get specific profile
router.get('/:id', getProfileById);

// PUT /api/profiles/:id - Update profile
router.put('/:id', updateProfile);

// DELETE /api/profiles/:id - Delete profile
router.delete('/:id', deleteProfile);

module.exports = router;
