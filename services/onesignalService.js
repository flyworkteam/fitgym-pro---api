const OneSignal = require('onesignal-node');

// OneSignal client oluştur
const client = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID,
  process.env.ONESIGNAL_REST_API_KEY
);

/**
 * Push notification gönder
 */
const sendPushNotification = async ({
  playerIds = [],
  userIds = [],
  heading,
  content,
  data = {},
}) => {
  try {
    const notification = {
      headings: { en: heading },
      contents: { en: content },
      data,
    };

    // Player ID'ler varsa
    if (playerIds.length > 0) {
      notification.include_player_ids = playerIds;
    }

    // User ID'ler varsa
    if (userIds.length > 0) {
      notification.filters = [
        { field: 'tag', key: 'user_id', relation: '=', value: userIds[0] },
      ];
    }

    const response = await client.createNotification(notification);
    return response;
  } catch (error) {
    console.error('OneSignal push notification error:', error);
    throw error;
  }
};

/**
 * Tüm kullanıcılara push notification gönder
 */
const sendToAll = async ({ heading, content, data = {} }) => {
  try {
    const notification = {
      headings: { en: heading },
      contents: { en: content },
      data,
      included_segments: ['All'],
    };

    const response = await client.createNotification(notification);
    return response;
  } catch (error) {
    console.error('OneSignal send to all error:', error);
    throw error;
  }
};

/**
 * Kullanıcıya tag ekle
 */
const addUserTag = async (playerId, userId) => {
  try {
    await client.editDevice(playerId, {
      tags: { user_id: userId },
    });
  } catch (error) {
    console.error('OneSignal add user tag error:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  sendToAll,
  addUserTag,
};
