-- Strength > Full Body ekranındaki 7 egzersiz (görseller PNG).
-- Çalıştırma: mysql -u user -p VERITABANI_ADI < backend/database/seed_full_body_exercises_png.sql
-- Görsel/video base: https://fitgym.b-cdn.net/images/xxx.png ve .../videos/xxx.mp4 (PNG’leri bu path’e koyun)

-- Aynı isimle (Strength, Full Body) kayıt varsa tekrar eklenmesin diye önce kontrol edebilirsiniz:
-- SELECT id, name FROM exercises WHERE category = 'Strength' AND muscle_group = 'Full Body';

-- Strength - Full Body (ek 7 egzersiz: Bent Over Row, Lunge, Overhead Shoulder Press, Glute Bridge, Plank - core, Mountain Climber, Jumping Jack)
INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty, is_premium) VALUES
('Bent Over Row', 'Sırt ve kol için temel çekme hareketi.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/bent_over_row.mp4', 'https://fitgym.b-cdn.net/images/bent_over_row.png', 'intermediate', 1),
('Lunge', 'Bacak ve kalça için tek bacak hareketi.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/lunge.mp4', 'https://fitgym.b-cdn.net/images/lunge.png', 'beginner', 1),
('Overhead Shoulder Press', 'Omuz ve üst vücut gücü.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/overhead_shoulder_press.mp4', 'https://fitgym.b-cdn.net/images/overhead_shoulder_press.png', 'intermediate', 1),
('Glute Bridge', 'Kalça ve hamstring aktivasyonu.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/glute_bridge.mp4', 'https://fitgym.b-cdn.net/images/glute_bridge.png', 'beginner', 1),
('Plank - core', 'Core ve karın dayanıklılığı.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/plank_core.mp4', 'https://fitgym.b-cdn.net/images/plank_core.png', 'beginner', 1),
('Mountain Climber', 'Karın ve kardiyo.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/mountain_climber.mp4', 'https://fitgym.b-cdn.net/images/mountain_climber.png', 'beginner', 1),
('Jumping Jack', 'Kardiyo ve ısınma.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/jumping_jack.mp4', 'https://fitgym.b-cdn.net/images/jumping_jack.png', 'beginner', 1);

-- Not: Uygulama şu an sets/reps’i sabit gösteriyor (örn. 3 Sets x 10 Reps). İleride workout_plan_exercises veya exercises tablosuna sets/reps alanı eklerseniz bu kayıtları güncelleyebilirsiniz:
-- Örnek (egzersiz id’leri ekledikten sonra):
-- UPDATE exercises SET ... WHERE name = 'Bent Over Row' AND muscle_group = 'Full Body';  -- 3x8
-- UPDATE exercises SET ... WHERE name = 'Mountain Climber' AND muscle_group = 'Full Body'; -- 3x12
-- vs.
