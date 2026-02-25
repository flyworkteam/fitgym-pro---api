const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuthenticateToken, requirePremium } = require('../middleware/auth');
const workoutController = require('../controllers/workoutController');

/**
 * GET /api/v1/workouts/plans
 * Antrenman planlarını getir
 */
router.get('/plans', authenticateToken, workoutController.getWorkoutPlans);

/**
 * POST /api/v1/workouts/plans
 * Yeni antrenman planı oluştur
 */
router.post('/plans', authenticateToken, workoutController.createWorkoutPlan);

/**
 * PUT /api/v1/workouts/plans/:id
 * Antrenman planını güncelle
 */
router.put('/plans/:id', authenticateToken, workoutController.updateWorkoutPlan);

/**
 * DELETE /api/v1/workouts/plans/:id
 * Antrenman planını sil
 */
router.delete('/plans/:id', authenticateToken, workoutController.deleteWorkoutPlan);

/**
 * GET /api/v1/workouts/categories
 * Kategorilere göre egzersiz sayıları (herkese açık – auth yok, takılma olmaz)
 */
router.get('/categories', workoutController.getCategories);

/**
 * GET /api/v1/workouts/exercises
 * Egzersiz listesini getir (herkese açık – auth yok, takılma olmaz)
 */
router.get('/exercises', workoutController.getExercises);

/**
 * GET /api/v1/workouts/exercises/:id
 * Egzersiz detayını getir
 */
router.get('/exercises/:id', authenticateToken, workoutController.getExerciseDetail);

/**
 * POST /api/v1/workouts/start
 * Antrenmanı başlat
 */
router.post('/start', authenticateToken, workoutController.startWorkout);

/**
 * GET /api/v1/workouts/scheduled
 * Gelecek tarihli planlanan antrenmanları getir (ana sayfa sayaç + takvim)
 */
router.get('/scheduled', authenticateToken, workoutController.getScheduledWorkouts);

/**
 * POST /api/v1/workouts/scheduled
 * Yeni planlanan antrenman ekle (body: title, subtitle?, imageUrl?, scheduledAt: YYYY-MM-DD)
 */
router.post('/scheduled', authenticateToken, workoutController.createScheduledWorkout);

/**
 * POST /api/v1/workouts/record-completed
 * Tamamlanan antrenmanı kaydet (body: durationMinutes, caloriesBurned?, exerciseName?)
 */
router.post('/record-completed', authenticateToken, workoutController.recordCompletedWorkout);

/**
 * POST /api/v1/workouts/:id/complete
 * Antrenmanı tamamla
 */
router.post('/:id/complete', authenticateToken, workoutController.completeWorkout);

/**
 * GET /api/v1/workouts/completed
 * Tamamlanan antrenmanları getir
 */
router.get('/completed', authenticateToken, workoutController.getCompletedWorkouts);

/**
 * GET /api/v1/workouts/progress
 * İlerleme özetini getir
 */
router.get('/progress', authenticateToken, workoutController.getProgressSummary);

/**
 * DELETE /api/v1/workouts/scheduled/:id
 * Planlanan antrenmanı sil
 */
router.delete('/scheduled/:id', authenticateToken, workoutController.deleteScheduledWorkout);

module.exports = router;
