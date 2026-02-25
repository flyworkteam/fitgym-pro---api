# Egzersiz videoları ve görselleri

## Antrenman yapısı (uygulama ile uyumlu)

- **Strength:** Alt kategoriler var → Full Body, Arm, Chest, Shoulders - Back, Legs, Abs. Her biri `muscle_group` alanıyla filtrelenir.
- **Cardio, Yoga, Pilates:** Alt kategori yok; doğrudan egzersiz listesi. Sadece `category` ile filtre.

Veritabanında Strength egzersizlerinin `muscle_group` değeri tam olmalı; yoksa Full Body / Arm / Legs ekranları boş veya döner.

## Veritabanı

- Önce `migrate_exercises_premium.sql`, sonra `seed_workout_full.sql` çalıştırın.
- **Strength içi boş/dönüyorsa:** Mevcut egzersizleri isme göre düzeltmek için sadece `update_strength_muscle_groups.sql` içindeki UPDATE’leri çalıştırın (başka satır eklemeyin).
- Seed dosyasındaki `video_url` ve `image_url` alanları örnek olarak **Bunny CDN** adresleri içerir (`https://fitgym.b-cdn.net/...`).

## İçerik ekleme (videolar/görseller)

1. **Sunucuya yükleme:** Videoları ve görselleri kendi CDN’inize veya sunucunuza yükleyin (örn. Bunny, S3, kendi storage).
2. **URL’leri güncelleme (isteğe bağlı):** Veritabanında `exercises` tablosundaki `video_url` ve `image_url` sütunlarını gerçek dosya adreslerinizle güncelleyin.
   - Örnek: `UPDATE exercises SET image_url = 'https://your-cdn.com/images/deadlift.jpg', video_url = 'https://your-cdn.com/videos/deadlift.mp4' WHERE name = 'Deadlift';`
3. **Dosya yoksa:** Uygulama artık yüklenemeyen görsellerde placeholder (gri kutu + ikon) gösterir; sayfa siyah kalmaz.

## Full Body / Strength “donuyor” gibi görünüyorsa

- Egzersiz listesi API’den gelir. Sunucuya ulaşılamıyorsa veya veritabanında o kategori/plan için kayıt yoksa:
  - “Egzersizler yüklenemedi” veya “Bu planda henüz egzersiz yok” mesajı görünür.
- Yerel test: Backend’in çalıştığından ve cihazın aynı ağda olduğundan emin olun (`ApiService.baseUrl` / `localHostIp`).
