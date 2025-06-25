const mongoose = require('mongoose');
const User = require('./src/models/User');

// MongoDB connection string - update with your actual connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_rogue';

async function updateUserRole() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update the specific user to admin role
    const userEmail = 'iit2023018@iiita.ac.in'; // Email from the attachment
    
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { 
        role: 'admin'
      },
      { 
        new: true, 
        upsert: false 
      }
    );

    if (updatedUser) {
      console.log(`Successfully updated user role:`);
      console.log(`Email: ${updatedUser.email}`);
      console.log(`Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
      console.log(`Role: ${updatedUser.role}`);
      console.log(`Credits: ${updatedUser.credits}, Free Credits: ${updatedUser.freeCredits}`);
    } else {
      console.log('User not found');
    }

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateUserRole();
