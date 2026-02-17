const pool = require('../config/database');

const VALID_TYPES = ['steps', 'heartRate', 'sleep', 'calories', 'distance'];
const VALID_SOURCES = ['ios_health', 'android_health', 'app'];

/**
 * POST /api/v1/health/sync
 * Health verilerini senkronize et (health_data tablosuna yazar)
 */
exports.syncHealthData = async (req, res) => {
  try {
    const { platform, data } = req.body || {};
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Geçerli bir data dizisi gönderin.' });
    }
    const source = platform === 'ios' ? 'ios_health' : platform === 'android' ? 'android_health' : 'app';
    let inserted = 0;
    for (const item of data) {
      const type = (item.type || '').toLowerCase();
      if (!VALID_TYPES.includes(type)) continue;
      const value = item.value != null ? Number(item.value) : null;
      const date = item.date || new Date().toISOString().slice(0, 10);
      const unit = item.unit || null;
      await pool.execute(
        `INSERT INTO health_data (user_id, type, value, unit, date, source) VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, type, value, unit, date, source]
      );
      inserted++;
    }
    res.status(201).json({ message: 'Veriler senkronize edildi.', synced: inserted });
  } catch (error) {
    console.error('syncHealthData error:', error);
    res.status(500).json({ message: 'Health verileri senkronize edilirken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/health/data
 * Health verilerini getir (startDate, endDate, type query ile filtre)
 */
exports.getHealthData = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const userId = req.user.id;
    let sql = `SELECT id, type, value, unit, date, source, created_at FROM health_data WHERE user_id = ?`;
    const params = [userId];
    if (startDate) {
      sql += ` AND date >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND date <= ?`;
      params.push(endDate);
    }
    if (type && VALID_TYPES.includes(String(type).toLowerCase())) {
      sql += ` AND type = ?`;
      params.push(String(type).toLowerCase());
    }
    sql += ` ORDER BY date DESC, created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    res.json({
      data: rows.map((r) => ({
        id: r.id,
        type: r.type,
        value: r.value,
        unit: r.unit,
        date: r.date,
        source: r.source,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('getHealthData error:', error);
    res.status(500).json({ message: 'Health verileri alınırken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/health/today-summary
 * Ana sayfa için bugünkü özet: uyku, kalp atışı, adım, kalori, egzersiz süresi
 */
exports.getTodaySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    // İsteğe bağlı date=YYYY-MM-DD (uygulama kullanıcı yerel tarihini gönderir, timezone uyumu için)
    const dateParam = req.query && req.query.date && /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date).trim())
      ? String(req.query.date).trim()
      : null;
    const today = dateParam || new Date().toISOString().slice(0, 10);

    const [healthRows] = await pool.execute(
      `SELECT type, SUM(value) as total, AVG(value) as avg_val FROM health_data 
       WHERE user_id = ? AND date = ? GROUP BY type`,
      [userId, today]
    );

    const summary = {
      sleepHours: 0,
      heartRate: 0,
      steps: 0,
      calories: 0,
      exerciseMinutes: 0,
      completedWorkouts: 0,
    };
    for (const r of healthRows) {
      if (r.type === 'sleep') summary.sleepHours = Number(r.total) || 0;
      else if (r.type === 'heartRate') summary.heartRate = Math.round(Number(r.avg_val) || 0);
      else if (r.type === 'steps') summary.steps = Math.round(Number(r.total) || 0);
      else if (r.type === 'calories') summary.calories = Math.round(Number(r.total) || 0);
      else if (r.type === 'distance') summary.exerciseMinutes = Math.round(Number(r.total) || 0);
    }

    // Bugünkü antrenman: duration dakika, kalori, tamamlanan sayısı (workout_sessions)
    const [sessionRows] = await pool.execute(
      `SELECT COALESCE(SUM(duration), 0) as total_min, COALESCE(SUM(calories_burned), 0) as total_cal, COUNT(*) as completed_count 
       FROM workout_sessions 
       WHERE user_id = ? AND DATE(started_at) = ?`,
      [userId, today]
    );
    if (sessionRows[0]) {
      const totalMin = Number(sessionRows[0].total_min) || 0;
      const totalCal = Number(sessionRows[0].total_cal) || 0;
      const completedCount = Number(sessionRows[0].completed_count) || 0;
      if (totalMin > 0) summary.exerciseMinutes = totalMin;
      if (totalCal > 0) summary.calories = (summary.calories || 0) + totalCal;
      summary.completedWorkouts = completedCount;
    } else {
      summary.completedWorkouts = 0;
    }

    res.json({ summary });
  } catch (error) {
    console.error('getTodaySummary error:', error);
    res.status(500).json({ message: 'Özet alınırken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/health/averages?days=7
 * Son X gün için ortalama: kalori (Apple/Android Health varsa ondan, yoksa uygulama antrenmanlarından),
 * adım ve egzersiz süresi ortalamaları.
 */
exports.getAverages = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = Math.min(90, Math.max(1, parseInt(req.query.days, 10) || 7));
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (days - 1));
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    const averages = {
      averageCalories: 0,
      averageSteps: 0,
      averageExerciseMinutes: 0,
    };

    // Kalori: Önce Apple/Android Health'tan (health_data calories, ios_health/android_health)
    const [healthCalRows] = await pool.execute(
      `SELECT SUM(value) as total, COUNT(DISTINCT date) as day_count FROM health_data
       WHERE user_id = ? AND type = 'calories' AND source IN ('ios_health', 'android_health') AND date >= ? AND date <= ?`,
      [userId, startStr, endStr]
    );
    const healthCalTotal = Number(healthCalRows[0]?.total || 0);
    const healthCalDays = Number(healthCalRows[0]?.day_count || 0);

    if (healthCalDays > 0 && healthCalTotal > 0) {
      averages.averageCalories = Math.round(healthCalTotal / days);
    } else {
      // Uygulama antrenmanlarından: workout_sessions.calories_burned
      const [workoutCalRows] = await pool.execute(
        `SELECT COALESCE(SUM(calories_burned), 0) as total FROM workout_sessions
         WHERE user_id = ? AND DATE(started_at) >= ? AND DATE(started_at) <= ? AND calories_burned IS NOT NULL`,
        [userId, startStr, endStr]
      );
      const workoutTotal = Number(workoutCalRows[0]?.total || 0);
      if (days > 0) averages.averageCalories = Math.round(workoutTotal / days);
    }

    // Adım ortalaması: health_data steps
    const [stepsRows] = await pool.execute(
      `SELECT COALESCE(SUM(value), 0) as total FROM health_data
       WHERE user_id = ? AND type = 'steps' AND date >= ? AND date <= ?`,
      [userId, startStr, endStr]
    );
    const stepsTotal = Number(stepsRows[0]?.total || 0);
    if (days > 0) averages.averageSteps = Math.round(stepsTotal / days);

    // Egzersiz süresi ortalaması: health_data (distance→dk) veya workout_sessions duration
    const [exHealthRows] = await pool.execute(
      `SELECT COALESCE(SUM(value), 0) as total FROM health_data
       WHERE user_id = ? AND type = 'distance' AND date >= ? AND date <= ?`,
      [userId, startStr, endStr]
    );
    let exerciseTotalMin = Number(exHealthRows[0]?.total || 0);
    if (exerciseTotalMin <= 0) {
      const [exSessionRows] = await pool.execute(
        `SELECT COALESCE(SUM(duration), 0) as total_sec FROM workout_sessions
         WHERE user_id = ? AND DATE(started_at) >= ? AND DATE(started_at) <= ? AND duration IS NOT NULL`,
        [userId, startStr, endStr]
      );
      exerciseTotalMin = Math.round(Number(exSessionRows[0]?.total_sec || 0) / 60);
    }
    if (days > 0) averages.averageExerciseMinutes = Math.round(exerciseTotalMin / days);

    res.json({ averages, days });
  } catch (error) {
    console.error('getAverages error:', error);
    res.status(500).json({ message: 'Ortalamalar alınırken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/health/permissions
 * Health izinlerini kontrol et (şimdilik stub)
 */
exports.checkHealthPermissions = async (req, res) => {
  try {
    res.json({
      steps: false,
      heartRate: false,
      sleep: false,
      calories: false,
      distance: false,
    });
  } catch (error) {
    console.error('checkHealthPermissions error:', error);
    res.status(500).json({ message: 'İzinler alınırken bir hata oluştu.' });
  }
};

/**
 * PUT /api/v1/health/permissions
 * Health izinlerini güncelle (şimdilik stub – izinler cihazda yönetilir)
 */
exports.updateHealthPermissions = async (req, res) => {
  try {
    res.json({ message: 'İzinler cihaz ayarlarından yönetilir.' });
  } catch (error) {
    console.error('updateHealthPermissions error:', error);
    res.status(500).json({ message: 'İzinler güncellenirken bir hata oluştu.' });
  }
};
