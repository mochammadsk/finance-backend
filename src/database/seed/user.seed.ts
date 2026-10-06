import bcrypt from 'bcryptjs';
import { db } from '../index.js';
import { users } from '../schema/user.js';

export const seedUser = async () => {
  await db
    .insert(users)
    .values({
      userName: 'Ul',
      email: 'ul@email.com',
      password: await bcrypt.hash('123123', 10),
    })
    .onConflictDoNothing({
      target: users.email,
    });

  console.log('> User seeded');
};
