const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const premiumController = require('../controllers/premiumController');

/**
 * GET /api/v1/premium/status
 * Premium durumunu kontrol et
 */
router.get('/status', authenticateToken, premiumController.checkPremiumStatus);

/**
 * GET /api/v1/premium/packages
 * Premium paketlerini getir
 */
router.get('/packages', authenticateToken, premiumController.getPremiumPackages);

/**
 * POST /api/v1/premium/purchase
 * Premium satın alma işlemini başlat
 */
router.post('/purchase', authenticateToken, premiumController.purchasePremium);

/**
 * POST /api/v1/premium/verify
 * Purchase verify (RevenueCat webhook)
 */
router.post('/verify', authenticateToken, premiumController.verifyPurchase);

/**
 * POST /api/v1/premium/cancel
 * Aboneliği iptal et
 */
router.post('/cancel', authenticateToken, premiumController.cancelSubscription);

/**
 * GET /api/v1/premium/history
 * Abonelik geçmişini getir
 */
router.get('/history', authenticateToken, premiumController.getSubscriptionHistory);

/**
 * POST /api/v1/premium/restore
 * Restore purchases (iOS)
 */
router.post('/restore', authenticateToken, premiumController.restorePurchases);

module.exports = router;
