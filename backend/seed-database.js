const db = require('./config/database');

const samplePlans = [
  {
    nameoftheplace: 'Tokyo Adventure',
    fromdate: '2024-03-15',
    todate: '2024-03-22',
    budget: 2500,
    abouttheplace: 'Explore the vibrant culture and amazing food of Tokyo',
    is_published: true,
    imageurl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    rating: 4.8,
    views: 152,
    status: 'active'
  },
  {
    nameoftheplace: 'Paris Romance',
    fromdate: '2024-04-10',
    todate: '2024-04-17',
    budget: 3200,
    abouttheplace: 'A romantic getaway to the City of Light',
    is_published: true,
    imageurl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
    rating: 4.6,
    views: 89,
    status: 'planning'
  },
  {
    nameoftheplace: 'Bali Retreat',
    fromdate: '2024-05-01',
    todate: '2024-05-14',
    budget: 1800,
    abouttheplace: 'Peaceful retreat in tropical paradise',
    is_published: false,
    imageurl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
    rating: 4.9,
    views: 203,
    status: 'completed'
  },
  {
    nameoftheplace: 'Swiss Alps Explorer',
    fromdate: '2024-06-01',
    todate: '2024-06-10',
    budget: 2800,
    abouttheplace: 'Epic mountain adventure in Switzerland',
    is_published: true,
    imageurl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.7,
    views: 567,
    status: 'active'
  },
  {
    nameoftheplace: 'NYC Food Tour',
    fromdate: '2024-07-15',
    todate: '2024-07-20',
    budget: 2100,
    abouttheplace: 'Culinary journey through New York City',
    is_published: true,
    imageurl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    rating: 4.5,
    views: 423,
    status: 'planning'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // First, check if we have users to assign plans to
    const userCheck = await db.query('SELECT id FROM users LIMIT 5');
    if (userCheck.rows.length === 0) {
      console.log('❌ No users found. Please create users first.');
      return;
    }
    
    const userIds = userCheck.rows.map(row => row.id);
    console.log(`👥 Found ${userIds.length} users`);
    
    // Clear existing sample plans
    await db.query('DELETE FROM plans WHERE nameoftheplace LIKE ANY($1)', [
      ['Tokyo Adventure', 'Paris Romance', 'Bali Retreat', 'Swiss Alps Explorer', 'NYC Food Tour']
    ]);
    
    // Insert sample plans
    for (let i = 0; i < samplePlans.length; i++) {
      const plan = samplePlans[i];
      const userId = userIds[i % userIds.length]; // Distribute plans among users
      
      const insertQuery = `
        INSERT INTO plans (
          user_id, nameoftheplace, fromdate, todate, budget, 
          abouttheplace, is_published, imageurl, rating, views, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;
      
      const result = await db.query(insertQuery, [
        userId,
        plan.nameoftheplace,
        plan.fromdate,
        plan.todate,
        plan.budget,
        plan.abouttheplace,
        plan.is_published,
        plan.imageurl,
        plan.rating,
        plan.views,
        plan.status
      ]);
      
      console.log(`✅ Created plan "${plan.nameoftheplace}" with ID: ${result.rows[0].id}`);
    }
    
    console.log('🎉 Database seeded successfully!');
    
    // Show summary
    const totalPlans = await db.query('SELECT COUNT(*) as count FROM plans');
    const publishedPlans = await db.query('SELECT COUNT(*) as count FROM plans WHERE is_published = true');
    
    console.log(`📊 Total plans: ${totalPlans.rows[0].count}`);
    console.log(`🌍 Published plans: ${publishedPlans.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
