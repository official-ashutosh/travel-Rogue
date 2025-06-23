// MongoDB initialization script
db = db.getSiblingDB('travel-planner-ai');

// Create collections with initial indexes
db.createCollection('users');
db.users.createIndex({ "userId": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

db.createCollection('plans');
db.plans.createIndex({ "userId": 1 });
db.plans.createIndex({ "nameoftheplace": "text", "userPrompt": "text" });
db.plans.createIndex({ "isPublic": 1, "createdAt": -1 });

db.createCollection('expenses');
db.expenses.createIndex({ "planId": 1, "date": 1 });
db.expenses.createIndex({ "userId": 1, "createdAt": -1 });

db.createCollection('payments');
db.payments.createIndex({ "paymentId": 1 }, { unique: true });
db.payments.createIndex({ "email": 1, "createdAt": -1 });

db.createCollection('invites');
db.invites.createIndex({ "planId": 1, "email": 1 }, { unique: true });
db.invites.createIndex({ "token": 1 }, { unique: true });

db.createCollection('access');
db.access.createIndex({ "planId": 1, "userId": 1 }, { unique: true });

db.createCollection('feedback');
db.feedback.createIndex({ "userId": 1, "createdAt": -1 });
db.feedback.createIndex({ "label": 1, "status": 1 });

db.createCollection('plansettings');
db.plansettings.createIndex({ "planId": 1, "userId": 1 }, { unique: true });

print('Database initialized with collections and indexes');
