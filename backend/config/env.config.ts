export const ENV_CONFIG = {
  PORT: process.env.PORT || 3000,
  IP: process.env.HOST || '0.0.0.0',
  MONGO: {
    URI: process.env.MONGO_URL || 'mongodb://localhost:27017',
    RECONNECT_INTERVAL: Number(process.env.MONGO_RECONNECT_INTERVAL) || 3000,
  },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3006',
  ORIGIN: process.env.ORIGIN?.split(',') || ['http://localhost:3006'],
};
