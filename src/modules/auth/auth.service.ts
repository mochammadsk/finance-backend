import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../../database/index.js';
import { users } from '../../database/schema/user.js';
import { generateAccessToken, generateRefreshToken } from '../../shared/helpers/jwt.helper.js';
import type { LoginInput } from './auth.schema.js';

export const authService = {
  async login(payload: LoginInput) {
    const [user] = await db.select().from(users).where(eq(users.email, payload.email));

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await generateAccessToken(tokenPayload);

    const refreshToken = await generateRefreshToken(tokenPayload);

    await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));

    return {
      accessToken,
      refreshToken,
    };
  },

  // async refresh(refreshToken: string) {
  //   const { payload } = await verifyRefreshToken(refreshToken);

  //   const user = await authRepository.findById(payload.userId as string);

  //   if (!user) {
  //     throw new Error('Unauthorized');
  //   }

  //   if (user.refreshToken !== refreshToken) {
  //     throw new Error('Invalid refresh token');
  //   }

  //   const tokenPayload = {
  //     userId: user.id,
  //     email: user.email,
  //   };

  //   const newAccessToken = await generateAccessToken(tokenPayload);

  //   const newRefreshToken = await generateRefreshToken(tokenPayload);

  //   await authRepository.updateRefreshToken(user.id, newRefreshToken);

  //   return {
  //     accessToken: newAccessToken,
  //     refreshToken: newRefreshToken,
  //   };
  // },

  // async logout(userId: string) {
  //   await authRepository.updateRefreshToken(userId, null);
  // },
};
