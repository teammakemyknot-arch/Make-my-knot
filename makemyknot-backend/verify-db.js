const mongoose = require('mongoose');
require('dotenv').config();

async function verifyDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📍 Database URL:', process.env.MONGODB_URI);
    
    // Check database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('📚 Database Name:', dbName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check if we have any leads
    const Lead = require('./src/models/Lead');
    const leadsCount = await Lead.countDocuments();
    console.log('\n📊 Data Summary:');
    console.log(`  - Leads: ${leadsCount} records`);
    
    if (leadsCount > 0) {
      console.log('\n📝 Sample leads:');
      const sampleLeads = await Lead.find().limit(3).select('name email phone status leadScore createdAt');
      sampleLeads.forEach(lead => {
        console.log(`  - ${lead.name} (${lead.email}) - Score: ${lead.leadScore} - Status: ${lead.status}`);
      });
    }
    
    // Check for users
    try {
      const User = require('./src/models/User');
      const usersCount = await User.countDocuments();
      console.log(`  - Users: ${usersCount} records`);
    } catch (error) {
      console.log('  - Users: Collection may not exist yet');
    }
    
    // Check for notifications
    try {
      const AdminNotification = require('./src/models/AdminNotification');
      const notificationsCount = await AdminNotification.countDocuments();
      console.log(`  - Admin Notifications: ${notificationsCount} records`);
    } catch (error) {
      console.log('  - Admin Notifications: Collection may not exist yet');
    }
    
    // Check for questionnaire responses
    try {
      const QuestionnaireResponse = require('./src/models/QuestionnaireResponse');
      const questionnaireCount = await QuestionnaireResponse.countDocuments();
      console.log(`  - Questionnaire Responses: ${questionnaireCount} records`);
    } catch (error) {
      console.log('  - Questionnaire Responses: Collection may not exist yet');
    }
    
    console.log('\n🎉 Database verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check your MongoDB Atlas credentials');
      console.log('2. Ensure your IP is whitelisted in MongoDB Atlas');
      console.log('3. Verify the connection string in your .env file');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

verifyDatabase();
