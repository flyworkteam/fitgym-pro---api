-- Premium alanı: egzersiz premium ise (1) sadece premium kullanıcılar açabilsin
-- Çalıştırma: mysql -u user -p flywork1_fitgym < backend/database/migrate_exercises_premium.sql
-- Sadece bir kez çalıştırın; kolon zaten varsa hata verir (görmezden gelebilirsiniz).

ALTER TABLE exercises
  ADD COLUMN is_premium TINYINT(1) NOT NULL DEFAULT 0 AFTER difficulty;

-- Aynı kategori+isim tekrar eklenmesin (seed tekrar çalışınca güncelleme yapabilsin)
-- Not: Zaten aynı (category,name) varsa bu satır hata verebilir; o zaman bu ALTER'ı atlayın.
-- ALTER TABLE exercises ADD UNIQUE KEY uq_exercise_category_name (category, name);
