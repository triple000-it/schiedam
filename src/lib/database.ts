// Server-only database client for Neon PostgreSQL
// This file should only be imported on the server side

// Prevent this module from being imported on the client side
if (typeof window !== 'undefined') {
  throw new Error('This module can only be imported on the server side')
}

import { Pool } from 'pg'

// Only create the pool on the server side
let pool: Pool | null = null

function getPool() {
  if (typeof window !== 'undefined') {
    throw new Error('Database client can only be used on the server side')
  }
  
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_tVL5pZeSn2RB@ep-old-thunder-agajgkrc-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
  
  return pool
}

// Database helpers using direct PostgreSQL
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    try {
      const result = await getPool().query(
        'SELECT * FROM profiles WHERE id = $1',
        [userId]
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error getting profile:', error)
      return { data: null, error }
    }
  },

  updateProfile: async (userId: string, updates: any) => {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ')
      
      const values = [userId, ...Object.values(updates)]
      
      const result = await getPool().query(
        `UPDATE profiles SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  },

  createProfile: async (profile: any) => {
    try {
      const keys = Object.keys(profile)
      const values = Object.values(profile)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      
      const result = await getPool().query(
        `INSERT INTO profiles (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error creating profile:', error)
      return { data: null, error }
    }
  },

  // Businesses
  getBusinesses: async (filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    try {
      console.log('getBusinesses called with filters:', filters)
      
      let query = `
        SELECT 
          b.*,
          c.name as category_name,
          c.description as category_description,
          c.icon as category_icon,
          COUNT(DISTINCT r.id) as review_count,
          COALESCE(AVG(r.rating), 0) as average_rating
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN reviews r ON b.id = r.business_id
      `
      
      const conditions = []
      const values = []
      let paramCount = 0

      if (filters?.category) {
        paramCount++
        conditions.push(`b.category_id = $${paramCount}`)
        values.push(filters.category)
      }

      if (filters?.search) {
        paramCount++
        conditions.push(`(b.name ILIKE $${paramCount} OR b.description ILIKE $${paramCount})`)
        values.push(`%${filters.search}%`)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`
      }

      query += ` GROUP BY b.id, c.name, c.description, c.icon`
      query += ` ORDER BY b.created_at DESC`

      if (filters?.limit) {
        paramCount++
        query += ` LIMIT $${paramCount}`
        values.push(filters.limit)
      }

      if (filters?.offset) {
        paramCount++
        query += ` OFFSET $${paramCount}`
        values.push(filters.offset)
      }

      console.log('Executing PostgreSQL query:', query)
      console.log('With values:', values)
      
      const result = await getPool().query(query, values)
      
      console.log('PostgreSQL query result:', { rowCount: result.rowCount })
      
      // Transform the data to match the expected format
      const transformedData = result.rows.map(row => ({
        ...row,
        category: row.category_name ? {
          id: row.category_id,
          name: row.category_name,
          description: row.category_description,
          icon: row.category_icon
        } : undefined,
        reviews: row.review_count > 0 ? [{ rating: row.average_rating }] : []
      }))
      
      return { data: transformedData, error: null }
    } catch (err) {
      console.error('Error in getBusinesses function:', err)
      return { data: null, error: err }
    }
  },

  getBusiness: async (id: string) => {
    try {
      const result = await getPool().query(`
        SELECT 
          b.*,
          c.name as category_name,
          c.description as category_description,
          c.icon as category_icon,
          p.full_name as owner_name,
          p.avatar_url as owner_avatar
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN profiles p ON b.owner_id = p.id
        WHERE b.id = $1
      `, [id])
      
      if (result.rows.length === 0) {
        return { data: null, error: { message: 'Business not found' } }
      }
      
      const business = result.rows[0]
      
      // Get images
      const imagesResult = await getPool().query(
        'SELECT * FROM business_images WHERE business_id = $1 ORDER BY is_primary DESC',
        [id]
      )
      
      // Get hours
      const hoursResult = await getPool().query(
        'SELECT * FROM business_hours WHERE business_id = $1 ORDER BY day_of_week',
        [id]
      )
      
      // Get reviews
      const reviewsResult = await getPool().query(`
        SELECT r.*, p.full_name, p.avatar_url
        FROM reviews r
        LEFT JOIN profiles p ON r.user_id = p.id
        WHERE r.business_id = $1
        ORDER BY r.created_at DESC
      `, [id])
      
      // Get subscription
      const subscriptionResult = await getPool().query(
        'SELECT * FROM subscriptions WHERE business_id = $1',
        [id]
      )
      
      const transformedBusiness = {
        ...business,
        category: business.category_name ? {
          id: business.category_id,
          name: business.category_name,
          description: business.category_description,
          icon: business.category_icon
        } : undefined,
        owner: business.owner_name ? {
          id: business.owner_id,
          full_name: business.owner_name,
          avatar_url: business.owner_avatar
        } : undefined,
        images: imagesResult.rows,
        hours: hoursResult.rows,
        reviews: reviewsResult.rows,
        subscription: subscriptionResult.rows[0] || undefined
      }
      
      return { data: transformedBusiness, error: null }
    } catch (error) {
      console.error('Error getting business:', error)
      return { data: null, error }
    }
  },

  createBusiness: async (business: any) => {
    try {
      const keys = Object.keys(business)
      const values = Object.values(business)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      
      const result = await getPool().query(
        `INSERT INTO businesses (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error creating business:', error)
      return { data: null, error }
    }
  },

  updateBusiness: async (id: string, updates: any) => {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ')
      
      const values = [id, ...Object.values(updates)]
      
      const result = await getPool().query(
        `UPDATE businesses SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error updating business:', error)
      return { data: null, error }
    }
  },

  claimBusiness: async (businessId: string, ownerId: string) => {
    try {
      const result = await getPool().query(
        'UPDATE businesses SET owner_id = $2, claimed = true, updated_at = NOW() WHERE id = $1 RETURNING *',
        [businessId, ownerId]
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error claiming business:', error)
      return { data: null, error }
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const result = await getPool().query('SELECT * FROM categories ORDER BY name')
      return { data: result.rows, error: null }
    } catch (error) {
      console.error('Error getting categories:', error)
      return { data: null, error }
    }
  },

  // Products
  getProducts: async (businessId: string) => {
    try {
      const result = await getPool().query(
        'SELECT * FROM products WHERE business_id = $1 AND active = true ORDER BY created_at DESC',
        [businessId]
      )
      return { data: result.rows, error: null }
    } catch (error) {
      console.error('Error getting products:', error)
      return { data: null, error }
    }
  },

  createProduct: async (product: any) => {
    try {
      const keys = Object.keys(product)
      const values = Object.values(product)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      
      const result = await getPool().query(
        `INSERT INTO products (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error creating product:', error)
      return { data: null, error }
    }
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ')
      
      const values = [id, ...Object.values(updates)]
      
      const result = await getPool().query(
        `UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error updating product:', error)
      return { data: null, error }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const result = await getPool().query('DELETE FROM products WHERE id = $1', [id])
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { data: null, error }
    }
  },

  // Orders
  createOrder: async (order: any) => {
    try {
      const keys = Object.keys(order)
      const values = Object.values(order)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      
      const result = await getPool().query(
        `INSERT INTO orders (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  },

  getOrders: async (filters?: {
    businessId?: string
    customerId?: string
    status?: string
  }) => {
    try {
      let query = `
        SELECT 
          o.*,
          b.name as business_name,
          p.full_name as customer_name
        FROM orders o
        LEFT JOIN businesses b ON o.business_id = b.id
        LEFT JOIN profiles p ON o.customer_id = p.id
      `
      
      const conditions = []
      const values = []
      let paramCount = 0

      if (filters?.businessId) {
        paramCount++
        conditions.push(`o.business_id = $${paramCount}`)
        values.push(filters.businessId)
      }

      if (filters?.customerId) {
        paramCount++
        conditions.push(`o.customer_id = $${paramCount}`)
        values.push(filters.customerId)
      }

      if (filters?.status) {
        paramCount++
        conditions.push(`o.status = $${paramCount}`)
        values.push(filters.status)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`
      }

      query += ` ORDER BY o.created_at DESC`

      const result = await getPool().query(query, values)
      
      // Transform the data
      const transformedData = result.rows.map(row => ({
        ...row,
        business: row.business_name ? {
          id: row.business_id,
          name: row.business_name
        } : undefined,
        customer: row.customer_name ? {
          id: row.customer_id,
          full_name: row.customer_name
        } : undefined
      }))
      
      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error getting orders:', error)
      return { data: null, error }
    }
  },

  // Reviews
  createReview: async (review: any) => {
    try {
      const keys = Object.keys(review)
      const values = Object.values(review)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      
      const result = await getPool().query(
        `INSERT INTO reviews (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error creating review:', error)
      return { data: null, error }
    }
  },

  // Favorites
  addFavorite: async (userId: string, businessId: string) => {
    try {
      const result = await getPool().query(
        'INSERT INTO favorites (user_id, business_id) VALUES ($1, $2) RETURNING *',
        [userId, businessId]
      )
      return { data: result.rows[0] || null, error: null }
    } catch (error) {
      console.error('Error adding favorite:', error)
      return { data: null, error }
    }
  },

  removeFavorite: async (userId: string, businessId: string) => {
    try {
      const result = await getPool().query(
        'DELETE FROM favorites WHERE user_id = $1 AND business_id = $2',
        [userId, businessId]
      )
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error removing favorite:', error)
      return { data: null, error }
    }
  },

  getFavorites: async (userId: string) => {
    try {
      const result = await getPool().query(`
        SELECT 
          f.*,
          b.name as business_name,
          b.description as business_description,
          b.address as business_address,
          b.city as business_city
        FROM favorites f
        LEFT JOIN businesses b ON f.business_id = b.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
      `, [userId])
      
      // Transform the data
      const transformedData = result.rows.map(row => ({
        ...row,
        business: row.business_name ? {
          id: row.business_id,
          name: row.business_name,
          description: row.business_description,
          address: row.business_address,
          city: row.business_city
        } : undefined
      }))
      
      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error getting favorites:', error)
      return { data: null, error }
    }
  }
}

// Simple auth helpers (placeholder - you'll need to implement proper authentication)
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    console.log('Sign up not implemented yet')
    return { data: null, error: { message: 'Sign up not implemented' } }
  },

  signIn: async (email: string, password: string) => {
    console.log('Sign in not implemented yet')
    return { data: null, error: { message: 'Sign in not implemented' } }
  },

  signOut: async () => {
    console.log('Sign out not implemented yet')
    return { error: null }
  },

  getCurrentUser: async () => {
    console.log('Get current user not implemented yet')
    return { user: null, error: { message: 'Get current user not implemented' } }
  },

  getSession: async () => {
    console.log('Get session not implemented yet')
    return { session: null, error: { message: 'Get session not implemented' } }
  }
}

// Storage helpers (placeholder)
export const storage = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    console.log('Storage upload not implemented yet')
    return { data: null, error: { message: 'Storage upload not implemented' } }
  },

  deleteImage: async (bucket: string, path: string) => {
    console.log('Storage delete not implemented yet')
    return { data: null, error: { message: 'Storage delete not implemented' } }
  },

  getPublicUrl: (bucket: string, path: string) => {
    console.log('Storage get public URL not implemented yet')
    return 'https://example.com/placeholder.jpg'
  }
}

