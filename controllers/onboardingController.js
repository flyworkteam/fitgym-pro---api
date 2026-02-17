const pool = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Onboarding verilerini kaydet
 */
const completeOnboarding = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const {
      gender,
      dob,
      weight,
      height,
      bodyType,
      goals,
      focusAreas,
      trainingFrequency,
      workoutDuration,
      targetWeight,
      fitnessLevel,
      equipment,
    } = req.body;

    // Onboarding verilerini kaydet veya güncelle
    const [existing] = await pool.execute(
      'SELECT id FROM user_onboarding WHERE user_id = ?',
      [userId]
    );

    const onboardingData = {
      gender: gender || null,
      dob: dob || null,
      weight: weight || null,
      height: height || null,
      body_type: bodyType || null,
      goals: goals ? JSON.stringify(goals) : null,
      focus_areas: focusAreas ? JSON.stringify(focusAreas) : null,
      training_frequency: trainingFrequency || null,
      workout_duration: workoutDuration || null,
      target_weight: targetWeight || null,
      fitness_level: fitnessLevel || null,
      equipment: equipment ? JSON.stringify(equipment) : null,
      completed_at: new Date(),
    };

    if (existing.length > 0) {
      // Güncelle
      await pool.execute(
        `UPDATE user_onboarding SET 
          gender = ?, dob = ?, weight = ?, height = ?, body_type = ?,
          goals = ?, focus_areas = ?, training_frequency = ?, workout_duration = ?,
          target_weight = ?, fitness_level = ?, equipment = ?, completed_at = ?
        WHERE user_id = ?`,
        [
          onboardingData.gender,
          onboardingData.dob,
          onboardingData.weight,
          onboardingData.height,
          onboardingData.body_type,
          onboardingData.goals,
          onboardingData.focus_areas,
          onboardingData.training_frequency,
          onboardingData.workout_duration,
          onboardingData.target_weight,
          onboardingData.fitness_level,
          onboardingData.equipment,
          onboardingData.completed_at,
          userId,
        ]
      );
    } else {
      // Yeni kayıt
      await pool.execute(
        `INSERT INTO user_onboarding (
          user_id, gender, dob, weight, height, body_type,
          goals, focus_areas, training_frequency, workout_duration,
          target_weight, fitness_level, equipment, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          onboardingData.gender,
          onboardingData.dob,
          onboardingData.weight,
          onboardingData.height,
          onboardingData.body_type,
          onboardingData.goals,
          onboardingData.focus_areas,
          onboardingData.training_frequency,
          onboardingData.workout_duration,
          onboardingData.target_weight,
          onboardingData.fitness_level,
          onboardingData.equipment,
          onboardingData.completed_at,
        ]
      );
    }

    // Kullanıcının onboarding tamamlandığını işaretle
    await pool.execute(
      'UPDATE users SET onboarding_completed = 1 WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Onboarding completed successfully',
      onboarding: {
        completed: true,
        completedAt: onboardingData.completed_at,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Onboarding verilerini güncelle
 */
const updateOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Güncellenebilir alanları belirle
    const allowedFields = [
      'gender', 'dob', 'weight', 'height', 'bodyType',
      'goals', 'focusAreas', 'trainingFrequency', 'workoutDuration',
      'targetWeight', 'fitnessLevel', 'equipment',
    ];

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates.push(`${dbKey} = ?`);
        
        if (Array.isArray(value)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    values.push(userId);

    await pool.execute(
      `UPDATE user_onboarding SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    res.json({ message: 'Onboarding updated successfully' });
  } catch (error) {
    console.error('Update onboarding error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Onboarding durumunu kontrol et
 */
const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      'SELECT onboarding_completed FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      completed: users[0].onboarding_completed === 1,
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Onboarding verilerini getir
 */
const getOnboardingData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [onboarding] = await pool.execute(
      `SELECT 
        gender, dob, weight, height, body_type, goals, focus_areas,
        training_frequency, workout_duration, target_weight,
        fitness_level, equipment, completed_at
      FROM user_onboarding WHERE user_id = ?`,
      [userId]
    );

    if (onboarding.length === 0) {
      return res.json({ data: null });
    }

    const data = onboarding[0];
    res.json({
      data: {
        gender: data.gender,
        dob: data.dob,
        weight: data.weight,
        height: data.height,
        bodyType: data.body_type,
        goals: data.goals ? JSON.parse(data.goals) : [],
        focusAreas: data.focus_areas ? JSON.parse(data.focus_areas) : [],
        trainingFrequency: data.training_frequency,
        workoutDuration: data.workout_duration,
        targetWeight: data.target_weight,
        fitnessLevel: data.fitness_level,
        equipment: data.equipment ? JSON.parse(data.equipment) : [],
        completedAt: data.completed_at,
      },
    });
  } catch (error) {
    console.error('Get onboarding data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  completeOnboarding,
  updateOnboarding,
  getOnboardingStatus,
  getOnboardingData,
};
