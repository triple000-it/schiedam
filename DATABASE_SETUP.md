# Database Setup Guide - Schiedam.app

This guide will help you set up the Neon database for the Schiedam.app application.

## 🚀 Quick Setup

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/Login to your account
3. Create a new project
4. Copy your connection string

### 2. Run the SQL Schema

1. Open your Neon SQL Editor
2. Copy and paste the entire contents of `database_schema.sql`
3. Execute the script

### 3. Update Environment Variables

Update your `.env.local` file with your Neon database credentials:

```env
# Neon Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_neon_connection_string
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_neon_anon_key

# Or if using direct PostgreSQL connection:
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

## 📊 Database Schema Overview

### Core Tables

- **profiles** - User accounts and authentication
- **categories** - Business categories (Horeca, Winkels, etc.)
- **businesses** - Business listings and information
- **products** - Products sold by businesses
- **orders** - Customer orders
- **reviews** - Customer reviews and ratings
- **favorites** - User favorite businesses

### Supporting Tables

- **business_images** - Business photos and galleries
- **business_hours** - Opening hours for each business
- **subscriptions** - Business subscription plans
- **order_items** - Individual items in orders
- **payments** - Payment processing information

## 👤 Admin User

The schema creates an admin user with the following credentials:

- **Email**: `admin@schiedam.app`
- **Role**: `admin`
- **ID**: `00000000-0000-0000-0000-000000000001`

## 🎯 Sample Data

The schema includes sample data for:

- **10 Categories** - Complete category structure
- **5 Sample Businesses** - Various business types
- **6 Sample Products** - Products from different businesses
- **5 Sample Reviews** - Customer reviews and ratings
- **Business Hours** - Opening hours for restaurants/cafés
- **Subscriptions** - Different subscription plans

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Business owners can manage their own businesses
- Admins have full access
- Public data (businesses, products) is readable by all

### Data Validation
- Proper foreign key constraints
- Check constraints for ratings (1-5)
- Unique constraints where needed
- Proper data types and lengths

## 🚀 Performance Optimizations

### Indexes
- Email lookups for users
- Category and location searches for businesses
- Product filtering by business
- Order and review queries

### Views
- `business_overview` - Aggregated business statistics
- Functions for common queries

## 🔧 Maintenance

### Automatic Updates
- `updated_at` timestamps are automatically maintained
- Triggers ensure data consistency

### Backup Recommendations
- Regular automated backups via Neon
- Export important data periodically
- Monitor database performance

## 📝 Migration from Supabase

If migrating from Supabase:

1. Export your existing data
2. Run the new schema
3. Import your data (adjusting for any schema changes)
4. Update your application configuration
5. Test all functionality

## 🆘 Troubleshooting

### Common Issues

**Connection Issues**
- Verify your connection string format
- Check SSL requirements
- Ensure your IP is whitelisted (if applicable)

**Permission Errors**
- Verify RLS policies are correctly set
- Check user roles and permissions
- Ensure proper authentication

**Data Issues**
- Check foreign key constraints
- Verify data types match expectations
- Review unique constraints

### Support

For issues with:
- **Neon Database**: Check [Neon Documentation](https://neon.tech/docs)
- **Application**: Review the application logs and error messages
- **Schema**: Verify the SQL syntax and constraints

## 📈 Next Steps

After setting up the database:

1. **Test the Connection** - Verify your app can connect
2. **Create Test Users** - Add some test user accounts
3. **Add Real Businesses** - Start adding actual business data
4. **Configure Payments** - Set up Stripe/Mollie integration
5. **Monitor Performance** - Watch database performance metrics

## 🔄 Updates

To update the schema:

1. Create a migration script
2. Test on a development database first
3. Backup production data
4. Apply changes during low-traffic periods
5. Verify all functionality works

---

**Note**: This schema is designed for the Schiedam.app application. Make sure to review and adjust any business-specific requirements before deploying to production.

