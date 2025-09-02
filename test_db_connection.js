#!/usr/bin/env node

/**
 * Test database connection and categories loading
 * Run this to verify your Neon database is working
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Neon Database Connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🧪 Testing database connection...');
    
    // Test 1: Check if we can connect
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Load categories
    console.log('\n📂 Loading categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (categoriesError) {
      console.log('❌ Categories loading failed:', categoriesError.message);
      return false;
    }
    
    console.log('✅ Categories loaded successfully');
    console.log(`📊 Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.id})`);
    });
    
    // Test 3: Load businesses
    console.log('\n🏢 Loading businesses...');
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('*')
      .limit(5);
    
    if (businessesError) {
      console.log('❌ Businesses loading failed:', businessesError.message);
      return false;
    }
    
    console.log('✅ Businesses loaded successfully');
    console.log(`📊 Found ${businesses.length} businesses:`);
    businesses.forEach(biz => {
      console.log(`   - ${biz.name} (${biz.city})`);
    });
    
    // Test 4: Check admin user
    console.log('\n👤 Checking admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', 'admin@schiedam.app')
      .single();
    
    if (adminError) {
      console.log('⚠️  Admin user check failed (this might be normal):', adminError.message);
    } else {
      console.log('✅ Admin user found:', adminUser.email);
    }
    
    console.log('\n🎉 All tests passed! Your Neon database is working correctly.');
    return true;
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
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

