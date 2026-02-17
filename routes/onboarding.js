const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const onboardingController = require('../controllers/onboardingController');

/**
 * POST /api/v1/onboarding/complete
 * Onboarding verilerini kaydet
 */
router.post('/complete', authenticateToken, [
  body('gender').optional().isIn(['Male', 'Female', 'None']),
  body('dob').optional().isISO8601(),
  body('weight').optional().isString(),
  body('height').optional().isString(),
  body('bodyType').optional().isString(),
  body('goals').optional().isArray(),
  body('focusAreas').optional().isArray(),
  body('trainingFrequency').optional().isString(),
  body('workoutDuration').optional().isString(),
  body('targetWeight').optional().isString(),
  body('fitnessLevel').optional().isString(),
  body('equipment').optional().isArray(),
], onboardingController.completeOnboarding);

/**
 * PUT /api/v1/onboarding/update
 * Onboarding verilerini güncelle
 */
router.put('/update', authenticateToken, onboardingController.updateOnboarding);

/**
 * GET /api/v1/onboarding/status
 * Onboarding durumunu kontrol et
 */
router.get('/status', authenticateToken, onboardingController.getOnboardingStatus);

/**
 * GET /api/v1/onboarding/data
 * Onboarding verilerini getir
 */
router.get('/data', authenticateToken, onboardingController.getOnboardingData);

module.exports = router;
