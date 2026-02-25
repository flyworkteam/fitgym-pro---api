-- Tüm kategoriler ve egzersizler (görsellere göre) + premium işaretleme
-- Yapı: Strength = alt kategoriler (Full Body, Arm, Chest, Shoulders - Back, Legs, Abs). Cardio / Yoga / Pilates = düz liste.
-- Çalıştırma: Önce migrate_exercises_premium.sql, sonra bu dosya.
-- Mevcut Strength kayıtlarında muscle_group yanlışsa: update_strength_muscle_groups.sql içindeki UPDATE'leri çalıştırın.
-- Video/görsel: https://fitgym.b-cdn.net/videos/xxx.mp4 ve .../images/xxx.jpg (sunucuya ekledikçe güncelleyin)

-- Mevcut egzersizlerde premium alanını güncelle (ilk açık olanlar 0)
UPDATE exercises SET is_premium = 1 WHERE 1=1;
UPDATE exercises SET is_premium = 0 WHERE name IN ('Deadlift', 'Running', 'Downward Dog', 'The Hundred');

-- Strength - Full Body (ilk: Deadlift ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Deadlift', 'Tüm vücut gücü için temel hareket.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/deadlift.mp4', 'https://fitgym.b-cdn.net/images/deadlift.jpg', 'intermediate', 0),
('Squat', 'Bacak ve kalça için temel hareket.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/squat.mp4', 'https://fitgym.b-cdn.net/images/squat.jpg', 'beginner', 1),
('Push-up', 'Göğüs ve triceps.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/pushup.mp4', 'https://fitgym.b-cdn.net/images/pushup.jpg', 'beginner', 1);

-- Strength - Arm (ilk: Dumbbell Bicep Curl ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Dumbbell Bicep Curl', 'Biceps geliştirme.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/bicep_curl.mp4', 'https://fitgym.b-cdn.net/images/bicep_curl.jpg', 'beginner', 0),
('Hammer Curl', 'Biceps ve ön kol.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/hammer_curl.mp4', 'https://fitgym.b-cdn.net/images/hammer_curl.jpg', 'beginner', 1),
('Barbell Curl', 'Biceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/barbell_curl.mp4', 'https://fitgym.b-cdn.net/images/barbell_curl.jpg', 'intermediate', 1),
('Preacher Curl', 'Biceps izolasyon.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/preacher_curl.mp4', 'https://fitgym.b-cdn.net/images/preacher_curl.jpg', 'intermediate', 1),
('Concentration Curl', 'Biceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/concentration_curl.mp4', 'https://fitgym.b-cdn.net/images/concentration_curl.jpg', 'beginner', 1),
('Cable Bicep Curl', 'Biceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/cable_bicep_curl.mp4', 'https://fitgym.b-cdn.net/images/cable_bicep_curl.jpg', 'beginner', 1),
('EZ-Bar Curl', 'Biceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/ezbar_curl.mp4', 'https://fitgym.b-cdn.net/images/ezbar_curl.jpg', 'intermediate', 1),
('Triceps Pushdown', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/triceps_pushdown.mp4', 'https://fitgym.b-cdn.net/images/triceps_pushdown.jpg', 'beginner', 1),
('Rope Pushdown', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/rope_pushdown.mp4', 'https://fitgym.b-cdn.net/images/rope_pushdown.jpg', 'beginner', 1),
('Overhead Triceps Extension', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/overhead_triceps.mp4', 'https://fitgym.b-cdn.net/images/overhead_triceps.jpg', 'intermediate', 1),
('Skull Crusher', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/skull_crusher.mp4', 'https://fitgym.b-cdn.net/images/skull_crusher.jpg', 'intermediate', 1),
('Dips', 'Triceps ve göğüs.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/dips.mp4', 'https://fitgym.b-cdn.net/images/dips.jpg', 'intermediate', 1),
('Triceps Kickback', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/triceps_kickback.mp4', 'https://fitgym.b-cdn.net/images/triceps_kickback.jpg', 'beginner', 1),
('Close-Grip Bench Press', 'Triceps.', 'Strength', 'Arm', 'https://fitgym.b-cdn.net/videos/close_grip_bench.mp4', 'https://fitgym.b-cdn.net/images/close_grip_bench.jpg', 'intermediate', 1);

-- Strength - Chest (ilk: Bench Press ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Bench Press', 'Göğüs ve triceps.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/bench_press.mp4', 'https://fitgym.b-cdn.net/images/bench_press.jpg', 'intermediate', 0),
('Incline Bench Press', 'Üst göğüs.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/incline_bench.mp4', 'https://fitgym.b-cdn.net/images/incline_bench.jpg', 'intermediate', 1),
('Dumbbell Bench Press', 'Göğüs.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/dumbbell_bench.mp4', 'https://fitgym.b-cdn.net/images/dumbbell_bench.jpg', 'beginner', 1),
('Dumbbell Fly', 'Göğüs açma.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/dumbbell_fly.mp4', 'https://fitgym.b-cdn.net/images/dumbbell_fly.jpg', 'intermediate', 1),
('Cable Fly', 'Göğüs.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/cable_fly.mp4', 'https://fitgym.b-cdn.net/images/cable_fly.jpg', 'beginner', 1),
('Push-up', 'Göğüs ve triceps.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/pushup.mp4', 'https://fitgym.b-cdn.net/images/pushup.jpg', 'beginner', 1),
('Dumbbell Pull-Over', 'Göğüs ve sırt.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/pullover.mp4', 'https://fitgym.b-cdn.net/images/pullover.jpg', 'intermediate', 1),
('Chest Press Machine', 'Göğüs makine.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/chest_press_machine.mp4', 'https://fitgym.b-cdn.net/images/chest_press_machine.jpg', 'beginner', 1);

-- Strength - Shoulders - Back
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Shoulder Press', 'Omuz.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/shoulder_press.mp4', 'https://fitgym.b-cdn.net/images/shoulder_press.jpg', 'intermediate', 0),
('Lateral Raise', 'Omuz yan demet.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/lateral_raise.mp4', 'https://fitgym.b-cdn.net/images/lateral_raise.jpg', 'beginner', 1),
('Front Raise', 'Omuz ön demet.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/front_raise.mp4', 'https://fitgym.b-cdn.net/images/front_raise.jpg', 'beginner', 1),
('Arnold Press', 'Omuz.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/arnold_press.mp4', 'https://fitgym.b-cdn.net/images/arnold_press.jpg', 'intermediate', 1),
('Upright Row', 'Omuz ve trapez.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/upright_row.mp4', 'https://fitgym.b-cdn.net/images/upright_row.jpg', 'intermediate', 1),
('Face Pull', 'Arka omuz.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/face_pull.mp4', 'https://fitgym.b-cdn.net/images/face_pull.jpg', 'beginner', 1),
('Lat Pulldown', 'Sırt.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/lat_pulldown.mp4', 'https://fitgym.b-cdn.net/images/lat_pulldown.jpg', 'beginner', 1),
('Barbell Row', 'Sırt.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/barbell_row.mp4', 'https://fitgym.b-cdn.net/images/barbell_row.jpg', 'intermediate', 1),
('T-Bar Row', 'Sırt.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/tbar_row.mp4', 'https://fitgym.b-cdn.net/images/tbar_row.jpg', 'intermediate', 1),
('Dumbbell Row', 'Sırt.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/dumbbell_row.mp4', 'https://fitgym.b-cdn.net/images/dumbbell_row.jpg', 'beginner', 1),
('Seated Cable Row', 'Sırt.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/cable_row.mp4', 'https://fitgym.b-cdn.net/images/cable_row.jpg', 'beginner', 1),
('Pull-Up', 'Sırt ve kol.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/pullup.mp4', 'https://fitgym.b-cdn.net/images/pullup.jpg', 'intermediate', 1),
('Deadlifts', 'Tüm vücut.', 'Strength', 'Shoulders - Back', 'https://fitgym.b-cdn.net/videos/deadlift.mp4', 'https://fitgym.b-cdn.net/images/deadlift.jpg', 'intermediate', 1);

-- Strength - Legs (ilk: Squat ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Squat', 'Bacak ve kalça.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/squat.mp4', 'https://fitgym.b-cdn.net/images/squat.jpg', 'beginner', 0),
('Leg Press', 'Bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/leg_press.mp4', 'https://fitgym.b-cdn.net/images/leg_press.jpg', 'beginner', 1),
('Leg Extension', 'Ön bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/leg_extension.mp4', 'https://fitgym.b-cdn.net/images/leg_extension.jpg', 'beginner', 1),
('Lunges', 'Bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/lunges.mp4', 'https://fitgym.b-cdn.net/images/lunges.jpg', 'beginner', 1),
('Leg Curl', 'Arka bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/leg_curl.mp4', 'https://fitgym.b-cdn.net/images/leg_curl.jpg', 'beginner', 1),
('Hack Squat', 'Bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/hack_squat.mp4', 'https://fitgym.b-cdn.net/images/hack_squat.jpg', 'intermediate', 1),
('Goblet Squat', 'Bacak.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/goblet_squat.mp4', 'https://fitgym.b-cdn.net/images/goblet_squat.jpg', 'beginner', 1);

-- Strength - Abs (ilk: Crunch ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Crunch', 'Karın.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/crunch.mp4', 'https://fitgym.b-cdn.net/images/crunch.jpg', 'beginner', 0),
('Plank', 'Karın ve core.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/plank.mp4', 'https://fitgym.b-cdn.net/images/plank.jpg', 'beginner', 1),
('Leg Raise', 'Alt karın.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/leg_raise.mp4', 'https://fitgym.b-cdn.net/images/leg_raise.jpg', 'beginner', 1),
('Bicycle Crunch', 'Karın.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/bicycle_crunch.mp4', 'https://fitgym.b-cdn.net/images/bicycle_crunch.jpg', 'beginner', 1),
('Russian Twist', 'Karın yan.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/russian_twist.mp4', 'https://fitgym.b-cdn.net/images/russian_twist.jpg', 'intermediate', 1),
('Mountain Climber', 'Karın ve cardio.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/mountain_climber.mp4', 'https://fitgym.b-cdn.net/images/mountain_climber.jpg', 'beginner', 1),
('Sit-up', 'Karın.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/situp.mp4', 'https://fitgym.b-cdn.net/images/situp.jpg', 'beginner', 1),
('Flutter Kicks', 'Alt karın.', 'Strength', 'Abs', 'https://fitgym.b-cdn.net/videos/flutter_kicks.mp4', 'https://fitgym.b-cdn.net/images/flutter_kicks.jpg', 'beginner', 1);

-- Cardio (Running ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Running', 'Kardiyo ve dayanıklılık.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/running.mp4', 'https://fitgym.b-cdn.net/images/running.jpg', 'beginner', 0),
('Jump Rope', 'Kalp atışı ve koordinasyon.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/jump_rope.mp4', 'https://fitgym.b-cdn.net/images/jump_rope.jpg', 'beginner', 1),
('Elliptical', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/elliptical.mp4', 'https://fitgym.b-cdn.net/images/elliptical.jpg', 'beginner', 1),
('Cycling', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/cycling.mp4', 'https://fitgym.b-cdn.net/images/cycling.jpg', 'beginner', 1),
('Stair Climber', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/stair_climber.mp4', 'https://fitgym.b-cdn.net/images/stair_climber.jpg', 'beginner', 1),
('Jumping Jack', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/jumping_jack.mp4', 'https://fitgym.b-cdn.net/images/jumping_jack.jpg', 'beginner', 1),
('High Knees', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/high_knees.mp4', 'https://fitgym.b-cdn.net/images/high_knees.jpg', 'beginner', 1),
('Power Walk', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/power_walk.mp4', 'https://fitgym.b-cdn.net/images/power_walk.jpg', 'beginner', 1),
('Burpee', 'Kardiyo ve güç.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/burpee.mp4', 'https://fitgym.b-cdn.net/images/burpee.jpg', 'intermediate', 1),
('Rowing Machine', 'Kardiyo.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/rowing.mp4', 'https://fitgym.b-cdn.net/images/rowing.jpg', 'beginner', 1);

-- Yoga, Stretching (Downward Dog ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Downward Dog', 'Esneme ve güç.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/downwarddog.mp4', 'https://fitgym.b-cdn.net/images/downward_dog.jpg', 'beginner', 0),
('Child\'s Pose', 'Dinlenme ve esneme.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/childs_pose.mp4', 'https://fitgym.b-cdn.net/images/childs_pose.jpg', 'beginner', 1),
('Cobra Pose', 'Omurga esnetme.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/cobra.mp4', 'https://fitgym.b-cdn.net/images/cobra.jpg', 'beginner', 1),
('Cat-Cow', 'Omurga hareketi.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/cat_cow.mp4', 'https://fitgym.b-cdn.net/images/cat_cow.jpg', 'beginner', 1),
('Warrior I', 'Bacak ve denge.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/warrior1.mp4', 'https://fitgym.b-cdn.net/images/warrior1.jpg', 'beginner', 1),
('Warrior II', 'Bacak ve denge.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/warrior2.mp4', 'https://fitgym.b-cdn.net/images/warrior2.jpg', 'beginner', 1),
('Triangle Pose', 'Esneme.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/triangle.mp4', 'https://fitgym.b-cdn.net/images/triangle.jpg', 'beginner', 1),
('Tree Pose', 'Denge.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/tree_pose.mp4', 'https://fitgym.b-cdn.net/images/tree_pose.jpg', 'beginner', 1),
('Bridge Pose', 'Kalça ve sırt.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/bridge.mp4', 'https://fitgym.b-cdn.net/images/bridge.jpg', 'beginner', 1),
('Mountain Pose', 'Temel duruş.', 'Yoga, Stretching', 'Yoga', 'https://fitgym.b-cdn.net/videos/mountain_pose.mp4', 'https://fitgym.b-cdn.net/images/mountain_pose.jpg', 'beginner', 1),
('Hamstring Stretch', 'Arka bacak esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/hamstring_stretch.mp4', 'https://fitgym.b-cdn.net/images/hamstring_stretch.jpg', 'beginner', 1),
('Quad Stretch', 'Ön bacak esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/quad_stretch.mp4', 'https://fitgym.b-cdn.net/images/quad_stretch.jpg', 'beginner', 1),
('Calf Stretch', 'Baldır esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/calf_stretch.mp4', 'https://fitgym.b-cdn.net/images/calf_stretch.jpg', 'beginner', 1),
('Hip Flexor Stretch', 'Kalça esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/hip_flexor_stretch.mp4', 'https://fitgym.b-cdn.net/images/hip_flexor_stretch.jpg', 'beginner', 1),
('Glute Stretch', 'Kalça esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/glute_stretch.mp4', 'https://fitgym.b-cdn.net/images/glute_stretch.jpg', 'beginner', 1),
('Chest Stretch', 'Göğüs esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/chest_stretch.mp4', 'https://fitgym.b-cdn.net/images/chest_stretch.jpg', 'beginner', 1),
('Shoulder Stretch', 'Omuz esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/shoulder_stretch.mp4', 'https://fitgym.b-cdn.net/images/shoulder_stretch.jpg', 'beginner', 1),
('Triceps Stretch', 'Triceps esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/triceps_stretch.mp4', 'https://fitgym.b-cdn.net/images/triceps_stretch.jpg', 'beginner', 1),
('Side Stretch', 'Yan esneme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/side_stretch.mp4', 'https://fitgym.b-cdn.net/images/side_stretch.jpg', 'beginner', 1),
('Lower Back Stretch', 'Bel esnetme.', 'Yoga, Stretching', 'Stretching', 'https://fitgym.b-cdn.net/videos/lower_back_stretch.mp4', 'https://fitgym.b-cdn.net/images/lower_back_stretch.jpg', 'beginner', 1);

-- Pilates (The Hundred ücretsiz)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('The Hundred', 'Core ve nefes.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/thehundred.mp4', 'https://fitgym.b-cdn.net/images/the_hundred.jpg', 'beginner', 0),
('Roll Up', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/roll_up.mp4', 'https://fitgym.b-cdn.net/images/roll_up.jpg', 'beginner', 1),
('Single Leg Stretch', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/single_leg_stretch.mp4', 'https://fitgym.b-cdn.net/images/single_leg_stretch.jpg', 'beginner', 1),
('Double Leg Stretch', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/double_leg_stretch.mp4', 'https://fitgym.b-cdn.net/images/double_leg_stretch.jpg', 'beginner', 1),
('Rolling Like a Ball', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/rolling_ball.mp4', 'https://fitgym.b-cdn.net/images/rolling_ball.jpg', 'beginner', 1),
('Single Straight Leg Stretch', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/scissors.mp4', 'https://fitgym.b-cdn.net/images/scissors.jpg', 'intermediate', 1),
('Spine Stretch Forward', 'Omurga.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/spine_stretch.mp4', 'https://fitgym.b-cdn.net/images/spine_stretch.jpg', 'beginner', 1),
('The Saw', 'Core ve dönüş.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/the_saw.mp4', 'https://fitgym.b-cdn.net/images/the_saw.jpg', 'beginner', 1),
('Leg Circles', 'Kalça ve core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/leg_circles.mp4', 'https://fitgym.b-cdn.net/images/leg_circles.jpg', 'beginner', 1),
('Plank Leg Pull Front', 'Core.', 'Pilates', 'Core', 'https://fitgym.b-cdn.net/videos/plank_leg_pull.mp4', 'https://fitgym.b-cdn.net/images/plank_leg_pull.jpg', 'intermediate', 1);

-- Mevcut tabloda UNIQUE(category, name) yoksa ON DUPLICATE KEY çalışmaz; o zaman yukarıdaki INSERT'ler yeni satır ekler.
-- Tekrar çalıştırmada duplicate isim olabilir. Bir kez çalıştırmanız yeterli.
