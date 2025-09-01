export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'eigenaar' | 'bezoeker'
          email: string
          full_name: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          mollie_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'eigenaar' | 'bezoeker'
          email: string
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          mollie_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'eigenaar' | 'bezoeker'
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          mollie_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          address: string
          postal_code: string
          city: string
          phone: string | null
          email: string | null
          website: string | null
          lat: number | null
          lng: number | null
          owner_id: string | null
          claimed: boolean
          theme_color: string
          subscription_plan: 'free' | 'business' | 'pro' | 'vip'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          address: string
          postal_code: string
          city?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          lat?: number | null
          lng?: number | null
          owner_id?: string | null
          claimed?: boolean
          theme_color?: string
          subscription_plan?: 'free' | 'business' | 'pro' | 'vip'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          address?: string
          postal_code?: string
          city?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          lat?: number | null
          lng?: number | null
          owner_id?: string | null
          claimed?: boolean
          theme_color?: string
          subscription_plan?: 'free' | 'business' | 'pro' | 'vip'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          stock: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          stock?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          stock?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      business_images: {
        Row: {
          id: string
          business_id: string
          image_url: string
          is_primary: boolean
          uploaded_at: string
        }
        Insert: {
          id?: string
          business_id: string
          image_url: string
          is_primary?: boolean
          uploaded_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          image_url?: string
          is_primary?: boolean
          uploaded_at?: string
        }
      }
      business_hours: {
        Row: {
          id: string
          business_id: string
          day_of_week: number
          open_time: string | null
          close_time: string | null
          closed: boolean
        }
        Insert: {
          id?: string
          business_id: string
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          closed?: boolean
        }
        Update: {
          id?: string
          business_id?: string
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          closed?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          plan: 'free' | 'business' | 'pro' | 'vip'
          max_products: number
          max_images: number
          includes_video: boolean
          includes_chat: boolean
          stripe_subscription_id: string | null
          mollie_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          plan?: 'free' | 'business' | 'pro' | 'vip'
          max_products?: number
          max_images?: number
          includes_video?: boolean
          includes_chat?: boolean
          stripe_subscription_id?: string | null
          mollie_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          plan?: 'free' | 'business' | 'pro' | 'vip'
          max_products?: number
          max_images?: number
          includes_video?: boolean
          includes_chat?: boolean
          stripe_subscription_id?: string | null
          mollie_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id: string
          total_amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          amount: number
          currency: string
          status: string
          payment_method: string | null
          stripe_payment_id: string | null
          mollie_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          amount: number
          currency?: string
          status?: string
          payment_method?: string | null
          stripe_payment_id?: string | null
          mollie_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string | null
          stripe_payment_id?: string | null
          mollie_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          business_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Business = Database['public']['Tables']['businesses']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type BusinessImage = Database['public']['Tables']['business_images']['Row']
export type BusinessHours = Database['public']['Tables']['business_hours']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

// Extended types with relations
export type BusinessWithDetails = Business & {
  category?: Category
  images?: BusinessImage[]
  hours?: BusinessHours[]
  subscription?: Subscription
  reviews?: Review[]
  owner?: Profile
}

export type ProductWithBusiness = Product & {
  business?: Business
}

export type OrderWithDetails = Order & {
  items?: (OrderItem & { product?: Product })[]
  business?: Business
  customer?: Profile
  payment?: Payment
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxProducts: 10,
    maxImages: 1,
    includesVideo: false,
    includesChat: false,
  },
  business: {
    name: 'Business',
    price: 1,
    maxProducts: 50,
    maxImages: 5,
    includesVideo: false,
    includesChat: true,
  },
  pro: {
    name: 'Pro',
    price: 2,
    maxProducts: 100,
    maxImages: 10,
    includesVideo: true,
    includesChat: true,
  },
  vip: {
    name: 'VIP',
    price: null, // Op aanvraag
    maxProducts: 250,
    maxImages: 24,
    includesVideo: true,
    includesChat: true,
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS

// User roles
export type UserRole = 'admin' | 'eigenaar' | 'bezoeker'

// Theme colors
export const THEME_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
] as const

export type ThemeColor = typeof THEME_COLORS[number]
