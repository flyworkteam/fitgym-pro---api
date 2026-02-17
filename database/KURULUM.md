# Veritabanı Kurulumu

`flywork1_fitgym` kullanıyorsanız, aşağıdaki tek dosyayı çalıştırmanız yeterli.

## Hızlı kurulum (flywork1_fitgym)

Terminalde:

```bash
cd backend
mysql -u KULLANICI -p flywork1_fitgym < database/migrate_flywork1_fitgym.sql
```

(KULLANICI yerine kendi MySQL kullanıcı adınızı yazın; `-p` sonrası şifre sorar.)

**phpMyAdmin** kullanıyorsanız:
1. Sol taraftan **flywork1_fitgym** veritabanını seçin.
2. Üstten **İçe Aktar (Import)** sekmesine gidin.
3. **Dosya Seç** ile `backend/database/migrate_flywork1_fitgym.sql` dosyasını seçin.
4. **Git** / **Go** ile çalıştırın.

Bu işlem şu tabloları oluşturur:
- **scheduled_workouts** – Takvimde “Antrenman planla” ve ana sayfa planlanan antrenmanlar.
- **workout_plans** – Plans sayfasındaki “My Saved Plans” (kayıtlı haftalık planlar).
- **workout_sessions** – Tamamlanan antrenman kayıtları (profil ve ana sayfa istatistikleri).
- **user_progress_photos** – İstatistikler ekranındaki Before/After fotoğrafları.

## .env

`backend/.env` içinde veritabanı adı doğru olmalı:

```
DB_NAME=flywork1_fitgym
```

Tabloları oluşturduktan sonra backend’i yeniden başlatın: `node server.js`

## Güncelleme (scheduled_workouts zaten varsa)

Bildirim saati özelliği için `reminder_time` sütunu eklendi. Tabloyu daha önce oluşturduysanız phpMyAdmin veya MySQL ile şunu çalıştırın:

```sql
ALTER TABLE scheduled_workouts ADD COLUMN reminder_time TIME DEFAULT NULL COMMENT 'Bildirim saati HH:mm' AFTER scheduled_at;
```

## Hata çözümü

- **"Table 'flywork1_fitgym.scheduled_workouts' doesn't exist"**  
  → Yukarıdaki migration SQL’i `flywork1_fitgym` veritabanında çalıştırın.

- **Profilde 0m / 0 kcal / 0 tamamlanan**  
  → `workout_sessions` tablosu oluşturulmuş olmalı. Antrenmanı bitirip “OK” dedikten sonra profil ve ana sayfa istatistikleri güncellenir.
