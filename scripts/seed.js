import { seedDatabase } from '../src/lib/seed.js';

async function runSeed() {
    try {
        console.log('🌱 Starting database seeding process...');

        const stats = await seedDatabase();

        console.log('\n✅ Seeding completed successfully!');
        console.log('📊 Stats:');
        console.log(`   - Categories: ${stats.categories}`);
        console.log(`   - Users: ${stats.users}`);
        console.log(`   - Code Examples: ${stats.codeExamples}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

runSeed();
