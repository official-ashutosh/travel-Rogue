// Test script to verify authentication endpoints
const fetch = require('node-fetch');

async function testAuth() {
  console.log('🧪 Testing Authentication API endpoints...');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test signup
    console.log('1. Testing signup...');
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });
    
    if (signupRes.ok) {
      const signupResult = await signupRes.json();
      console.log('✅ Signup successful:', signupResult.user?.email);
    } else if (signupRes.status === 409) {
      console.log('⚠️ User already exists, trying signin instead');
    } else {
      console.log('❌ Signup failed:', signupRes.status, await signupRes.text());
    }
    
    // Test signin
    console.log('2. Testing signin...');
    const signinData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const signinRes = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signinData)
    });
    
    if (signinRes.ok) {
      const signinResult = await signinRes.json();
      console.log('✅ Signin successful:', signinResult.user?.email);
      
      // Get cookies from response
      const cookies = signinRes.headers.get('set-cookie');
      
      // Test me endpoint with cookies
      console.log('3. Testing me endpoint...');
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Cookie: cookies }
      });
      
      if (meRes.ok) {
        const meResult = await meRes.json();
        console.log('✅ Me endpoint working:', meResult.user?.email);
      } else {
        console.log('❌ Me endpoint failed:', meRes.status);
      }
    } else {
      console.log('❌ Signin failed:', signinRes.status, await signinRes.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the development server is running: npm run dev');
  }
}

testAuth();
