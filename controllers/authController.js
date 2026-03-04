const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');
const { googleAuth, appleAuth, facebookAuth } = require('../services/oauthService');

/**
 * Email/Password ile kayıt
 */
const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Email kontrolü
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, name, auth_provider, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, hashedPassword, name || null, 'email']
    );

    const userId = result.insertId;

    // Token'ları oluştur
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, refreshToken]
    );

    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        name: name || null,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Email/Password ile giriş
 */
const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Kullanıcıyı bul
    const [users] = await pool.execute(
      'SELECT id, email, password, name, is_active, is_premium FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Token'ları oluştur
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [user.id, refreshToken]
    );

    res.json({
      message: 'Sign in successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.is_premium,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Google ile giriş
 */
const signInWithGoogle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idToken, accessToken } = req.body;

    // Google token'ı doğrula
    const googleUser = await googleAuth.verifyToken(idToken);

    if (!googleUser) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    // Kullanıcıyı bul veya oluştur
    // Not: email alanı unique olduğu için auth_provider ne olursa olsun aynı e‑posta ile
    // ikinci kez insert yaparsak ER_DUP_ENTRY hatası alırız. O yüzden önce sadece email'e
    // göre arıyoruz; varsa mevcut kullanıcıyı kullanıyoruz.
    let [users] = await pool.execute(
      'SELECT id, email, name, is_premium, auth_provider FROM users WHERE email = ?',
      [googleUser.email]
    );

    let userId;
    if (users.length === 0) {
      // Yeni kullanıcı oluştur
      const [result] = await pool.execute(
        'INSERT INTO users (email, name, auth_provider, is_active, created_at) VALUES (?, ?, ?, 1, NOW())',
        [googleUser.email, googleUser.name || null, 'google']
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
      // Eğer daha önce farklı provider ile açılmışsa, auth_provider'ı güncelleyebiliriz (opsiyonel)
      if (users[0].auth_provider !== 'google') {
        await pool.execute(
          'UPDATE users SET auth_provider = ? WHERE id = ?',
          ['google', userId]
        );
      }
    }

    // Token'ları oluştur
    const accessTokenJWT = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, refreshToken]
    );

    res.json({
      message: 'Google sign in successful',
      accessToken: accessTokenJWT,
      refreshToken,
      user: {
        id: userId,
        email: googleUser.email,
        name: googleUser.name || null,
      },
    });
  } catch (error) {
    console.error('Google sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Apple ile giriş
 */
const signInWithApple = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identityToken, authorizationCode, email, fullName } = req.body;

    // Apple token'ı doğrula
    const appleUser = await appleAuth.verifyToken(identityToken);

    if (!appleUser) {
      return res.status(401).json({ message: 'Invalid Apple token' });
    }

    const userEmail = email || appleUser.email;
    // İsim: Öncelik sırası -> client'tan gelen fullName -> email'in @ öncesi
    let userName = fullName;
    if (!userName && userEmail) {
      userName = userEmail.split('@')[0];
    }

    // Kullanıcıyı bul veya oluştur
    let [users] = await pool.execute(
      'SELECT id, email, name, is_premium FROM users WHERE email = ? AND auth_provider = ?',
      [userEmail, 'apple']
    );

    let userId;
    if (users.length === 0) {
      // Yeni kullanıcı oluştur
      const [result] = await pool.execute(
        'INSERT INTO users (email, name, auth_provider, is_active, created_at) VALUES (?, ?, ?, 1, NOW())',
        [userEmail, userName || null, 'apple']
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
      // Eğer veritabanında isim boş ama elimizde bir isim varsa, bir kereye mahsus güncelle
      if (!users[0].name && userName) {
        await pool.execute(
          'UPDATE users SET name = ? WHERE id = ?',
          [userName, userId]
        );
        users[0].name = userName;
      }
    }

    // Token'ları oluştur
    const accessTokenJWT = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, refreshToken]
    );

    res.json({
      message: 'Apple sign in successful',
      accessToken: accessTokenJWT,
      refreshToken,
      user: {
        id: userId,
        email: userEmail,
        name: users[0]?.name || userName || null,
      },
    });
  } catch (error) {
    console.error('Apple sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Facebook ile giriş
 */
const signInWithFacebook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accessToken } = req.body;

    // Facebook token'ı doğrula
    const facebookUser = await facebookAuth.verifyToken(accessToken);

    if (!facebookUser) {
      return res.status(401).json({ message: 'Invalid Facebook token' });
    }

    // Kullanıcıyı bul veya oluştur
    let [users] = await pool.execute(
      'SELECT id, email, name, is_premium FROM users WHERE email = ? AND auth_provider = ?',
      [facebookUser.email, 'facebook']
    );

    let userId;
    if (users.length === 0) {
      // Yeni kullanıcı oluştur
      const [result] = await pool.execute(
        'INSERT INTO users (email, name, auth_provider, is_active, created_at) VALUES (?, ?, ?, 1, NOW())',
        [facebookUser.email, facebookUser.name || null, 'facebook']
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
    }

    // Token'ları oluştur
    const accessTokenJWT = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, refreshToken]
    );

    res.json({
      message: 'Facebook sign in successful',
      accessToken: accessTokenJWT,
      refreshToken,
      user: {
        id: userId,
        email: facebookUser.email,
        name: facebookUser.name || null,
      },
    });
  } catch (error) {
    console.error('Facebook sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Anonymous giriş
 */
const signInAnonymously = async (req, res) => {
  try {
    // Anonymous kullanıcı oluştur
    const [result] = await pool.execute(
      'INSERT INTO users (email, auth_provider, is_active, created_at) VALUES (?, ?, 1, NOW())',
      [`anonymous_${Date.now()}@fitgympro.com`, 'anonymous']
    );

    const userId = result.insertId;

    // Token'ları oluştur
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Refresh token'ı kaydet
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, refreshToken]
    );

    res.json({
      message: 'Anonymous sign in successful',
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: null,
        name: null,
      },
    });
  } catch (error) {
    console.error('Anonymous sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Token yenileme
 */
const refreshToken = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { refreshToken: token } = req.body;

    // Refresh token'ı doğrula
    const decoded = verifyToken(token, true);

    // Refresh token'ı veritabanında kontrol et
    const [tokens] = await pool.execute(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokenData = tokens[0];

    // Token süresi dolmuş mu kontrol et
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Yeni access token oluştur
    const newAccessToken = generateAccessToken(tokenData.user_id);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * Çıkış yap
 */
const signOut = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      // Refresh token'ı sil
      await pool.execute(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [token]
      );
    }

    res.json({ message: 'Sign out successful' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signUp,
  signIn,
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  signInAnonymously,
  refreshToken,
  signOut,
};
