import { config } from 'dotenv';

config();

export default {
  port: process.env.PORT || 8080,
  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },
};
