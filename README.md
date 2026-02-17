# FitGYM Pro Backend

Node.js ve Express kullanılarak geliştirilmiş RESTful API backend.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun (`.env.example` dosyasını referans alın):
```bash
cp .env.example .env
```

3. `.env` dosyasındaki değerleri doldurun:
- Database bilgileri
- JWT secret'ları
- OAuth credentials (Google, Apple, Facebook)
- OneSignal API key'leri
- RevenueCat API key
- Bunny CDN bilgileri

4. MySQL veritabanını oluşturun:
```bash
mysql -u root -p < database/schema.sql
```

5. Sunucuyu başlatın:
```bash
# Development
npm run dev

# Production
npm start
```

## Proje Yapısı

```
backend/
├── config/          # Yapılandırma dosyaları
├── controllers/     # Route controller'ları
├── database/        # Veritabanı şemaları
├── middleware/      # Express middleware'leri
├── routes/          # API route tanımları
├── services/        # Harici servis entegrasyonları
├── utils/           # Yardımcı fonksiyonlar
├── server.js        # Ana sunucu dosyası
└── package.json     # Bağımlılıklar
```

## API Dokümantasyonu

Detaylı API dokümantasyonu için `API_DOCUMENTATION.md` dosyasına bakın.

## Özellikler

- ✅ JWT Authentication
- ✅ Google, Apple, Facebook, Anonymous giriş
- ✅ Onboarding yönetimi
- ✅ Kullanıcı profil yönetimi
- ✅ Antrenman planları ve egzersizler
- ✅ OneSignal push notification entegrasyonu
- ✅ RevenueCat premium abonelik yönetimi
- ✅ Health data senkronizasyonu
- ✅ Vücut analizi (Body Scan)
- ✅ MySQL veritabanı

## Güvenlik

- JWT token tabanlı authentication
- Bcrypt ile şifre hash'leme
- SQL injection koruması
- CORS yapılandırması
- Helmet.js güvenlik başlıkları

## Veritabanı

MySQL kullanılmaktadır. Şema dosyası `database/schema.sql` içinde bulunur.

**Before/After görsel yükleme:** Tablo `user_progress_photos` şemada/migration’da zaten var; ekstra tablo veya migration gerekmez. Görsel yükleme çalışmıyorsa backend’i yeniden başlatın (`npm run dev` / `npm start`). Tarayıcıda URL’yi GET ile açarsanız 405 döner (endpoint sadece POST kabul eder).

## Environment Variables

Gerekli environment variable'lar `.env.example` dosyasında listelenmiştir.

## Lisans

Proje sahibine aittir.
