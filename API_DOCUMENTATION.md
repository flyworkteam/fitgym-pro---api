# FitGYM Pro Backend API Dokümantasyonu

## Genel Bilgiler

- **Base URL**: `https://api.fitgympro.com/api/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

## Authentication Endpoints

### POST /auth/signup
Email/Password ile kayıt

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /auth/signin
Email/Password ile giriş

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Sign in successful",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isPremium": false
  }
}
```

### POST /auth/google
Google ile giriş

**Request Body:**
```json
{
  "idToken": "google_id_token",
  "accessToken": "google_access_token"
}
```

### POST /auth/apple
Apple ile giriş

**Request Body:**
```json
{
  "identityToken": "apple_identity_token",
  "authorizationCode": "apple_authorization_code",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

### POST /auth/facebook
Facebook ile giriş

**Request Body:**
```json
{
  "accessToken": "facebook_access_token"
}
```

### POST /auth/anonymous
Anonymous giriş

**Response:**
```json
{
  "message": "Anonymous sign in successful",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "email": null,
    "name": null
  }
}
```

### POST /auth/refresh
Token yenileme

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_jwt_token"
}
```

### POST /auth/signout
Çıkış yap

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### GET /auth/verify
Token doğrulama

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## Onboarding Endpoints

### POST /onboarding/complete
Onboarding verilerini kaydet

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "gender": "Male",
  "dob": "1990-01-01",
  "weight": "80",
  "height": "180",
  "bodyType": "Mesomorph",
  "goals": ["Losing weight", "Build muscle"],
  "focusAreas": ["Full Body", "Abs"],
  "trainingFrequency": "3 days",
  "workoutDuration": "30-45 minutes",
  "targetWeight": "75",
  "fitnessLevel": "Beginner",
  "equipment": ["Dumbbell", "Mat"]
}
```

**Response:**
```json
{
  "message": "Onboarding completed successfully",
  "onboarding": {
    "completed": true,
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /onboarding/update
Onboarding verilerini güncelle

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "weight": "82",
  "height": "182"
}
```

### GET /onboarding/status
Onboarding durumunu kontrol et

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "completed": true
}
```

### GET /onboarding/data
Onboarding verilerini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "data": {
    "gender": "Male",
    "dob": "1990-01-01",
    "weight": "80",
    "height": "180",
    "bodyType": "Mesomorph",
    "goals": ["Losing weight", "Build muscle"],
    "focusAreas": ["Full Body", "Abs"],
    "trainingFrequency": "3 days",
    "workoutDuration": "30-45 minutes",
    "targetWeight": "75",
    "fitnessLevel": "Beginner",
    "equipment": ["Dumbbell", "Mat"],
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## User Endpoints

### GET /user/profile
Kullanıcı profil bilgilerini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "photoUrl": "https://...",
    "isPremium": false
  }
}
```

### PUT /user/profile
Kullanıcı profil bilgilerini güncelle

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "John Updated",
  "weight": "82",
  "height": "182"
}
```

### GET /user/stats
Kullanıcı istatistiklerini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

### GET /user/settings
Kullanıcı ayarlarını getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

### PUT /user/settings
Kullanıcı ayarlarını güncelle

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "notificationsEnabled": true,
  "pushNotificationsEnabled": true,
  "healthSyncEnabled": true,
  "language": "en",
  "units": "metric"
}
```

### DELETE /user/account
Hesabı sil

**Headers:**
```
Authorization: Bearer {accessToken}
```

## Workout Endpoints

### GET /workouts/plans
Antrenman planlarını getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `type` (optional): `daily` veya `weekly`

**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Full Body Workout",
      "type": "daily",
      "description": "...",
      "exercises": [...]
    }
  ]
}
```

### POST /workouts/plans
Yeni antrenman planı oluştur

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "Full Body Workout",
  "type": "daily",
  "description": "...",
  "exercises": [
    {
      "exerciseId": 1,
      "day": 1,
      "sets": 3,
      "reps": "10-12",
      "restTime": 60
    }
  ]
}
```

### GET /workouts/exercises
Egzersiz listesini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `category` (optional)
- `muscleGroup` (optional)

### GET /workouts/exercises/:id
Egzersiz detayını getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

### POST /workouts/start
Antrenmanı başlat

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "planId": 1
}
```

### POST /workouts/:id/complete
Antrenmanı tamamla

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "duration": 3600,
  "caloriesBurned": 300,
  "exercises": [...]
}
```

### GET /workouts/completed
Tamamlanan antrenmanları getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `limit` (optional)
- `offset` (optional)

### GET /workouts/progress
İlerleme özetini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

## Notification Endpoints

### POST /notifications/register
Push notification token kaydet

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "pushToken": "onesignal_player_id",
  "platform": "ios"
}
```

### GET /notifications
Uygulama içi bildirimleri getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `limit` (optional)
- `offset` (optional)
- `unreadOnly` (optional)

### PUT /notifications/:id/read
Bildirimi okundu olarak işaretle

**Headers:**
```
Authorization: Bearer {accessToken}
```

### PUT /notifications/read-all
Tüm bildirimleri okundu olarak işaretle

**Headers:**
```
Authorization: Bearer {accessToken}
```

## Premium Endpoints

### GET /premium/status
Premium durumunu kontrol et

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "isPremium": true,
  "expiresAt": "2024-12-31T00:00:00.000Z"
}
```

### GET /premium/packages
Premium paketlerini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

### POST /premium/purchase
Premium satın alma işlemini başlat

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "packageId": "premium_monthly",
  "platform": "ios"
}
```

### POST /premium/verify
Purchase verify (RevenueCat webhook)

**Headers:**
```
Authorization: Bearer {accessToken}
```

## Health Endpoints

### POST /health/sync
Health verilerini senkronize et

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "platform": "ios",
  "data": [
    {
      "type": "steps",
      "value": 10000,
      "date": "2024-01-01"
    }
  ]
}
```

### GET /health/data
Health verilerini getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)
- `type` (optional): `steps`, `heartRate`, `sleep`, vb.

## Body Scan Endpoints

### POST /body-scan/upload
Vücut analizi için görüntü yükle

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

### GET /body-scan/results/:id?
Vücut analizi sonuçlarını getir

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "bodyFatPercentage": 15.5,
  "muscleMass": 65.2,
  "bodyType": "Mesomorph",
  "primaryGoal": "Fat reduction"
}
```

## Hata Kodları

- `400`: Bad Request - Geçersiz istek
- `401`: Unauthorized - Token gerekli veya geçersiz
- `403`: Forbidden - Yetki yok (örn. Premium gerekli)
- `404`: Not Found - Kaynak bulunamadı
- `500`: Internal Server Error - Sunucu hatası

## Güvenlik

- Tüm hassas endpoint'ler JWT token ile korunur
- Şifreler bcrypt ile hash'lenir
- SQL injection koruması için prepared statements kullanılır
- CORS yapılandırması yapılmıştır
- Helmet.js ile güvenlik başlıkları eklenir
