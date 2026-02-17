const jwt = require('jsonwebtoken');

/**
 * Access token oluştur
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Refresh token oluştur
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

/**
 * Token'ı doğrula
 */
const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh 
    ? process.env.JWT_REFRESH_SECRET 
    : process.env.JWT_SECRET;
  
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
