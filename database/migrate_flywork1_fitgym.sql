-- flywork1_fitgym veritabanında eksik tabloları oluşturur.
-- Çalıştırma: mysql -u KULLANICI -p flywork1_fitgym < backend/database/migrate_flywork1_fitgym.sql
-- veya phpMyAdmin'de "flywork1_fitgym" veritabanını seçip bu dosyayı içe aktarın.

USE flywork1_fitgym;

-- 1) Planlanan antrenmanlar (takvim + ana sayfa)
CREATE TABLE IF NOT EXISTS `scheduled_workouts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `scheduled_at` DATE NOT NULL,
  `reminder_time` TIME DEFAULT NULL COMMENT 'Bildirim saati HH:mm',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_scheduled_at` (`scheduled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mevcut tabloya reminder_time eklemek için (zaten tablo varsa):
-- ALTER TABLE scheduled_workouts ADD COLUMN reminder_time TIME DEFAULT NULL COMMENT 'Bildirim saati HH:mm' AFTER scheduled_at;

-- 2) Haftalık planlar (Plans sayfası – My Saved Plans)
CREATE TABLE IF NOT EXISTS `workout_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('daily', 'weekly') NOT NULL DEFAULT 'weekly',
  `description` TEXT,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Tamamlanan antrenman kayıtları (profil/ana sayfa istatistikleri)
CREATE TABLE IF NOT EXISTS `workout_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `workout_plan_id` INT DEFAULT NULL,
  `started_at` DATETIME NOT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `duration` INT DEFAULT NULL,
  `calories_burned` INT DEFAULT NULL,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_started_at` (`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Before/After ilerleme fotoğrafları (Stats ekranı)
CREATE TABLE IF NOT EXISTS `user_progress_photos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('before','after') NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_type` (`user_id`, `type`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
