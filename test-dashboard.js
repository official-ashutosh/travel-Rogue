// Test script to verify dashboard and community plans functionality
const fetch = require('node-fetch');

async function testDashboardAPI() {
  console.log('🧪 Testing Dashboard API endpoints...');
  
  try {
    // Test community plans API
    console.log('1. Testing community plans API...');
    const communityRes = await fetch('http://localhost:3000/api/community-plans?limit=3');
    if (communityRes.ok) {
      const data = await communityRes.json();
      console.log('✅ Community plans API working:', data.plans?.length || 0, 'plans found');
    } else {
      console.log('❌ Community plans API failed:', communityRes.status);
    }
    
    // Test user plans API
    console.log('2. Testing user plans API...');
    const userRes = await fetch('http://localhost:3000/api/plans?userId=test-user-1');
    if (userRes.ok) {
      const data = await userRes.json();
      console.log('✅ User plans API working:', data.plans?.length || 0, 'plans found');
    } else {
      console.log('❌ User plans API failed:', userRes.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the development server is running: npm run dev');
  }
}

testDashboardAPI();
