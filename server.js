const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables (.env then .env.local for local overrides)
dotenv.config();
const envLocal = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal, override: true });
  console.log('Loaded .env.local (local development)');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yüklenen dosyalar (progress photos vb.) - /uploads/xxx.jpg
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/onboarding', require('./routes/onboarding'));
app.use('/api/v1/user', require('./routes/user'));
app.use('/api/v1/workouts', require('./routes/workouts'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/premium', require('./routes/premium'));
app.use('/api/v1/health', require('./routes/health'));
app.use('/api/v1/body-scan', require('./routes/bodyScan'));

// Root – tarayıcıda http://IP:3000 açılınca 404 yerine bilgi
app.get('/', (req, res) => {
  res.json({
    message: 'FitGym Backend',
    health: '/health',
    api: '/api/v1',
  });
});

// Health check (http://IP:3000/health)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1 root (http://IP:3000/api/v1 – 404 yerine bilgi)
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'FitGym API v1',
    endpoints: ['/api/v1/auth', '/api/v1/user', '/api/v1/onboarding', '/api/v1/workouts', '/api/v1/health'],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server - 0.0.0.0 = tüm ağ arayüzlerinde dinle (telefondan erişim için)
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Yerel ağdan erişim: http://192.168.1.113:${PORT} (Mac IP'n ile değiştir)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
