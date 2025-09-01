import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gmvkpavxleproscakygm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdmtwYXZ4bGVwcm9zY2FreWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjUzMDcsImV4cCI6MjA3MjI0MTMwN30.9W8OhD8SHcvySxkXogjUfIZ2kbS-QRwR_1VOwXquKlk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) as any

// Helper functions for common operations
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  createProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
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
      
      let query = supabase
        .from('businesses')
        .select(`
          *,
          category:categories(*),
          images:business_images(*),
          subscription:subscriptions(*),
          reviews:reviews(rating)
        `)
        .order('created_at', { ascending: false })

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      console.log('Executing Supabase query...')
      const { data, error } = await query
      
      console.log('Supabase query result:', { data, error })
      
      if (error) {
        console.error('Supabase query error:', error)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Error in getBusinesses function:', err)
      return { data: null, error: err }
    }
  },

  getBusiness: async (id: string) => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(*),
        images:business_images(*),
        hours:business_hours(*),
        subscription:subscriptions(*),
        reviews:reviews(*,user:profiles(full_name,avatar_url)),
        owner:profiles(*)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  createBusiness: async (business: any) => {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select()
      .single()
    return { data, error }
  },

  updateBusiness: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  claimBusiness: async (businessId: string, ownerId: string) => {
    const { data, error } = await supabase
      .from('businesses')
      .update({ 
        owner_id: ownerId, 
        claimed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId)
      .select()
      .single()
    return { data, error }
  },

  // Categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    return { data, error }
  },

  // Products
  getProducts: async (businessId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createProduct: async (product: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    return { data, error }
  },

  updateProduct: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  deleteProduct: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { data, error }
  },

  // Orders
  createOrder: async (order: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    return { data, error }
  },

  getOrders: async (filters?: {
    businessId?: string
    customerId?: string
    status?: string
  }) => {
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*,product:products(*)),
        business:businesses(*),
        customer:profiles(*),
        payment:payments(*)
      `)
      .order('created_at', { ascending: false })

    if (filters?.businessId) {
      query = query.eq('business_id', filters.businessId)
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Reviews
  createReview: async (review: any) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()
    return { data, error }
  },

  // Favorites
  addFavorite: async (userId: string, businessId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, business_id: businessId })
      .select()
      .single()
    return { data, error }
  },

  removeFavorite: async (userId: string, businessId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('business_id', businessId)
    return { data, error }
  },

  getFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        business:businesses(*)
      `)
      .eq('user_id', userId)
    return { data, error }
  }
}

// Storage helpers
export const storage = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  deleteImage: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { data, error }
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  }
}
