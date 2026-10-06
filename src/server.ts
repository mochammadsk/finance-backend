import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import app from './app.js';
import { closeDatabase, connectDatabase } from './database/index.js';

dotenv.config({
  quiet: true,
});

const port = Number(process.env.PORT);

const startServer = async () => {
  try {
    await connectDatabase();

    console.log('> Database connected');

    serve({
      fetch: app.fetch,
      port,
    });

    console.log(`> Server running on port ${port}`);
  } catch (error) {
    console.error('! Failed to start server:', error);

    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('> Shutting down server...');

  try {
    await closeDatabase();

    console.log('> Database connection closed');
  } catch (error) {
    console.error('! Failed to close database connection:', error);
  }

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
