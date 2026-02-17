const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * JWT Token doğrulama middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı veritabanından kontrol et
    const [users] = await pool.execute(
      'SELECT id, email, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!users[0].is_active) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Kullanıcı bilgisini request'e ekle
    req.user = {
      id: users[0].id,
      email: users[0].email,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * Premium kullanıcı kontrolü middleware
 */
const requirePremium = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT is_premium, premium_expires_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const isPremium = user.is_premium && 
      (!user.premium_expires_at || new Date(user.premium_expires_at) > new Date());

    if (!isPremium) {
      return res.status(403).json({ 
        message: 'Premium subscription required',
        code: 'PREMIUM_REQUIRED'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Premium check error' });
  }
};

module.exports = {
  authenticateToken,
  requirePremium,
};
