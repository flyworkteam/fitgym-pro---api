# Yerelde (Local) Çalıştırma

Backend’i kendi bilgisayarında çalıştırırken uzak sunucudaki MySQL’e bağlanmak **Access denied** verebilir (sunucu sadece kendi IP’sine izin veriyor). Çözüm: yerelde kendi MySQL’ini kullan.

## 1. MySQL’i yerelde kur

- **Mac:** `brew install mysql` → `brew services start mysql`
- **Windows:** [MySQL Installer](https://dev.mysql.com/downloads/installer/) ile kur, servisi başlat.

## 2. Veritabanı ve tabloları oluştur

Terminalde (MySQL root şifresi varsa `-p` yazınca sorar):

```bash
cd backend

# Veritabanı oluştur
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS flywork1_fitgym;"

# Şemayı yükle (tüm tablolar)
mysql -u root -p flywork1_fitgym < database/schema.sql

# Ek tablolar (scheduled_workouts vb.) için:
mysql -u root -p flywork1_fitgym < database/migrate_flywork1_fitgym.sql
```

İstersen **Sequel Ace / TablePlus / phpMyAdmin** ile de aynı SQL dosyalarını çalıştırabilirsin.

## 3. Yerel ortam dosyasını kullan

`.env` dosyasına **dokunma** (canlı DB bilgileri kalsın). Sadece yerel için override dosyası ekle:

```bash
cp .env.local.example .env.local
```

`.env.local` içini kendi yerel MySQL bilgilerinle düzenle:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=     # Mac’te genelde boş; Windows’ta kurulumda verdiğin şifre
DB_NAME=flywork1_fitgym
DB_PORT=3306
```

Server çalışırken önce `.env`, sonra `.env.local` yüklenir; **yerelde sadece DB_*** değişkenleri `.env.local`’den okunur.**

## 4. Backend’i başlat

```bash
npm run dev
# veya
node server.js
```

Konsolda `Loaded .env.local (local development)` ve `Database connected successfully` görmelisin.

## Özet

| Dosya       | Ne için?                          |
|------------|------------------------------------|
| `.env`     | Canlı / uzak sunucu (değiştirme)  |
| `.env.local` | Yerel geliştirme (localhost MySQL) |

`.env.local` yoksa backend yine `.env` ile çalışır (uzak DB). Yerelde bağlantı hatası alıyorsan bu adımlarla yerel MySQL + `.env.local` kullan.
