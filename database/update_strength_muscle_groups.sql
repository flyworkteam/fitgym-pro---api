-- Strength alt kategorileri: Full Body, Arm, Chest, Shoulders - Back, Legs, Abs
-- Mevcut egzersizlerin muscle_group (ve gerekirse category) değerini isme göre düzeltir.
-- Sadece aşağıdaki UPDATE bloklarını çalıştırın; başka satır eklemeyin.

UPDATE exercises SET category = 'Strength', muscle_group = 'Full Body'
WHERE name IN ('Deadlift', 'Squat', 'Push-up');

UPDATE exercises SET category = 'Strength', muscle_group = 'Arm'
WHERE name IN (
  'Dumbbell Bicep Curl', 'Hammer Curl', 'Barbell Curl', 'Preacher Curl', 'Concentration Curl',
  'Cable Bicep Curl', 'EZ-Bar Curl', 'Triceps Pushdown', 'Rope Pushdown', 'Overhead Triceps Extension',
  'Skull Crusher', 'Dips', 'Triceps Kickback', 'Close-Grip Bench Press'
);

UPDATE exercises SET category = 'Strength', muscle_group = 'Chest'
WHERE name IN (
  'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Dumbbell Fly', 'Cable Fly',
  'Dumbbell Pull-Over', 'Chest Press Machine'
);

UPDATE exercises SET category = 'Strength', muscle_group = 'Shoulders - Back'
WHERE name IN (
  'Shoulder Press', 'Lateral Raise', 'Front Raise', 'Arnold Press', 'Upright Row', 'Face Pull',
  'Lat Pulldown', 'Barbell Row', 'T-Bar Row', 'Dumbbell Row', 'Seated Cable Row', 'Pull-Up', 'Deadlifts'
);

UPDATE exercises SET category = 'Strength', muscle_group = 'Legs'
WHERE name IN (
  'Leg Press', 'Leg Extension', 'Lunges', 'Leg Curl', 'Hack Squat', 'Goblet Squat'
);

UPDATE exercises SET category = 'Strength', muscle_group = 'Abs'
WHERE name IN (
  'Crunch', 'Plank', 'Leg Raise', 'Bicycle Crunch', 'Russian Twist', 'Mountain Climber', 'Sit-up', 'Flutter Kicks'
);
