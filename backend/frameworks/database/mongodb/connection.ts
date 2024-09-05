import { ENV_CONFIG } from '@config/env.config';
import mongoose from 'mongoose';

export const connectMongoDB = () => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
  }

  mongoose
    .connect(ENV_CONFIG.MONGO.URI, { maxPoolSize: 100 })
    .then(() => {})
    .catch((err) => console.log('Error connecting database: ' + err));

  mongoose.connection.on('connected', () => {
    console.info('Connected to MongoDB!');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected!');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`Error in MongoDB connection: ${error}`);
    mongoose.disconnect().catch((err) => {
      console.error(`Error disconnecting from MongoDB: ${err}`);
    });
  });

  mongoose.connection.on('disconnected', () => {
    console.error(
      `MongoDB disconnected! Reconnecting in ${
        ENV_CONFIG.MONGO.RECONNECT_INTERVAL / 1000
      }s...`,
    );
    setTimeout(() => connectMongoDB, 10000);
  });
};
