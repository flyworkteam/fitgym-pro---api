-- Child's Pose egzersizi (videoyu assets/videos/childs_pose.mp4 olarak eklediyseniz)
-- Çalıştırma: mysql -u user -p flywork1_fitgym < backend/database/seed_childs_pose.sql

INSERT INTO exercises (name, description, category, muscle_group, video_url, image_url, difficulty) VALUES
(
  'Child\'s Pose',
  'Sırt ve kalça esnetmesi için yoga hareketi. Dizler üzerinde öne eğilerek dinlenme pozisyonu.',
  'Stretching',
  'Back',
  NULL,
  NULL,
  'beginner'
)
;

-- Not: Uygulama video için assets/videos/childs_pose.mp4 asset'ini kullanır (workout_player_view.dart içinde eşleme var).
-- video_url burada NULL bırakıldı; HTTP URL kullanacaksanız örn: 'https://fitgym.b-cdn.net/videos/childs_pose.mp4' yazabilirsiniz.
