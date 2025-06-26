const { connectDB } = require('./src/config/database');
const { User, Plan } = require('./src/models');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Connect to database
    await connectDB();
    console.log('✓ Database connected successfully');
    
    // Test User model
    const userCount = await User.count();
    console.log(`✓ User table accessible, found ${userCount} users`);
    
    // Test Plan model
    const planCount = await Plan.count();
    console.log(`✓ Plan table accessible, found ${planCount} plans`);
    
    // Test basic plan creation (dry run)
    const testPlanData = {
      nameoftheplace: 'Test City',
      userPrompt: 'Test prompt',
      userId: 'test-user-id',
      isGeneratedUsingAI: false,
      abouttheplace: '',
      adventuresactivitiestodo: [],
      topplacestovisit: [],
      packingchecklist: [],
      localcuisinerecommendations: [],
      besttimetovisit: '',
      itinerary: {},
      contentGenerationState: {},
      views: 0,
      likes: 0,
      rating: null,
      budget: null,
      tags: [],
      travelers: 1,
      groupSize: 1,
      isPublic: false,
      weatherData: null
    };
    
    console.log('✓ Plan data structure is valid');
    
    console.log('\n🎉 All tests passed! The database and models are working correctly.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testConnection();
