const { User, Plan } = require('./src/models');

async function testAssociations() {
  console.log('🔍 Testing Sequelize associations...');
  
  try {
    // Test Plan with User association
    console.log('\n📋 Testing Plan with User association...');
    const plansWithUsers = await Plan.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'userId']
      }],
      limit: 5
    });
    
    console.log(`✅ Found ${plansWithUsers.length} plans with users`);
    
    if (plansWithUsers.length > 0) {
      plansWithUsers.forEach((plan, index) => {
        console.log(`  Plan ${index + 1}: "${plan.nameoftheplace}" by ${plan.user?.firstName || 'Unknown'} ${plan.user?.lastName || ''} (${plan.user?.email || 'no email'})`);
      });
    }
    
    // Test User with Plans association
    console.log('\n👤 Testing User with Plans association...');
    const usersWithPlans = await User.findAll({
      include: [{
        model: Plan,
        as: 'plans',
        attributes: ['nameoftheplace', 'status', 'createdAt']
      }],
      limit: 3
    });
    
    console.log(`✅ Found ${usersWithPlans.length} users with plans`);
    
    if (usersWithPlans.length > 0) {
      usersWithPlans.forEach((user, index) => {
        console.log(`  User ${index + 1}: ${user.firstName || 'Unknown'} ${user.lastName || ''} has ${user.plans?.length || 0} plans`);
      });
    }
    
    console.log('\n🎉 Association tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Association test failed:', error.message);
    console.error('Full error:', error);
  }
  
  process.exit(0);
}

testAssociations();
