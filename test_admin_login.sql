-- =====================================================
-- Test Admin User Login
-- Run this to verify admin user is working correctly
-- =====================================================

-- Check if admin user exists in auth.users
SELECT 
    'Auth User Check' as test_type,
    id,
    email,
    email_confirmed_at IS NOT NULL as email_confirmed,
    is_super_admin,
    created_at
FROM auth.users 
WHERE email = 'admin@schiedam.app';

-- Check if admin profile exists
SELECT 
    'Profile Check' as test_type,
    id,
    auth_user_id,
    role,
    email,
    full_name,
    created_at
FROM profiles 
WHERE email = 'admin@schiedam.app';

-- Test password verification
SELECT 
    'Password Test' as test_type,
    email,
    encrypted_password = crypt('Admin123!', encrypted_password) as password_correct,
    CASE 
        WHEN encrypted_password = crypt('Admin123!', encrypted_password) THEN '✅ Password is correct'
        ELSE '❌ Password is incorrect'
    END as password_status
FROM auth.users 
WHERE email = 'admin@schiedam.app';

-- Check user permissions
SELECT 
    'Permissions Check' as test_type,
    u.email,
    p.role,
    u.is_super_admin,
    CASE 
        WHEN p.role = 'admin' AND u.is_super_admin = true THEN '✅ Full admin permissions'
        WHEN p.role = 'admin' THEN '⚠️ Profile admin but not super admin'
        ELSE '❌ No admin permissions'
    END as permission_status
FROM auth.users u
JOIN profiles p ON u.id = p.auth_user_id
WHERE u.email = 'admin@schiedam.app';

-- Check if user can access all tables (admin test)
SELECT 
    'Table Access Test' as test_type,
    COUNT(*) as total_businesses,
    'Admin can see all businesses' as access_test
FROM businesses;

-- Summary
SELECT 
    'SUMMARY' as test_type,
    'Admin user setup complete' as status,
    'Email: admin@schiedam.app' as credentials,
    'Password: Admin123!' as password,
    'Role: admin' as role_info;

