const { sendWelcomeEmail } = require('./src/services/emailService');

async function testEmailService() {
  console.log('🧪 Testing email service...');
  
  try {
    await sendWelcomeEmail('test@example.com', 'Test User');
    console.log('✅ Email service test completed');
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
  }
  
  console.log('\n📋 Current email configuration:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'Not set');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
}

// Run the test
testEmailService();
