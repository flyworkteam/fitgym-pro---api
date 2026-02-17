const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

/**
 * POST /api/v1/notifications/register
 * Push notification token kaydet
 */
router.post('/register', authenticateToken, notificationController.registerPushToken);

/**
 * DELETE /api/v1/notifications/unregister
 * Push notification token sil
 */
router.delete('/unregister', authenticateToken, notificationController.unregisterPushToken);

/**
 * POST /api/v1/notifications
 * Uygulama içi bildirim oluştur (title, message, type)
 */
router.post('/', authenticateToken, notificationController.createNotification);

/**
 * GET /api/v1/notifications
 * Uygulama içi bildirimleri getir
 */
router.get('/', authenticateToken, notificationController.getNotifications);

/**
 * PUT /api/v1/notifications/:id/read
 * Bildirimi okundu olarak işaretle
 */
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

/**
 * PUT /api/v1/notifications/read-all
 * Tüm bildirimleri okundu olarak işaretle
 */
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);

/**
 * GET /api/v1/notifications/settings
 * Bildirim ayarlarını getir
 */
router.get('/settings', authenticateToken, notificationController.getNotificationSettings);

/**
 * PUT /api/v1/notifications/settings
 * Bildirim ayarlarını güncelle
 */
router.put('/settings', authenticateToken, notificationController.updateNotificationSettings);

/**
 * DELETE /api/v1/notifications/:id
 * Bildirimi sil
 */
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

module.exports = router;
