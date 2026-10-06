import type { Context, Next } from 'hono';
import { verifyAccessToken } from '../shared/helpers/jwt.helper.js';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('authorization');

    if (!authHeader) {
      return c.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        401
      );
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return c.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        401
      );
    }

    const { payload } = await verifyAccessToken(token);

    c.set('user', payload);

    await next();
  } catch {
    return c.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      401
    );
  }
};
