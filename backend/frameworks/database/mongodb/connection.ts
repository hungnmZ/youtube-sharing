import { ENV_CONFIG } from '@config/env.config';
import mongoose from 'mongoose';

const connectMongoDB = () => {
  mongoose
    .connect(ENV_CONFIG.MONGO.URI, {
      maxPoolSize: 100,
    })
    .catch((err) => {
      console.error('Error connecting MongoDB: ' + err);
      console.info(
        `MongoDB reconnecting in ${ENV_CONFIG.MONGO.RECONNECT_INTERVAL / 1000}s`,
      );
      setTimeout(connectMongoDB, ENV_CONFIG.MONGO.RECONNECT_INTERVAL);
    });
};

export const initMongoDB = () => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
  }

  connectMongoDB();

  mongoose.connection.on('connected', () => {
    console.info('Connected to MongoDB!');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected!');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`Error in MongoDB connection: ${error}`);
    mongoose
      .disconnect()
      .catch((err) => console.error(`Error disconnecting from MongoDB: ${err}`));
  });

  mongoose.connection.on('disconnected', () => {
    console.error(`MongoDB disconnected!`);
  });
};
