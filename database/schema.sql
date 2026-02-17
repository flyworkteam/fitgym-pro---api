-- FitGYM Pro Database Schema
-- MySQL Database Structure
USE flywork1_fitgym;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `name` VARCHAR(255),
  `photo_url` VARCHAR(500),
  `auth_provider` ENUM('email', 'google', 'apple', 'facebook', 'anonymous') NOT NULL DEFAULT 'email',
  `is_active` TINYINT(1) DEFAULT 1,
  `is_premium` TINYINT(1) DEFAULT 0,
  `premium_expires_at` DATETIME NULL,
  `onboarding_completed` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_auth_provider` (`auth_provider`),
  INDEX `idx_is_premium` (`is_premium`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_token` (`token`(255)),
  INDEX `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Onboarding Table
CREATE TABLE IF NOT EXISTS `user_onboarding` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `gender` VARCHAR(50),
  `dob` DATE,
  `weight` VARCHAR(50),
  `height` VARCHAR(50),
  `body_type` VARCHAR(50),
  `goals` JSON,
  `focus_areas` JSON,
  `training_frequency` VARCHAR(100),
  `workout_duration` VARCHAR(100),
  `target_weight` VARCHAR(50),
  `fitness_level` VARCHAR(100),
  `equipment` JSON,
  `completed_at` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workout Plans Table
CREATE TABLE IF NOT EXISTS `workout_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('daily', 'weekly') NOT NULL,
  `description` TEXT,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exercises Table
CREATE TABLE IF NOT EXISTS `exercises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100),
  `muscle_group` VARCHAR(100),
  `video_url` VARCHAR(500),
  `image_url` VARCHAR(500),
  `instructions` TEXT,
  `difficulty` ENUM('beginner', 'intermediate', 'advanced'),
  `equipment_needed` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_muscle_group` (`muscle_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workout Plan Exercises Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS `workout_plan_exercises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `workout_plan_id` INT NOT NULL,
  `exercise_id` INT NOT NULL,
  `day` INT,
  `order` INT DEFAULT 0,
  `sets` INT,
  `reps` VARCHAR(100),
  `duration` INT,
  `rest_time` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE CASCADE,
  INDEX `idx_workout_plan_id` (`workout_plan_id`),
  INDEX `idx_exercise_id` (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS `workout_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `workout_plan_id` INT,
  `started_at` DATETIME NOT NULL,
  `completed_at` DATETIME,
  `duration` INT,
  `calories_burned` INT,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_started_at` (`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workout Session Exercises Table
CREATE TABLE IF NOT EXISTS `workout_session_exercises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `workout_session_id` INT NOT NULL,
  `exercise_id` INT NOT NULL,
  `sets_completed` INT,
  `reps_completed` JSON,
  `duration` INT,
  `weight` DECIMAL(5,2),
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE CASCADE,
  INDEX `idx_workout_session_id` (`workout_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(100),
  `is_read` TINYINT(1) DEFAULT 0,
  `push_sent` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Push Tokens Table
CREATE TABLE IF NOT EXISTS `push_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `platform` ENUM('ios', 'android') NOT NULL,
  `onesignal_player_id` VARCHAR(255),
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_token` (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Premium Subscriptions Table
CREATE TABLE IF NOT EXISTS `premium_subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `package_id` VARCHAR(255),
  `platform` ENUM('ios', 'android'),
  `revenuecat_transaction_id` VARCHAR(255),
  `status` ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  `started_at` DATETIME NOT NULL,
  `expires_at` DATETIME,
  `cancelled_at` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health Data Table
CREATE TABLE IF NOT EXISTS `health_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('steps', 'heartRate', 'sleep', 'calories', 'distance') NOT NULL,
  `value` DECIMAL(10,2),
  `unit` VARCHAR(50),
  `date` DATE NOT NULL,
  `source` ENUM('ios_health', 'android_health', 'app') DEFAULT 'app',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Body Scan Results Table
CREATE TABLE IF NOT EXISTS `body_scan_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `body_fat_percentage` DECIMAL(5,2),
  `muscle_mass` DECIMAL(5,2),
  `body_type` VARCHAR(100),
  `primary_goal` VARCHAR(100),
  `images` JSON,
  `analysis_data` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Settings Table
CREATE TABLE IF NOT EXISTS `user_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `notifications_enabled` TINYINT(1) DEFAULT 1,
  `push_notifications_enabled` TINYINT(1) DEFAULT 1,
  `health_sync_enabled` TINYINT(1) DEFAULT 1,
  `language` VARCHAR(10) DEFAULT 'en',
  `units` ENUM('metric', 'imperial') DEFAULT 'metric',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scheduled Workouts (takvimde planlanan, ana sayfa sayaç)
CREATE TABLE IF NOT EXISTS `scheduled_workouts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `scheduled_at` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_scheduled_at` (`scheduled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
