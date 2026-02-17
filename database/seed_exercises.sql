-- Örnek egzersizler (CDN video/görsel URL'lerini kendi dosya adlarınızla güncelleyin)
-- Çalıştırma: mysql -u user -p flywork1_fitgym < database/seed_exercises.sql
-- veya phpMyAdmin'de SQL sekmesine yapıştırın

INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty) VALUES
('Bench Press', 'Göğüs ve triceps için temel hareket.', 'Strength', 'Chest', 'https://fitgym.b-cdn.net/videos/bench_press.mp4', 'https://fitgym.b-cdn.net/images/bench_press.jpg', 'intermediate'),
('Squat', 'Bacak ve kalça için temel hareket.', 'Strength', 'Legs', 'https://fitgym.b-cdn.net/videos/squat.mp4', 'https://fitgym.b-cdn.net/images/squat.jpg', 'beginner'),
('Deadlift', 'Tüm vücut gücü için temel hareket.', 'Strength', 'Full Body', 'https://fitgym.b-cdn.net/videos/deadlift.mp4', 'https://fitgym.b-cdn.net/images/deadlift.jpg', 'intermediate'),
('Dumbbell Lateral Raise', 'Omuz yan demetleri.', 'Strength', 'Shoulders', 'https://fitgym.b-cdn.net/videos/lateral_raise.mp4', 'https://fitgym.b-cdn.net/images/lateral_raise.jpg', 'beginner'),
('Running', 'Kardiyo ve dayanıklılık.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/running.mp4', 'https://fitgym.b-cdn.net/images/running.jpg', 'beginner'),
('Jump Rope', 'Kalp atışı ve koordinasyon.', 'Cardio', 'Full Body', 'https://fitgym.b-cdn.net/videos/jump_rope.mp4', 'https://fitgym.b-cdn.net/images/jump_rope.jpg', 'beginner')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Mevcut Jump Rope satırını görsel/video ile güncelle (zaten ekliyse)
UPDATE exercises SET video_url = 'https://fitgym.b-cdn.net/videos/jump_rope.mp4', image_url = 'https://fitgym.b-cdn.net/images/jump_rope.jpg' WHERE name = 'Jump Rope' AND (video_url IS NULL OR image_url IS NULL);
