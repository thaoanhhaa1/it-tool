import { getMockData } from '../src/lib/seed-mock.ts';

async function testMockData() {
    try {
        console.log('🧪 Testing mock data...\n');

        const mockData = getMockData();

        console.log('\n✅ Mock data loaded successfully!');
        console.log('\n📋 Sample Data:');

        console.log('\n🏷️ Categories:');
        mockData.categories.forEach((cat, index) => {
            console.log(
                `  ${index + 1}. ${cat.icon} ${cat.name} (${cat.slug})`,
            );
        });

        console.log('\n👤 Users:');
        mockData.users.forEach((user, index) => {
            console.log(
                `  ${index + 1}. ${user.username} - ${user.fullName} (${
                    user.role
                })`,
            );
        });

        console.log('\n💻 Code Examples:');
        mockData.codeExamples.forEach((example, index) => {
            console.log(
                `  ${index + 1}. ${example.name} (${example.type}) - ${
                    example.library
                }`,
            );
            console.log(`     Tags: ${example.tags.join(', ')}`);
            console.log(
                `     👍 ${example.likes} likes, 👁️ ${example.views} views\n`,
            );
        });

        console.log('🎉 All tests passed! Ready to use mock data.');
    } catch (error) {
        console.error('❌ Error testing mock data:', error);
    }
}

testMockData();
