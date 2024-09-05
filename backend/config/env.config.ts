export const ENV_CONFIG = {
  PORT: process.env.PORT || 3000,
  IP: process.env.HOST || '0.0.0.0',
  MONGO: {
    URI: process.env.MONGO_URL || 'mongodb://localhost:27017',
    RECONNECT_INTERVAL: 10000,
  },
  REDIS: {
    URI: process.env.REDIS_URL || 'redis://localhost:6379',
  },
};
