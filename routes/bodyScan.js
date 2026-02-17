const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const bodyScanController = require('../controllers/bodyScanController');

/**
 * POST /api/v1/body-scan/upload
 * Vücut analizi için görüntü yükle
 */
router.post('/upload', authenticateToken, bodyScanController.uploadBodyScanImages);

/**
 * GET /api/v1/body-scan/results/:id?
 * Vücut analizi sonuçlarını getir
 */
router.get('/results/:id?', authenticateToken, bodyScanController.getBodyScanResults);

/**
 * GET /api/v1/body-scan/history
 * Vücut analizi geçmişini getir
 */
router.get('/history', authenticateToken, bodyScanController.getBodyScanHistory);

/**
 * DELETE /api/v1/body-scan/results/:id
 * Vücut analizi sonuçlarını sil
 */
router.delete('/results/:id', authenticateToken, bodyScanController.deleteBodyScanResult);

module.exports = router;
