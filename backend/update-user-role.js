const { connectDB, closeConnection } = require('./src/config/database');
const User = require('./src/models/User');

async function updateUserRole() {
  try {
    // Connect to PostgreSQL
    await connectDB();
    console.log('Connected to PostgreSQL');

    // Update the specific user to admin role
    const userEmail = 'iit2023018@iiita.ac.in'; // Email from the attachment
    
    const user = await User.findOne({ where: { email: userEmail } });

    if (user) {
      await user.update({ role: 'admin' });
      console.log(`Successfully updated user role:`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      console.log(`Credits: ${user.credits}, Free Credits: ${user.freeCredits}`);
    } else {
      console.log('User not found');
    }

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await closeConnection();
    console.log('Disconnected from PostgreSQL');
  }
}

// Run the update
updateUserRole();
