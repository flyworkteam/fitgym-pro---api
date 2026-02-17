const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

/**
 * GET /api/v1/user/profile
 * Kullanıcı profil bilgilerini getir
 */
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * PUT /api/v1/user/profile
 * Kullanıcı profil bilgilerini güncelle
 */
router.put('/profile', authenticateToken, userController.updateProfile);

/**
 * GET /api/v1/user/stats
 * Kullanıcı istatistiklerini getir
 */
router.get('/stats', authenticateToken, userController.getStats);

/**
 * GET /api/v1/user/settings
 * Kullanıcı ayarlarını getir
 */
router.get('/settings', authenticateToken, userController.getSettings);

/**
 * PUT /api/v1/user/settings
 * Kullanıcı ayarlarını güncelle
 */
router.put('/settings', authenticateToken, userController.updateSettings);

/**
 * DELETE /api/v1/user/account
 * Hesabı sil
 */
router.delete('/account', authenticateToken, userController.deleteAccount);

/**
 * GET /api/v1/user/progress-photos
 * Before/After ilerleme fotoğrafları
 */
router.get('/progress-photos', authenticateToken, userController.getProgressPhotos);

/**
 * POST /api/v1/user/progress-photos
 * Body: { type: 'before'|'after', imageUrl: string }
 */
router.post('/progress-photos', authenticateToken, userController.saveProgressPhoto);

/**
 * POST /api/v1/user/upload-progress-photo
 * multipart: type (before|after), photo (file) – galeriden yükleme
 * GET ile açarsanız "Route not found" değil, bu mesaj döner (route'un kayıtlı olduğunu doğrular)
 */
router.get('/upload-progress-photo', authenticateToken, (req, res) => {
  res.status(405).json({ message: 'Bu endpoint sadece POST kabul eder (multipart: type, photo). Uygulama üzerinden görsel yükleyin.' });
});
router.post('/upload-progress-photo', authenticateToken, userController.uploadProgressPhotoMulter, userController.uploadProgressPhoto);

module.exports = router;
