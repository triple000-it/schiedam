-- =====================================================
-- Authentication Fix for Schiedam.app
-- Add proper user authentication and admin user
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- AUTHENTICATION TABLES
-- =====================================================

-- Create auth.users table (Supabase compatible)
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID,
    aud VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMP WITH TIME ZONE,
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phone VARCHAR(15),
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    phone_change VARCHAR(15),
    phone_change_token VARCHAR(255),
    phone_change_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    email_change_token_current VARCHAR(255),
    email_change_confirm_status SMALLINT,
    banned_until TIMESTAMP WITH TIME ZONE,
    reauthentication_token VARCHAR(255),
    reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
    is_sso_user BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.identities table
CREATE TABLE IF NOT EXISTS auth.identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id VARCHAR(255) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    identity_data JSONB NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider_id, provider_user_id)
);

-- Create auth.sessions table
CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    factor_id UUID,
    aal VARCHAR(255),
    not_after TIMESTAMP WITH TIME ZONE,
    refreshed_at TIMESTAMP WITH TIME ZONE,
    user_agent TEXT,
    ip INET,
    tag TEXT
);

-- =====================================================
-- ENUMS (if not already created)
-- =====================================================

-- User roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'eigenaar', 'bezoeker');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- UPDATE PROFILES TABLE
-- =====================================================

-- Add auth_user_id column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'auth_user_id') THEN
        ALTER TABLE profiles ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================

-- Create admin user in auth.users table
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    aud,
    role
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@schiedam.app',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Schiedam Admin"}',
    true,
    'authenticated',
    'authenticated'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmed_at = EXCLUDED.confirmed_at,
    updated_at = NOW(),
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    is_super_admin = EXCLUDED.is_super_admin;

-- Create admin profile
INSERT INTO profiles (
    id,
    auth_user_id,
    role,
    email,
    full_name,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@schiedam.app',
    'Schiedam Admin',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    role = EXCLUDED.role,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- =====================================================
-- INDEXES FOR AUTH TABLES
-- =====================================================

-- Auth users indexes
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_instance_id ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_created_at ON auth.users(created_at);

-- Auth identities indexes
CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON auth.identities(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_identities_provider_id ON auth.identities(provider_id);

-- Auth sessions indexes
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_not_after ON auth.sessions(not_after);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);

-- =====================================================
-- ROW LEVEL SECURITY FOR AUTH TABLES
-- =====================================================

-- Enable RLS on auth tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

-- Auth users policies
CREATE POLICY "Users can view their own user record" ON auth.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own user record" ON auth.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON auth.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Auth identities policies
CREATE POLICY "Users can view their own identities" ON auth.identities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own identities" ON auth.identities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auth sessions policies
CREATE POLICY "Users can view their own sessions" ON auth.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON auth.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON auth.sessions FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- AUTH FUNCTIONS
-- =====================================================

-- Function to get current user
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE SQL STABLE
AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claim.sub', true),
        (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    )::UUID
$$;

-- Function to get current user role
CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claim.role', true),
        (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
    )::TEXT
$$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify admin user was created
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.is_super_admin,
    p.role as profile_role,
    p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.auth_user_id
WHERE u.email = 'admin@schiedam.app';

-- Verify password can be checked
SELECT 
    email,
    encrypted_password = crypt('Admin123!', encrypted_password) as password_match
FROM auth.users 
WHERE email = 'admin@schiedam.app';

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- Admin user credentials:
-- Email: admin@schiedam.app
-- Password: Admin123!
-- Role: admin
-- ID: 00000000-0000-0000-0000-000000000001

-- This script:
-- ✅ Creates proper authentication tables
-- ✅ Creates admin user with password
-- ✅ Links auth user to profile
-- ✅ Sets up proper permissions
-- ✅ Adds necessary indexes
-- ✅ Configures Row Level Security

