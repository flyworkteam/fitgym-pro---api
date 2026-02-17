const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname || '').split('.').pop() || 'jpg';
    const safe = (req.user && req.user.id) ? req.user.id : 'user';
    const name = `${safe}_${Date.now()}.${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * GET /api/v1/user/profile
 */
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, name, photo_url, auth_provider, is_premium, premium_expires_at, onboarding_completed, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photo_url,
      authProvider: user.auth_provider,
      isPremium: !!user.is_premium,
      premiumExpiresAt: user.premium_expires_at,
      onboardingCompleted: !!user.onboarding_completed,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/v1/user/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, photoUrl } = req.body;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (photoUrl !== undefined) {
      updates.push('photo_url = ?');
      values.push(photoUrl);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.user.id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await pool.execute(
      'SELECT id, email, name, photo_url, is_premium, onboarding_completed FROM users WHERE id = ?',
      [req.user.id]
    );
    const user = rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photo_url,
      isPremium: !!user.is_premium,
      onboardingCompleted: !!user.onboarding_completed,
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/v1/user/stats
 */
const getStats = async (req, res) => {
  try {
    const [sessions] = await pool.execute(
      'SELECT COUNT(*) as total, COALESCE(SUM(duration), 0) as totalMinutes FROM workout_sessions WHERE user_id = ? AND completed_at IS NOT NULL',
      [req.user.id]
    );
    const [calories] = await pool.execute(
      'SELECT COALESCE(SUM(calories_burned), 0) as total FROM workout_sessions WHERE user_id = ?',
      [req.user.id]
    );
    res.json({
      totalWorkouts: sessions[0]?.total || 0,
      totalMinutes: sessions[0]?.totalMinutes || 0,
      totalCaloriesBurned: calories[0]?.total || 0,
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/v1/user/settings
 */
const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.json({
        notificationsEnabled: true,
        pushNotificationsEnabled: true,
        healthSyncEnabled: true,
        language: 'en',
        units: 'metric',
      });
    }
    const s = rows[0];
    res.json({
      notificationsEnabled: !!s.notifications_enabled,
      pushNotificationsEnabled: !!s.push_notifications_enabled,
      healthSyncEnabled: !!s.health_sync_enabled,
      language: s.language || 'en',
      units: s.units || 'metric',
    });
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/v1/user/settings
 */
const updateSettings = async (req, res) => {
  try {
    const { notificationsEnabled, pushNotificationsEnabled, healthSyncEnabled, language, units } = req.body;

    const [existing] = await pool.execute('SELECT id FROM user_settings WHERE user_id = ?', [req.user.id]);

    if (existing.length === 0) {
      await pool.execute(
        `INSERT INTO user_settings (user_id, notifications_enabled, push_notifications_enabled, health_sync_enabled, language, units) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          notificationsEnabled !== false ? 1 : 0,
          pushNotificationsEnabled !== false ? 1 : 0,
          healthSyncEnabled !== false ? 1 : 0,
          language || 'en',
          units || 'metric',
        ]
      );
    } else {
      const updates = [];
      const values = [];
      if (notificationsEnabled !== undefined) {
        updates.push('notifications_enabled = ?');
        values.push(notificationsEnabled ? 1 : 0);
      }
      if (pushNotificationsEnabled !== undefined) {
        updates.push('push_notifications_enabled = ?');
        values.push(pushNotificationsEnabled ? 1 : 0);
      }
      if (healthSyncEnabled !== undefined) {
        updates.push('health_sync_enabled = ?');
        values.push(healthSyncEnabled ? 1 : 0);
      }
      if (language !== undefined) {
        updates.push('language = ?');
        values.push(language);
      }
      if (units !== undefined) {
        updates.push('units = ?');
        values.push(units);
      }
      if (updates.length > 0) {
        values.push(req.user.id);
        await pool.execute(`UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`, values);
      }
    }

    const [rows] = await pool.execute('SELECT * FROM user_settings WHERE user_id = ?', [req.user.id]);
    const s = rows[0] || {};
    res.json({
      notificationsEnabled: !!s.notifications_enabled,
      pushNotificationsEnabled: !!s.push_notifications_enabled,
      healthSyncEnabled: !!s.health_sync_enabled,
      language: s.language || 'en',
      units: s.units || 'metric',
    });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/v1/user/account (soft delete)
 */
const deleteAccount = async (req, res) => {
  try {
    await pool.execute('UPDATE users SET is_active = 0 WHERE id = ?', [req.user.id]);
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/v1/user/progress-photos
 * Before/After fotoğraf URL'lerini getir
 */
const getProgressPhotos = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT type, image_url FROM user_progress_photos WHERE user_id = ?',
      [req.user.id]
    );
    const before = rows.find(r => r.type === 'before');
    const after = rows.find(r => r.type === 'after');
    res.json({
      beforeUrl: before ? before.image_url : null,
      afterUrl: after ? after.image_url : null,
    });
  } catch (error) {
    console.error('getProgressPhotos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/v1/user/progress-photos
 * Body: { type: 'before'|'after', imageUrl: string }
 */
const saveProgressPhoto = async (req, res) => {
  try {
    const { type, imageUrl } = req.body || {};
    if (!type || !imageUrl || !['before', 'after'].includes(type)) {
      return res.status(400).json({ message: 'type (before|after) ve imageUrl gerekli.' });
    }
    const url = String(imageUrl).trim().slice(0, 500);
    await pool.execute(
      `INSERT INTO user_progress_photos (user_id, type, image_url)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)`,
      [req.user.id, type, url]
    );
    const [rows] = await pool.execute(
      'SELECT type, image_url FROM user_progress_photos WHERE user_id = ?',
      [req.user.id]
    );
    const before = rows.find(r => r.type === 'before');
    const after = rows.find(r => r.type === 'after');
    res.json({
      beforeUrl: before ? before.image_url : null,
      afterUrl: after ? after.image_url : null,
    });
  } catch (error) {
    console.error('saveProgressPhoto error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/v1/user/upload-progress-photo
 * multipart: type (before|after), photo (file)
 */
const uploadProgressPhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: 'photo dosyası gerekli.' });
    }
    const type = (req.body && req.body.type) || 'photo';
    if (!['before', 'after'].includes(type)) {
      return res.status(400).json({ message: 'type: before veya after olmalı.' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    await pool.execute(
      `INSERT INTO user_progress_photos (user_id, type, image_url)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)`,
      [req.user.id, type, url]
    );
    res.json({ url, message: 'Yüklendi.' });
  } catch (error) {
    console.error('uploadProgressPhoto error:', error);
    res.status(500).json({ message: 'Yükleme hatası.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats,
  getSettings,
  updateSettings,
  deleteAccount,
  getProgressPhotos,
  saveProgressPhoto,
  uploadProgressPhoto,
  uploadProgressPhotoMulter: upload.single('photo'),
};
