const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testExpiredEvents() {
  try {
    console.log('🧪 Testing Event Expiration Filtering...\n');
    
    // Fetch all events
    const res = await axios.get(`${API_URL}/api/events`);
    const events = res.data;
    
    console.log(`📊 Total Active Events Returned: ${events.length}\n`);
    
    console.log('Events:');
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name}`);
      console.log(`   Date: ${event.date}`);
      console.log(`   End Date: ${event.endDate || 'N/A'}`);
    });
    
    console.log('\n✅ If you see no events from the past, filtering is working!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testExpiredEvents();
