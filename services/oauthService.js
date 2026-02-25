const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const appleSignin = require('apple-signin-auth');

/**
 * Google OAuth Service
 */
const googleAuth = {
  client: new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  ),

  async verifyToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      return null;
    }
  },
};

/**
 * Apple OAuth Service
 */
const appleAuth = {
  async verifyToken(identityToken) {
    try {
      if (!identityToken) {
        return null;
      }

      const clientId = process.env.APPLE_CLIENT_ID;
      if (!clientId) {
        console.error('APPLE_CLIENT_ID env tanımlı değil.');
        return null;
      }

      // Apple identityToken'ı Apple'ın public key'leri ile doğrula
      const payload = await appleSignin.verifyIdToken(identityToken, {
        audience: clientId,
        ignoreExpiration: false,
      });

      return {
        email: payload.email,
        sub: payload.sub,
      };
    } catch (error) {
      console.error('Apple token verification error:', error);
      return null;
    }
  },
};

/**
 * Facebook OAuth Service
 */
const facebookAuth = {
  async verifyToken(accessToken) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
      );

      if (response.data && response.data.id) {
        return {
          email: response.data.email,
          name: response.data.name,
          id: response.data.id,
        };
      }
      return null;
    } catch (error) {
      console.error('Facebook token verification error:', error);
      return null;
    }
  },
};

module.exports = {
  googleAuth,
  appleAuth,
  facebookAuth,
};
