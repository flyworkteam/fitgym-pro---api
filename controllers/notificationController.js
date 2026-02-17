const pool = require('../config/database');
const onesignalService = require('../services/onesignalService');

/**
 * Push notification token kaydet
 */
const registerPushToken = async (req, res) => {
  try {
    const { pushToken, platform } = req.body;
    const userId = req.user.id;

    // Token'ı veritabanına kaydet
    const [existing] = await pool.execute(
      'SELECT id FROM push_tokens WHERE user_id = ? AND token = ?',
      [userId, pushToken]
    );

    if (existing.length > 0) {
      // Güncelle
      await pool.execute(
        'UPDATE push_tokens SET platform = ?, is_active = 1, updated_at = NOW() WHERE id = ?',
        [platform, existing[0].id]
      );
    } else {
      // Yeni kayıt
      await pool.execute(
        'INSERT INTO push_tokens (user_id, token, platform, is_active) VALUES (?, ?, ?, 1)',
        [userId, pushToken, platform]
      );
    }

    // OneSignal'e user tag ekle
    try {
      await onesignalService.addUserTag(pushToken, userId.toString());
    } catch (error) {
      console.error('OneSignal tag add error:', error);
    }

    res.json({ message: 'Push token registered successfully' });
  } catch (error) {
    console.error('Register push token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Push notification token sil
 */
const unregisterPushToken = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'UPDATE push_tokens SET is_active = 0 WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Push token unregistered successfully' });
  } catch (error) {
    console.error('Unregister push token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Uygulama içi bildirim oluştur (örn. antrenman hatırlatması)
 */
const createNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, message, type } = req.body || {};
    if (!title || !message) {
      return res.status(400).json({ message: 'title ve message gerekli.' });
    }
    await pool.execute(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [userId, String(title).slice(0, 255), String(message), type ? String(type).slice(0, 100) : null]
    );
    res.status(201).json({ message: 'Bildirim oluşturuldu.' });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Uygulama içi bildirimleri getir
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];

    if (unreadOnly) {
      query += ' AND is_read = 0';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [notifications] = await pool.execute(query, params);

    res.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.is_read === 1,
        createdAt: n.created_at,
      })),
      total: notifications.length,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bildirimi okundu olarak işaretle
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Tüm bildirimleri okundu olarak işaretle
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bildirim ayarlarını getir
 */
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [settings] = await pool.execute(
      'SELECT notifications_enabled, push_notifications_enabled FROM user_settings WHERE user_id = ?',
      [userId]
    );

    if (settings.length === 0) {
      return res.json({
        notificationsEnabled: true,
        pushNotificationsEnabled: true,
      });
    }

    res.json({
      notificationsEnabled: settings[0].notifications_enabled === 1,
      pushNotificationsEnabled: settings[0].push_notifications_enabled === 1,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bildirim ayarlarını güncelle
 */
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationsEnabled, pushNotificationsEnabled } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE user_settings SET notifications_enabled = ?, push_notifications_enabled = ? WHERE user_id = ?',
        [
          notificationsEnabled ? 1 : 0,
          pushNotificationsEnabled ? 1 : 0,
          userId,
        ]
      );
    } else {
      await pool.execute(
        'INSERT INTO user_settings (user_id, notifications_enabled, push_notifications_enabled) VALUES (?, ?, ?)',
        [
          userId,
          notificationsEnabled ? 1 : 0,
          pushNotificationsEnabled ? 1 : 0,
        ]
      );
    }

    res.json({ message: 'Notification settings updated' });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bildirimi sil
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerPushToken,
  unregisterPushToken,
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  deleteNotification,
};
