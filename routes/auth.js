const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

/**
 * POST /api/v1/auth/signup
 * Email/Password ile kayıt
 */
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim(),
], authController.signUp);

/**
 * POST /api/v1/auth/signin
 * Email/Password ile giriş
 */
router.post('/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], authController.signIn);

/**
 * POST /api/v1/auth/google
 * Google ile giriş
 */
router.post('/google', [
  body('idToken').notEmpty(),
  body('accessToken').notEmpty(),
], authController.signInWithGoogle);

/**
 * POST /api/v1/auth/apple
 * Apple ile giriş
 */
router.post('/apple', [
  body('identityToken').notEmpty(),
  body('authorizationCode').notEmpty(),
], authController.signInWithApple);

/**
 * POST /api/v1/auth/facebook
 * Facebook ile giriş
 */
router.post('/facebook', [
  body('accessToken').notEmpty(),
], authController.signInWithFacebook);

/**
 * POST /api/v1/auth/anonymous
 * Anonymous giriş
 */
router.post('/anonymous', authController.signInAnonymously);

/**
 * POST /api/v1/auth/refresh
 * Token yenileme
 */
router.post('/refresh', [
  body('refreshToken').notEmpty(),
], authController.refreshToken);

/**
 * POST /api/v1/auth/signout
 * Çıkış yap
 */
router.post('/signout', authenticateToken, authController.signOut);

/**
 * GET /api/v1/auth/verify
 * Token doğrulama
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: { id: req.user.id, email: req.user.email } 
  });
});

module.exports = router;
