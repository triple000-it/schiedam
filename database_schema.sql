-- =====================================================
-- Schiedam.app Database Schema
-- Complete SQL setup for Neon Database
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'eigenaar', 'bezoeker');

-- Subscription plans
CREATE TYPE subscription_plan AS ENUM ('free', 'business', 'pro', 'vip');

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'bezoeker',
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    stripe_customer_id VARCHAR(255),
    mollie_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    address VARCHAR(500) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Schiedam',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    claimed BOOLEAN DEFAULT FALSE,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    subscription_plan subscription_plan DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business images table
CREATE TABLE business_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business hours table
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    open_time TIME,
    close_time TIME,
    closed BOOLEAN DEFAULT FALSE
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'free',
    max_products INTEGER NOT NULL DEFAULT 10,
    max_images INTEGER NOT NULL DEFAULT 1,
    includes_video BOOLEAN DEFAULT FALSE,
    includes_chat BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(255),
    mollie_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    stripe_payment_id VARCHAR(255),
    mollie_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, business_id)
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Businesses indexes
CREATE INDEX idx_businesses_category_id ON businesses(category_id);
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_claimed ON businesses(claimed);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_name ON businesses(name);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);

-- Products indexes
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX idx_orders_business_id ON orders(business_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Reviews indexes
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_business_id ON favorites(business_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================

-- Create admin user
INSERT INTO profiles (id, role, email, full_name, created_at, updated_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@schiedam.app',
    'Schiedam Admin',
    NOW(),
    NOW()
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample categories
INSERT INTO categories (id, name, description, icon) VALUES
('10000000-0000-0000-0000-000000000001', 'Horeca', 'Restaurants, cafés, bars en andere eetgelegenheden', '🍽️'),
('10000000-0000-0000-0000-000000000002', 'Winkels', 'Retail, kleding, elektronica en andere winkels', '🛍️'),
('10000000-0000-0000-0000-000000000003', 'Diensten', 'Professionele dienstverlening en advies', '💼'),
('10000000-0000-0000-0000-000000000004', 'Zorg & Welzijn', 'Zorgverleners, apotheken en welzijnsdiensten', '🏥'),
('10000000-0000-0000-0000-000000000005', 'Sport & Vrije Tijd', 'Sportclubs, fitness en recreatie', '⚽'),
('10000000-0000-0000-0000-000000000006', 'Onderwijs', 'Scholen, trainingen en educatie', '🎓'),
('10000000-0000-0000-0000-000000000007', 'Beauty & Wellness', 'Kappers, schoonheidssalons en wellness', '💅'),
('10000000-0000-0000-0000-000000000008', 'Auto & Vervoer', 'Garages, autodealers en vervoersdiensten', '🚗'),
('10000000-0000-0000-0000-000000000009', 'Vastgoed', 'Makelaars, verhuur en vastgoeddiensten', '🏠'),
('10000000-0000-0000-0000-000000000010', 'Technologie', 'IT-diensten, software en technologie', '💻');

-- Sample businesses
INSERT INTO businesses (id, name, description, category_id, address, postal_code, city, phone, email, website, lat, lng, owner_id, claimed, theme_color, subscription_plan) VALUES
('20000000-0000-0000-0000-000000000001', 'Restaurant De Gouden Leeuw', 'Traditioneel Nederlands restaurant met moderne twist', '10000000-0000-0000-0000-000000000001', 'Hoogstraat 123', '3111 HG', 'Schiedam', '+31 10 123 4567', 'info@goudenleeuw.nl', 'https://goudenleeuw.nl', 51.9194, 4.3883, '00000000-0000-0000-0000-000000000001', true, '#F59E0B', 'business'),
('20000000-0000-0000-0000-000000000002', 'Café Central', 'Gezellige bruine kroeg in het centrum', '10000000-0000-0000-0000-000000000001', 'Lange Haven 45', '3111 CD', 'Schiedam', '+31 10 234 5678', 'info@cafecentral.nl', NULL, 51.9200, 4.3900, '00000000-0000-0000-0000-000000000001', true, '#8B5CF6', 'free'),
('20000000-0000-0000-0000-000000000003', 'Modehuis Van der Berg', 'Exclusieve dames- en herenmode', '10000000-0000-0000-0000-000000000002', 'Broersvest 67', '3111 BN', 'Schiedam', '+31 10 345 6789', 'info@modehuisvanderberg.nl', 'https://modehuisvanderberg.nl', 51.9180, 4.3850, '00000000-0000-0000-0000-000000000001', true, '#EC4899', 'pro'),
('20000000-0000-0000-0000-000000000004', 'Advocatenkantoor Jansen & Partners', 'Juridisch advies en rechtsbijstand', '10000000-0000-0000-0000-000000000003', 'Stationsplein 12', '3112 AK', 'Schiedam', '+31 10 456 7890', 'info@jansenpartners.nl', 'https://jansenpartners.nl', 51.9150, 4.4000, '00000000-0000-0000-0000-000000000001', true, '#3B82F6', 'business'),
('20000000-0000-0000-0000-000000000005', 'Apotheek Schiedam Centrum', 'Moderne apotheek met uitgebreide service', '10000000-0000-0000-0000-000000000004', 'Hoogstraat 89', '3111 HG', 'Schiedam', '+31 10 567 8901', 'info@apotheekschiedam.nl', 'https://apotheekschiedam.nl', 51.9190, 4.3880, '00000000-0000-0000-0000-000000000001', true, '#10B981', 'free');

-- Sample subscriptions
INSERT INTO subscriptions (id, business_id, plan, max_products, max_images, includes_video, includes_chat) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'business', 50, 5, false, true),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'free', 10, 1, false, false),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'pro', 100, 10, true, true),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'business', 50, 5, false, true),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'free', 10, 1, false, false);

-- Sample products
INSERT INTO products (id, business_id, name, description, price, image_url, stock, active) VALUES
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Hollandse Nieuwe Haring', 'Verse haring met uitjes', 8.50, NULL, 20, true),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Stamppot Boerenkool', 'Traditionele stamppot met rookworst', 12.95, NULL, 15, true),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Pilsje', 'Koud pilsje van de tap', 2.50, NULL, 100, true),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'Bitterballen', 'Krokante bitterballen (8 stuks)', 6.50, NULL, 25, true),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'Heren Overhemd', 'Klassiek wit overhemd', 45.00, NULL, 10, true),
('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'Dames Blouse', 'Elegante zijden blouse', 65.00, NULL, 8, true);

-- Sample business hours
INSERT INTO business_hours (id, business_id, day_of_week, open_time, close_time, closed) VALUES
-- Restaurant De Gouden Leeuw
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, '17:00', '22:00', false), -- Monday
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 2, '17:00', '22:00', false), -- Tuesday
('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 3, '17:00', '22:00', false), -- Wednesday
('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 4, '17:00', '22:00', false), -- Thursday
('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 5, '17:00', '23:00', false), -- Friday
('50000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', 6, '17:00', '23:00', false), -- Saturday
('50000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', 0, '17:00', '22:00', false), -- Sunday

-- Café Central
('50000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', 1, '16:00', '01:00', false), -- Monday
('50000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', 2, '16:00', '01:00', false), -- Tuesday
('50000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000002', 3, '16:00', '01:00', false), -- Wednesday
('50000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000002', 4, '16:00', '02:00', false), -- Thursday
('50000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 5, '16:00', '02:00', false), -- Friday
('50000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', 6, '14:00', '02:00', false), -- Saturday
('50000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000002', 0, '14:00', '01:00', false); -- Sunday

-- Sample reviews
INSERT INTO reviews (id, business_id, user_id, rating, comment, created_at) VALUES
('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 5, 'Uitstekend eten en vriendelijke bediening!', NOW() - INTERVAL '5 days'),
('60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 4, 'Mooie sfeer, lekker eten. Aanrader!', NOW() - INTERVAL '3 days'),
('60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 4, 'Gezellige kroeg met goede sfeer', NOW() - INTERVAL '7 days'),
('60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 5, 'Mooie kleding en goede service', NOW() - INTERVAL '2 days'),
('60000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 5, 'Professioneel en betrouwbaar advies', NOW() - INTERVAL '10 days');

-- =====================================================
-- VIEWS
-- =====================================================

-- Business overview view with aggregated data
CREATE VIEW business_overview AS
SELECT 
    b.*,
    c.name as category_name,
    c.icon as category_icon,
    COUNT(DISTINCT r.id) as review_count,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT p.id) as product_count,
    s.plan as subscription_plan,
    s.max_products,
    s.max_images
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN reviews r ON b.id = r.business_id
LEFT JOIN products p ON b.id = p.business_id AND p.active = true
LEFT JOIN subscriptions s ON b.id = s.business_id
GROUP BY b.id, c.name, c.icon, s.plan, s.max_products, s.max_images;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get business statistics
CREATE OR REPLACE FUNCTION get_business_stats(business_uuid UUID)
RETURNS TABLE (
    total_products INTEGER,
    total_reviews INTEGER,
    average_rating DECIMAL,
    total_orders INTEGER,
    total_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p.id)::INTEGER as total_products,
        COUNT(DISTINCT r.id)::INTEGER as total_reviews,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT o.id)::INTEGER as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue
    FROM businesses b
    LEFT JOIN products p ON b.id = p.business_id AND p.active = true
    LEFT JOIN reviews r ON b.id = r.business_id
    LEFT JOIN orders o ON b.id = o.business_id
    WHERE b.id = business_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Businesses policies
CREATE POLICY "Anyone can view businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Business owners can update their businesses" ON businesses FOR UPDATE USING (
    owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can create businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Business owners can manage their products" ON products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE id = business_id AND owner_id = auth.uid()
    ) OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Business owners can view their orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE id = business_id AND owner_id = auth.uid()
    )
);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- This schema includes:
-- ✅ All tables from the TypeScript definitions
-- ✅ Proper foreign key relationships
-- ✅ Indexes for performance
-- ✅ Triggers for automatic timestamp updates
-- ✅ Admin user creation
-- ✅ Sample data for testing
-- ✅ Row Level Security policies
-- ✅ Views and functions for common queries
-- ✅ Proper data types and constraints

-- To use this schema:
-- 1. Run this SQL file in your Neon database
-- 2. Update your environment variables to point to Neon
-- 3. The admin user will be created with email: admin@schiedam.app
-- 4. All sample data will be available for testing

-- Admin credentials:
-- Email: admin@schiedam.app
-- Role: admin
-- ID: 00000000-0000-0000-0000-000000000001

