import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import routes from './routes/index.js';

const app = new Hono();

app.use('*', logger());

app.use(
  '*',
  cors({
    origin: '*',
    credentials: true,
  })
);

// Health check
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'API running',
  });
});

// Routes
app.route('/api', routes);

export default app;
