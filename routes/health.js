const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const healthController = require('../controllers/healthController');

/**
 * POST /api/v1/health/sync
 * Health verilerini senkronize et
 */
router.post('/sync', authenticateToken, healthController.syncHealthData);

/**
 * GET /api/v1/health/data
 * Health verilerini getir
 */
router.get('/data', authenticateToken, healthController.getHealthData);

/**
 * GET /api/v1/health/today-summary
 * Ana sayfa için bugünkü özet (uyku, kalp, adım, kalori, egzersiz dk)
 */
router.get('/today-summary', authenticateToken, healthController.getTodaySummary);

/**
 * GET /api/v1/health/averages?days=7
 * Son X gün ortalama kalori (Apple/Health veya antrenman), adım, egzersiz dk
 */
router.get('/averages', authenticateToken, healthController.getAverages);

/**
 * GET /api/v1/health/permissions
 * Health izinlerini kontrol et
 */
router.get('/permissions', authenticateToken, healthController.checkHealthPermissions);

/**
 * PUT /api/v1/health/permissions
 * Health izinlerini güncelle
 */
router.put('/permissions', authenticateToken, healthController.updateHealthPermissions);

module.exports = router;
