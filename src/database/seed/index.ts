import { seedUser } from './user.seed.js';

const seed = async () => {
  try {
    await seedUser();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
