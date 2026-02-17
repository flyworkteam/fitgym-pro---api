# Backend Nasıl Çalıştırılır?

## Yerel (bilgisayarında) çalıştırma

1. **Terminalde backend klasörüne gir:**
   ```bash
   cd backend
   ```

2. **Bağımlılıkları yükle (ilk sefer veya package.json değiştiyse):**
   ```bash
   npm install
   ```

3. **.env dosyasının olduğundan emin ol** (MySQL, JWT, Google/Facebook/Apple vb. dolu).

4. **Sunucuyu başlat:**
   ```bash
   node server.js
   ```
   veya geliştirme modunda (dosya değişince yeniden başlatır):
   ```bash
   npm run dev
   ```

5. Çıktıda şunu görmelisin: `Server running on port 3000` (veya PORT’ta yazdığın port).

6. **Test:** Tarayıcıda `http://localhost:3000/health` aç → `{"status":"ok",...}` dönmeli.

---

## Uygulama backend’e nasıl bağlanır?

- **Şu an Flutter’daki API adresi:** `https://fitness.duyari.com.tr/api/v1`
- Yani uygulama **canlı sunucudaki** API’ye istek atıyor. Backend’i kendi bilgisayarında çalıştırıyorsan, uygulama hâlâ fitness.duyari.com.tr’ye gider; localhost’a gitmez.

### Seçenek A: Backend’i canlı sunucuda çalıştır

- fitness.duyari.com.tr’nin işaret ettiği sunucuda Node.js kurulu olmalı.
- Backend dosyalarını (server.js, routes, config, vb.) sunucuya at, `npm install`, `.env` doldur, `node server.js` veya PM2 ile sürekli çalıştır.
- Bu sunucuda backend 3000 portunda (veya verdiğin PORT) çalışır; domain’i 3000’e yönlendirmen gerekir (ters proxy, nginx vb.).

### Seçenek B: Yerel test (backend bilgisayarında, uygulama aynı ağda)

- Backend’i bilgisayarında çalıştır (`node server.js`).
- Flutter’da geçici olarak API adresini **bilgisayarının yerel IP’si** yap (örn. `http://192.168.1.5:3000/api/v1`). Telefon ve bilgisayar aynı Wi‑Fi’da olmalı.
- `lib/Core/Config/app_config.dart` ve `lib/Services/api_service.dart` içindeki `baseUrl` / `apiBaseUrl` değerini bu adrese çevir, uygulamayı tekrar çalıştır.

---

## "FormatException: <!DOCTYPE html>" hatası

Bu hata, uygulama API’ye istek attığında sunucunun **JSON yerine HTML sayfası** döndüğü anlamına gelir. Örneğin:

- fitness.duyari.com.tr’de backend hiç çalışmıyordur (sadece web sunucusu açık, 502/404 sayfası dönüyor).
- veya domain yanlış sunucuya/porta yönleniyordur.

**Yapılacaklar:**

1. Backend’i doğru yerde (canlı sunucuda veya test için yerel) çalıştır.
2. Canlı kullanıyorsan: fitness.duyari.com.tr’nin 3000 portundaki Node uygulamasına yönlendiğinden emin ol (nginx/reverse proxy ayarı).
3. Tarayıcıda `https://fitness.duyari.com.tr/api/v1/health` veya `https://fitness.duyari.com.tr/health` açıp JSON (`{"status":"ok"}`) dönüyor mu kontrol et.

Bu adımları tamamladığında uygulama çalışır; Apple iptal (1001) de artık hata yerine sessizce “giriş yapılmadı” sayılır.
