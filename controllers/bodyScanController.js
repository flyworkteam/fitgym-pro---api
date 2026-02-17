const pool = require('../config/database');

/**
 * POST /api/v1/body-scan/upload
 * Vücut analizi için görüntü yükle.
 * Body: multipart/form-data veya JSON (imageUrls, bodyFatPercentage, muscleMass, bodyType, primaryGoal).
 * Görsel dosya yükleme için uygulama önce CDN’e yükleyip URL gönderebilir.
 */
exports.uploadBodyScanImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrls = req.body?.imageUrls || (Array.isArray(req.body?.images) ? req.body.images : []);
    const bodyFatPercentage = req.body?.bodyFatPercentage != null ? Number(req.body.bodyFatPercentage) : null;
    const muscleMass = req.body?.muscleMass != null ? Number(req.body.muscleMass) : null;
    const bodyType = req.body?.bodyType || null;
    const primaryGoal = req.body?.primaryGoal || null;
    const imagesJson = JSON.stringify(imageUrls);
    const analysisData = JSON.stringify({
      bodyFatPercentage,
      muscleMass,
      bodyType,
      primaryGoal,
    });
    const [result] = await pool.execute(
      `INSERT INTO body_scan_results (user_id, body_fat_percentage, muscle_mass, body_type, primary_goal, images, analysis_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, bodyFatPercentage, muscleMass, bodyType, primaryGoal, imagesJson, analysisData]
    );
    res.status(201).json({
      message: 'Vücut analizi kaydedildi.',
      id: result.insertId,
    });
  } catch (error) {
    console.error('uploadBodyScanImages error:', error);
    res.status(500).json({ message: 'Vücut analizi yüklenirken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/body-scan/results/:id?
 * :id yoksa kullanıcının en son sonucu, varsa ilgili kayıt döner.
 */
exports.getBodyScanResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    if (id) {
      const [rows] = await pool.execute(
        `SELECT id, body_fat_percentage, muscle_mass, body_type, primary_goal, images, analysis_data, created_at
         FROM body_scan_results WHERE id = ? AND user_id = ?`,
        [id, userId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Sonuç bulunamadı.' });
      }
      const r = rows[0];
      return res.json({
        id: r.id,
        bodyFatPercentage: r.body_fat_percentage,
        muscleMass: r.muscle_mass,
        bodyType: r.body_type,
        primaryGoal: r.primary_goal,
        images: r.images ? (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) : [],
        analysisData: r.analysis_data ? (typeof r.analysis_data === 'string' ? JSON.parse(r.analysis_data) : r.analysis_data) : null,
        createdAt: r.created_at,
      });
    }
    const [rows] = await pool.execute(
      `SELECT id, body_fat_percentage, muscle_mass, body_type, primary_goal, images, analysis_data, created_at
       FROM body_scan_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if (rows.length === 0) {
      return res.json({ bodyFatPercentage: null, muscleMass: null, bodyType: null, primaryGoal: null });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      bodyFatPercentage: r.body_fat_percentage,
      muscleMass: r.muscle_mass,
      bodyType: r.body_type,
      primaryGoal: r.primary_goal,
      images: r.images ? (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) : [],
      analysisData: r.analysis_data ? (typeof r.analysis_data === 'string' ? JSON.parse(r.analysis_data) : r.analysis_data) : null,
      createdAt: r.created_at,
    });
  } catch (error) {
    console.error('getBodyScanResults error:', error);
    res.status(500).json({ message: 'Sonuçlar alınırken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/body-scan/history
 * Kullanıcının tüm vücut analizi kayıtları.
 */
exports.getBodyScanHistory = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, body_fat_percentage, muscle_mass, body_type, primary_goal, created_at
       FROM body_scan_results WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({
      history: rows.map((r) => ({
        id: r.id,
        bodyFatPercentage: r.body_fat_percentage,
        muscleMass: r.muscle_mass,
        bodyType: r.body_type,
        primaryGoal: r.primary_goal,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('getBodyScanHistory error:', error);
    res.status(500).json({ message: 'Geçmiş alınırken bir hata oluştu.' });
  }
};

/**
 * DELETE /api/v1/body-scan/results/:id
 */
exports.deleteBodyScanResult = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.execute(
      `DELETE FROM body_scan_results WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sonuç bulunamadı.' });
    }
    res.json({ message: 'Kayıt silindi.' });
  } catch (error) {
    console.error('deleteBodyScanResult error:', error);
    res.status(500).json({ message: 'Silinirken bir hata oluştu.' });
  }
};
