const pool = require('../config/database');

// GET /workouts/plans
exports.getWorkoutPlans = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, type, description, is_active, created_at FROM workout_plans 
       WHERE user_id = ? ORDER BY updated_at DESC`,
      [req.user.id]
    );
    res.json({
      plans: rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        description: r.description,
        isActive: !!r.is_active,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('getWorkoutPlans error:', error);
    res.status(500).json({ message: 'Antrenman planları alınırken bir hata oluştu.' });
  }
};

// POST /workouts/plans
// Yeni antrenman planı oluşturur
exports.createWorkoutPlan = async (req, res) => {
  try {
    // TODO: Gönderilen body'den plan ve egzersizleri oluştur
    res.status(201).json({ message: 'Antrenman planı oluşturma özelliği henüz tamamlanmadı.' });
  } catch (error) {
    console.error('createWorkoutPlan error:', error);
    res.status(500).json({ message: 'Antrenman planı oluşturulurken bir hata oluştu.' });
  }
};

// PUT /workouts/plans/:id
exports.updateWorkoutPlan = async (req, res) => {
  try {
    // TODO: İlgili planı güncelle
    res.json({ message: 'Antrenman planı güncelleme özelliği henüz tamamlanmadı.' });
  } catch (error) {
    console.error('updateWorkoutPlan error:', error);
    res.status(500).json({ message: 'Antrenman planı güncellenirken bir hata oluştu.' });
  }
};

// DELETE /workouts/plans/:id
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    // TODO: Planı sil
    res.json({ message: 'Antrenman planı silme özelliği henüz tamamlanmadı.' });
  } catch (error) {
    console.error('deleteWorkoutPlan error:', error);
    res.status(500).json({ message: 'Antrenman planı silinirken bir hata oluştu.' });
  }
};

// GET /workouts/exercises?category=&muscleGroup=&sort=popular
exports.getExercises = async (req, res) => {
  try {
    const { category, muscleGroup, sort } = req.query;
    let sql = `
      SELECT e.id, e.name, e.description, e.category, e.muscle_group, e.video_url, e.image_url,
             e.instructions, e.difficulty, e.equipment_needed,
             (SELECT COUNT(*) FROM workout_session_exercises wse WHERE wse.exercise_id = e.id) AS usage_count
      FROM exercises e WHERE 1=1`;
    const params = [];
    if (category) {
      sql += ' AND e.category = ?';
      params.push(category);
    }
    if (muscleGroup) {
      sql += ' AND e.muscle_group = ?';
      params.push(muscleGroup);
    }
    sql += sort === 'popular' ? ' ORDER BY usage_count DESC, e.id ASC' : ' ORDER BY e.category, e.name';
    sql += ' LIMIT 100';
    const [rows] = await pool.execute(sql, params);
    res.json({
      exercises: rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        muscleGroup: r.muscle_group,
        videoUrl: r.video_url,
        imageUrl: r.image_url,
        instructions: r.instructions,
        difficulty: r.difficulty,
        equipmentNeeded: r.equipment_needed ? (typeof r.equipment_needed === 'string' ? JSON.parse(r.equipment_needed) : r.equipment_needed) : null,
        usageCount: Number(r.usage_count) || 0,
      })),
    });
  } catch (error) {
    console.error('getExercises error:', error);
    res.status(500).json({ message: 'Egzersizler alınırken bir hata oluştu.' });
  }
};

// GET /workouts/categories
// Kategorilere göre egzersiz sayıları (Popular Workouts kartları için)
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT category, COUNT(*) as count FROM exercises WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY count DESC`
    );
    res.json({
      categories: rows.map((r) => ({ category: r.category, exerciseCount: r.count })),
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ message: 'Kategoriler alınırken bir hata oluştu.' });
  }
};

// GET /workouts/exercises/:id
exports.getExerciseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id, name, description, category, muscle_group, video_url, image_url, instructions, difficulty, equipment_needed 
       FROM exercises WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Egzersiz bulunamadı.' });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      muscleGroup: r.muscle_group,
      videoUrl: r.video_url,
      imageUrl: r.image_url,
      instructions: r.instructions,
      difficulty: r.difficulty,
      equipmentNeeded: r.equipment_needed ? (typeof r.equipment_needed === 'string' ? JSON.parse(r.equipment_needed) : r.equipment_needed) : null,
    });
  } catch (error) {
    console.error('getExerciseDetail error:', error);
    res.status(500).json({ message: 'Egzersiz detayı alınırken bir hata oluştu.' });
  }
};

// POST /workouts/start
exports.startWorkout = async (req, res) => {
  try {
    // TODO: workout_sessions tablosunda yeni bir kayıt oluştur
    res.status(201).json({ message: 'Antrenman başlatma özelliği henüz tamamlanmadı.' });
  } catch (error) {
    console.error('startWorkout error:', error);
    res.status(500).json({ message: 'Antrenman başlatılırken bir hata oluştu.' });
  }
};

// POST /workouts/record-completed – uygulama içi tamamlanan antrenmanı kaydet
exports.recordCompletedWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { durationMinutes, caloriesBurned, exerciseName } = req.body || {};
    const duration = durationMinutes != null ? parseInt(durationMinutes, 10) : 0;
    const now = new Date();
    const [result] = await pool.execute(
      `INSERT INTO workout_sessions (user_id, started_at, completed_at, duration, calories_burned, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        now,
        now,
        Math.max(0, duration),
        caloriesBurned != null ? parseInt(caloriesBurned, 10) : null,
        exerciseName ? String(exerciseName).slice(0, 500) : null,
      ]
    );
    res.status(201).json({
      id: result.insertId,
      message: 'Antrenman kaydedildi.',
      durationMinutes: Math.max(0, duration),
      caloriesBurned: caloriesBurned != null ? parseInt(caloriesBurned, 10) : null,
    });
  } catch (error) {
    console.error('recordCompletedWorkout error:', error);
    res.status(500).json({ message: 'Antrenman kaydedilirken bir hata oluştu.' });
  }
};

// POST /workouts/:id/complete
exports.completeWorkout = async (req, res) => {
  try {
    // TODO: ilgili workout_session kaydını tamamlandı olarak işaretle
    const { id } = req.params;
    res.json({
      id,
      message: 'Antrenman tamamlama özelliği henüz tamamlanmadı.',
    });
  } catch (error) {
    console.error('completeWorkout error:', error);
    res.status(500).json({ message: 'Antrenman tamamlanırken bir hata oluştu.' });
  }
};

// GET /workouts/completed
exports.getCompletedWorkouts = async (req, res) => {
  try {
    // TODO: workout_sessions ve workout_plans üzerinden tamamlanan antrenmanları getir
    res.json({ workouts: [] });
  } catch (error) {
    console.error('getCompletedWorkouts error:', error);
    res.status(500).json({ message: 'Tamamlanan antrenmanlar alınırken bir hata oluştu.' });
  }
};

// GET /workouts/progress
exports.getProgressSummary = async (req, res) => {
  try {
    // TODO: Kullanıcının ilerleme özetini (toplam süre, kalori vs.) hesapla
    res.json({
      summary: {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
      },
    });
  } catch (error) {
    console.error('getProgressSummary error:', error);
    res.status(500).json({ message: 'İlerleme özeti alınırken bir hata oluştu.' });
  }
};

// GET /workouts/scheduled – gelecek tarihli planlanan antrenmanlar (ana sayfa sayaç + takvim)
exports.getScheduledWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.execute(
      `SELECT id, title, subtitle, image_url, scheduled_at, reminder_time, created_at 
       FROM scheduled_workouts 
       WHERE user_id = ? AND scheduled_at >= ? 
       ORDER BY created_at DESC, scheduled_at ASC`,
      [userId, today]
    );
    res.json({
      scheduled: rows.map((r) => ({
        id: r.id,
        title: r.title || '',
        subtitle: r.subtitle || '',
        imageUrl: r.image_url || null,
        scheduledAt: r.scheduled_at,
        reminderTime: r.reminder_time != null ? String(r.reminder_time).slice(0, 5) : null,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('getScheduledWorkouts error:', error);
    res.status(500).json({ message: 'Planlanan antrenmanlar alınırken bir hata oluştu.' });
  }
};

// POST /workouts/scheduled – yeni planlanan antrenman ekle
exports.createScheduledWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, subtitle, imageUrl, scheduledAt, reminderTime } = req.body || {};
    if (!title || !scheduledAt) {
      return res.status(400).json({ message: 'title ve scheduledAt (YYYY-MM-DD) gerekli.' });
    }
    const dateStr = String(scheduledAt).slice(0, 10);
    const reminderTimeVal = reminderTime && /^\d{1,2}:\d{2}$/.test(String(reminderTime).trim())
      ? String(reminderTime).trim()
      : null;
    const [result] = await pool.execute(
      `INSERT INTO scheduled_workouts (user_id, title, subtitle, image_url, scheduled_at, reminder_time) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, String(title), subtitle ? String(subtitle) : null, imageUrl ? String(imageUrl) : null, dateStr, reminderTimeVal]
    );
    res.status(201).json({
      id: result.insertId,
      title: String(title),
      subtitle: subtitle ? String(subtitle) : null,
      imageUrl: imageUrl ? String(imageUrl) : null,
      scheduledAt: dateStr,
      reminderTime: reminderTimeVal,
    });
  } catch (error) {
    console.error('createScheduledWorkout error:', error);
    const msg = process.env.NODE_ENV === 'development' && error.message
      ? `Planlanan antrenman eklenirken bir hata oluştu: ${error.message}`
      : 'Planlanan antrenman eklenirken bir hata oluştu. Veritabanında scheduled_workouts tablosu var mı? backend/database/KURULUM.md dosyasına bakın.';
    res.status(500).json({ message: msg });
  }
};

// DELETE /workouts/scheduled/:id
exports.deleteScheduledWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ message: 'Geçersiz id.' });
    }
    const [result] = await pool.execute(
      'DELETE FROM scheduled_workouts WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Planlanan antrenman bulunamadı.' });
    }
    res.json({ message: 'Silindi.', id });
  } catch (error) {
    console.error('deleteScheduledWorkout error:', error);
    res.status(500).json({ message: 'Planlanan antrenman silinirken bir hata oluştu.' });
  }
};

