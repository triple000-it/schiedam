#!/usr/bin/env node

/**
 * Migration script to update Supabase configuration for Neon database
 * Run this script after setting up your Neon database
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Migrating Schiedam.app to Neon Database...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found. Creating template...');
  
  const envTemplate = `# Neon Database Configuration
# Replace these with your actual Neon database credentials

# Option 1: Using Supabase-compatible connection
NEXT_PUBLIC_SUPABASE_URL=your_neon_connection_string_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_neon_anon_key_here

# Option 2: Direct PostgreSQL connection (if not using Supabase client)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Example:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.neon.tech
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('📝 Please update .env.local with your Neon database credentials\n');
} else {
  console.log('✅ .env.local file found');
}

// Update package.json scripts if needed
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add database migration script if it doesn't exist
  if (!packageJson.scripts['db:migrate']) {
    packageJson.scripts['db:migrate'] = 'node migrate-to-neon.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added db:migrate script to package.json');
  }
}

// Check if database_schema.sql exists
const schemaPath = path.join(process.cwd(), 'database_schema.sql');
if (fs.existsSync(schemaPath)) {
  console.log('✅ database_schema.sql found');
} else {
  console.log('❌ database_schema.sql not found');
  console.log('   Please ensure the SQL schema file is in the project root');
}

// Check if DATABASE_SETUP.md exists
const setupPath = path.join(process.cwd(), 'DATABASE_SETUP.md');
if (fs.existsSync(setupPath)) {
  console.log('✅ DATABASE_SETUP.md found');
} else {
  console.log('❌ DATABASE_SETUP.md not found');
}

console.log('\n📋 Next Steps:');
console.log('1. Set up your Neon database at https://console.neon.tech/');
console.log('2. Update .env.local with your Neon credentials');
console.log('3. Run the database_schema.sql in your Neon SQL editor');
console.log('4. Test your application connection');
console.log('5. Review DATABASE_SETUP.md for detailed instructions');

console.log('\n🔑 Admin User Credentials:');
console.log('Email: admin@schiedam.app');
console.log('Role: admin');
console.log('ID: 00000000-0000-0000-0000-000000000001');

console.log('\n✨ Migration setup complete!');
console.log('📖 Read DATABASE_SETUP.md for detailed instructions');

