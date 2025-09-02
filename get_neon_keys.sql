-- =====================================================
-- Get Neon API Keys for Supabase Client
-- Run this in your Neon SQL editor to get the correct keys
-- =====================================================

-- Check if we have the necessary tables
SELECT 
    'Database Check' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') 
        THEN '✅ Categories table exists'
        ELSE '❌ Categories table missing'
    END as categories_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auth_users') 
        THEN '✅ Auth users table exists'
        ELSE '❌ Auth users table missing'
    END as auth_status;

-- Check categories data
SELECT 
    'Categories Data' as info,
    COUNT(*) as total_categories,
    STRING_AGG(name, ', ') as category_names
FROM categories;

-- Check admin user
SELECT 
    'Admin User Check' as info,
    u.email,
    u.email_confirmed_at IS NOT NULL as confirmed,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.auth_user_id
WHERE u.email = 'admin@schiedam.app';

-- Generate API keys (these are examples - you'll need to get real ones from Neon)
SELECT 
    'API Keys Info' as info,
    'You need to get these from your Neon dashboard:' as message,
    '1. Go to your Neon project dashboard' as step1,
    '2. Go to Settings > API Keys' as step2,
    '3. Create a new API key with appropriate permissions' as step3,
    '4. Use that key in your .env.local file' as step4;

-- Test database connection
SELECT 
    'Connection Test' as info,
    NOW() as current_time,
    current_database() as database_name,
    current_user as current_user,
    '✅ Database connection working' as status;

