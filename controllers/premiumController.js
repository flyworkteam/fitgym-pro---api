const pool = require('../config/database');

/**
 * GET /api/v1/premium/status
 * Premium durumunu kontrol et (users tablosundan okur)
 */
exports.checkPremiumStatus = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT is_premium, premium_expires_at FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = rows[0];
    const isPremium = !!user.is_premium;
    const expiresAt = user.premium_expires_at;
    res.json({
      isPremium,
      expiresAt: expiresAt || null,
    });
  } catch (error) {
    console.error('checkPremiumStatus error:', error);
    res.status(500).json({ message: 'Premium durumu alınırken bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/premium/packages
 * Premium paketlerini getir (şimdilik statik liste)
 */
exports.getPremiumPackages = async (req, res) => {
  try {
    res.json({
      packages: [
        { id: 'premium_monthly', name: 'Aylık', price: '₺99,99', duration: '1 month' },
        { id: 'premium_yearly', name: 'Yıllık', price: '₺799,99', duration: '1 year' },
      ],
    });
  } catch (error) {
    console.error('getPremiumPackages error:', error);
    res.status(500).json({ message: 'Paketler alınırken bir hata oluştu.' });
  }
};

/**
 * POST /api/v1/premium/purchase
 * Premium satın alma işlemini başlat (şimdilik stub)
 */
exports.purchasePremium = async (req, res) => {
  try {
    const { packageId, platform } = req.body || {};
    res.status(201).json({
      message: 'Satın alma işlemi uygulama içi ödeme ile tamamlanacak.',
      packageId: packageId || null,
      platform: platform || null,
    });
  } catch (error) {
    console.error('purchasePremium error:', error);
    res.status(500).json({ message: 'Satın alma başlatılırken bir hata oluştu.' });
  }
};

/**
 * POST /api/v1/premium/verify
 * Purchase verify (RevenueCat webhook vb.)
 */
exports.verifyPurchase = async (req, res) => {
  try {
    res.json({ message: 'Doğrulama işlemi henüz entegre edilmedi.' });
  } catch (error) {
    console.error('verifyPurchase error:', error);
    res.status(500).json({ message: 'Doğrulama sırasında bir hata oluştu.' });
  }
};

/**
 * POST /api/v1/premium/cancel
 * Aboneliği iptal et
 */
exports.cancelSubscription = async (req, res) => {
  try {
    res.json({ message: 'İptal işlemi uygulama içi abonelik yönetimi ile yapılacak.' });
  } catch (error) {
    console.error('cancelSubscription error:', error);
    res.status(500).json({ message: 'İptal işlemi sırasında bir hata oluştu.' });
  }
};

/**
 * GET /api/v1/premium/history
 * Abonelik geçmişini getir
 */
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, package_id, platform, status, started_at, expires_at, cancelled_at, created_at 
       FROM premium_subscriptions WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({
      history: rows.map((r) => ({
        id: r.id,
        packageId: r.package_id,
        platform: r.platform,
        status: r.status,
        startedAt: r.started_at,
        expiresAt: r.expires_at,
        cancelledAt: r.cancelled_at,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('getSubscriptionHistory error:', error);
    res.status(500).json({ message: 'Abonelik geçmişi alınırken bir hata oluştu.' });
  }
};

/**
 * POST /api/v1/premium/restore
 * Restore purchases (iOS)
 */
exports.restorePurchases = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT is_premium, premium_expires_at FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = rows[0];
    res.json({
      restored: !!user.is_premium,
      isPremium: !!user.is_premium,
      expiresAt: user.premium_expires_at || null,
    });
  } catch (error) {
    console.error('restorePurchases error:', error);
    res.status(500).json({ message: 'Geri yükleme sırasında bir hata oluştu.' });
  }
};
