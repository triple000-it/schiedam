#!/usr/bin/env node

/**
 * Test PostgreSQL connection directly
 * Run this to verify your Neon database connection works
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_tVL5pZeSn2RB@ep-old-thunder-agajgkrc-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('🔍 Testing PostgreSQL Connection to Neon...\n');

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('🧪 Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Test 2: Check if tables exist
    console.log('\n📋 Checking database tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Found tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Test 3: Load categories
    console.log('\n📂 Loading categories...');
    const categoriesResult = await client.query('SELECT * FROM categories ORDER BY name');
    console.log(`✅ Found ${categoriesResult.rows.length} categories:`);
    categoriesResult.rows.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.id})`);
    });
    
    // Test 4: Load businesses
    console.log('\n🏢 Loading businesses...');
    const businessesResult = await client.query('SELECT * FROM businesses LIMIT 5');
    console.log(`✅ Found ${businessesResult.rows.length} businesses:`);
    businessesResult.rows.forEach(biz => {
      console.log(`   - ${biz.name} (${biz.city})`);
    });
    
    // Test 5: Check admin user
    console.log('\n👤 Checking admin user...');
    const adminResult = await client.query(`
      SELECT u.email, u.email_confirmed_at, p.role, p.full_name
      FROM auth.users u
      LEFT JOIN profiles p ON u.id = p.auth_user_id
      WHERE u.email = 'admin@schiedam.app'
    `);
    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log('✅ Admin user found:');
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - Name: ${admin.full_name}`);
      console.log(`   - Confirmed: ${admin.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Test 6: Test complex query (businesses with categories)
    console.log('\n🔗 Testing complex query (businesses with categories)...');
    const complexResult = await client.query(`
      SELECT 
        b.name as business_name,
        c.name as category_name,
        COUNT(r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN reviews r ON b.id = r.business_id
      GROUP BY b.id, b.name, c.name
      ORDER BY b.name
      LIMIT 5
    `);
    
    console.log('✅ Complex query successful:');
    complexResult.rows.forEach(row => {
      console.log(`   - ${row.business_name} (${row.category_name}) - ${row.review_count} reviews, ${row.avg_rating.toFixed(1)} avg rating`);
    });
    
    client.release();
    
    console.log('\n🎉 All PostgreSQL tests passed!');
    console.log('✅ Your Neon database is working correctly');
    console.log('🚀 You can now use the PostgreSQL client in your app');
    
    return true;
    
  } catch (error) {
    console.log('❌ PostgreSQL connection failed:', error.message);
    console.log('📖 Check your DATABASE_URL in .env.local');
    return false;
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ Database setup is complete!');
    console.log('🚀 You can now run your application with: npm run dev');
  } else {
    console.log('\n❌ Database setup needs attention.');
    console.log('📖 Check the error messages above and fix any issues.');
    process.exit(1);
  }
});

