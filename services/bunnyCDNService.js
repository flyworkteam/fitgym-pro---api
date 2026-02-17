const axios = require('axios');

/**
 * Bunny CDN Service
 * Video ve görüntü yükleme işlemleri
 */
const bunnyCDNService = {
  baseUrl: `https://${process.env.BUNNY_CDN_PULL_ZONE}`,
  storageUrl: `https://storage.bunnycdn.com/${process.env.BUNNY_CDN_STORAGE_ZONE}`,
  apiKey: process.env.BUNNY_CDN_API_KEY,
  username: process.env.BUNNY_CDN_USERNAME,

  /**
   * Dosya yükle
   */
  async uploadFile(filePath, fileName, fileBuffer) {
    try {
      const url = `${this.storageUrl}/${fileName}`;
      
      const response = await axios.put(url, fileBuffer, {
        headers: {
          AccessKey: this.apiKey,
          'Content-Type': 'application/octet-stream',
        },
      });

      return {
        success: true,
        url: `${this.baseUrl}/${fileName}`,
      };
    } catch (error) {
      console.error('Bunny CDN upload error:', error);
      throw error;
    }
  },

  /**
   * Dosya sil
   */
  async deleteFile(fileName) {
    try {
      const url = `${this.storageUrl}/${fileName}`;
      
      await axios.delete(url, {
        headers: {
          AccessKey: this.apiKey,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Bunny CDN delete error:', error);
      throw error;
    }
  },

  /**
   * Video URL'i oluştur
   */
  getVideoUrl(videoId) {
    return `${this.baseUrl}/videos/${videoId}`;
  },

  /**
   * Görüntü URL'i oluştur
   */
  getImageUrl(imageName) {
    return `${this.baseUrl}/images/${imageName}`;
  },
};

module.exports = bunnyCDNService;
