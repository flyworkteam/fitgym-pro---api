-- Kas grupları görselleri: Sunucuya yüklediğin dosyaların yollarını veritabanına yaz
-- Çalıştırma: mysql -u KULLANICI -p VERITABANI_ADI < backend/database/update_muscle_group_images.sql
--
-- Aşağıdaki URL'leri kendi sunucundaki gerçek adreslerle değiştir.
-- Tam URL kullanabilirsin: https://api.siteniz.com/uploads/full_body.jpg
-- Veya göreli path (uygulama API origin ile birleştirir): /uploads/muscle-groups/full_body.jpg

-- Full Body
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/full_body.jpg'
WHERE category = 'Strength' AND muscle_group = 'Full Body';

-- Arm
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/arm.jpg'
WHERE category = 'Strength' AND muscle_group = 'Arm';

-- Chest
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/chest.jpg'
WHERE category = 'Strength' AND muscle_group = 'Chest';

-- Shoulders - Back
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/shoulders_back.jpg'
WHERE category = 'Strength' AND muscle_group = 'Shoulders - Back';

-- Legs
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/legs.jpg'
WHERE category = 'Strength' AND muscle_group = 'Legs';

-- Abs
UPDATE exercises
SET image_url = 'https://fitgym.b-cdn.net/images/abs.jpg'
WHERE category = 'Strength' AND muscle_group = 'Abs';

-- Bitti. GET /workouts/exercises?category=Strength çağrıldığında
-- her egzersizin imageUrl alanı döner; Strength sayfasında kart görseli
-- o kas grubundaki ilk egzersizin imageUrl'i ile gösterilir.
