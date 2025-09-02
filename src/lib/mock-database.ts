// Mock database for development
// This provides sample data without requiring a real database connection

// Sample data
const mockCategories = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Horeca', description: 'Restaurants, cafés, bars en andere eetgelegenheden', icon: '🍽️', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Winkels', description: 'Retail, kleding, elektronica en andere winkels', icon: '🛍️', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Diensten', description: 'Professionele dienstverlening en advies', icon: '💼', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Zorg & Welzijn', description: 'Zorgverleners, apotheken en welzijnsdiensten', icon: '🏥', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Sport & Vrije Tijd', description: 'Sportclubs, fitness en recreatie', icon: '⚽', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000006', name: 'Onderwijs', description: 'Scholen, trainingen en educatie', icon: '🎓', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000007', name: 'Beauty & Wellness', description: 'Kappers, schoonheidssalons en wellness', icon: '💅', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000008', name: 'Auto & Vervoer', description: 'Garages, autodealers en vervoersdiensten', icon: '🚗', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000009', name: 'Vastgoed', description: 'Makelaars, verhuur en vastgoeddiensten', icon: '🏠', created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000010', name: 'Technologie', description: 'IT-diensten, software en technologie', icon: '💻', created_at: new Date().toISOString() }
]

const mockBusinesses = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    name: 'Restaurant De Gouden Leeuw',
    description: 'Traditioneel Nederlands restaurant met moderne twist',
    category_id: '10000000-0000-0000-0000-000000000001',
    address: 'Hoogstraat 123',
    postal_code: '3111 HG',
    city: 'Schiedam',
    phone: '+31 10 123 4567',
    email: 'info@goudenleeuw.nl',
    website: 'https://goudenleeuw.nl',
    lat: 51.9194,
    lng: 4.3883,
    owner_id: '00000000-0000-0000-0000-000000000001',
    claimed: true,
    theme_color: '#F59E0B',
    subscription_plan: 'business' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    name: 'Café Central',
    description: 'Gezellige bruine kroeg in het centrum',
    category_id: '10000000-0000-0000-0000-000000000001',
    address: 'Lange Haven 45',
    postal_code: '3111 CD',
    city: 'Schiedam',
    phone: '+31 10 234 5678',
    email: 'info@cafecentral.nl',
    website: null,
    lat: 51.9200,
    lng: 4.3900,
    owner_id: '00000000-0000-0000-0000-000000000001',
    claimed: true,
    theme_color: '#8B5CF6',
    subscription_plan: 'free' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    name: 'Modehuis Van der Berg',
    description: 'Exclusieve dames- en herenmode',
    category_id: '10000000-0000-0000-0000-000000000002',
    address: 'Broersvest 67',
    postal_code: '3111 BN',
    city: 'Schiedam',
    phone: '+31 10 345 6789',
    email: 'info@modehuisvanderberg.nl',
    website: 'https://modehuisvanderberg.nl',
    lat: 51.9180,
    lng: 4.3850,
    owner_id: '00000000-0000-0000-0000-000000000001',
    claimed: true,
    theme_color: '#EC4899',
    subscription_plan: 'pro' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    name: 'Fysiotherapie Schiedam Centrum',
    description: 'Professionele fysiotherapie en revalidatie',
    category_id: '10000000-0000-0000-0000-000000000004',
    address: 'Korte Haven 12',
    postal_code: '3111 AB',
    city: 'Schiedam',
    phone: '+31 10 456 7890',
    email: 'info@fysioschiedam.nl',
    website: 'https://fysioschiedam.nl',
    lat: 51.9210,
    lng: 4.3920,
    owner_id: '00000000-0000-0000-0000-000000000001',
    claimed: true,
    theme_color: '#10B981',
    subscription_plan: 'vip' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    name: 'Sportcentrum De Haven',
    description: 'Moderne fitness en groepslessen',
    category_id: '10000000-0000-0000-0000-000000000005',
    address: 'Havenplein 8',
    postal_code: '3111 AC',
    city: 'Schiedam',
    phone: '+31 10 567 8901',
    email: 'info@sportcentrumdehaven.nl',
    website: 'https://sportcentrumdehaven.nl',
    lat: 51.9220,
    lng: 4.3950,
    owner_id: '00000000-0000-0000-0000-000000000001',
    claimed: false,
    theme_color: '#F59E0B',
    subscription_plan: 'free' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockProducts = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    business_id: '20000000-0000-0000-0000-000000000001',
    name: 'Hollandse Nieuwe Haring',
    description: 'Verse haring met uitjes',
    price: 8.50,
    image_url: null,
    stock: 20,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    business_id: '20000000-0000-0000-0000-000000000001',
    name: 'Stamppot Boerenkool',
    description: 'Traditionele stamppot met rookworst',
    price: 12.95,
    image_url: null,
    stock: 15,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock database functions
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    console.log('Mock: getProfile called with userId:', userId)
    return { data: null, error: null }
  },

  updateProfile: async (userId: string, updates: any) => {
    console.log('Mock: updateProfile called with userId:', userId, 'updates:', updates)
    return { data: null, error: null }
  },

  createProfile: async (profile: any) => {
    console.log('Mock: createProfile called with profile:', profile)
    return { data: null, error: null }
  },

  // Businesses
  getBusinesses: async (filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    console.log('Mock: getBusinesses called with filters:', filters)
    
    let businesses = [...mockBusinesses]
    
    // Apply filters
    if (filters?.category) {
      businesses = businesses.filter(b => b.category_id === filters.category)
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      businesses = businesses.filter(b => 
        b.name.toLowerCase().includes(searchLower) || 
        (b.description && b.description.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply pagination
    if (filters?.offset) {
      businesses = businesses.slice(filters.offset)
    }
    
    if (filters?.limit) {
      businesses = businesses.slice(0, filters.limit)
    }
    
    // Transform data to match expected format
    const transformedData = businesses.map(business => {
      const category = mockCategories.find(c => c.id === business.category_id)
      return {
        ...business,
        category: category || undefined,
        reviews: [] // Mock empty reviews for now
      }
    })
    
    return { data: transformedData, error: null }
  },

  getBusiness: async (id: string) => {
    console.log('Mock: getBusiness called with id:', id)
    
    const business = mockBusinesses.find(b => b.id === id)
    if (!business) {
      return { data: null, error: { message: 'Business not found' } }
    }
    
    const category = mockCategories.find(c => c.id === business.category_id)
    
    return {
      data: {
        ...business,
        category: category || undefined,
        images: [],
        hours: [],
        reviews: [],
        subscription: undefined,
        owner: undefined
      },
      error: null
    }
  },

  createBusiness: async (business: any) => {
    console.log('Mock: createBusiness called with business:', business)
    return { data: null, error: null }
  },

  updateBusiness: async (id: string, updates: any) => {
    console.log('Mock: updateBusiness called with id:', id, 'updates:', updates)
    return { data: null, error: null }
  },

  claimBusiness: async (businessId: string, ownerId: string) => {
    console.log('Mock: claimBusiness called with businessId:', businessId, 'ownerId:', ownerId)
    return { data: null, error: null }
  },

  // Categories
  getCategories: async () => {
    console.log('Mock: getCategories called')
    return { data: mockCategories, error: null }
  },

  // Products
  getProducts: async (businessId: string) => {
    console.log('Mock: getProducts called with businessId:', businessId)
    
    const products = mockProducts.filter(p => p.business_id === businessId && p.active)
    return { data: products, error: null }
  },

  createProduct: async (product: any) => {
    console.log('Mock: createProduct called with product:', product)
    return { data: null, error: null }
  },

  updateProduct: async (id: string, updates: any) => {
    console.log('Mock: updateProduct called with id:', id, 'updates:', updates)
    return { data: null, error: null }
  },

  deleteProduct: async (id: string) => {
    console.log('Mock: deleteProduct called with id:', id)
    return { data: { success: true }, error: null }
  },

  // Orders
  createOrder: async (order: any) => {
    console.log('Mock: createOrder called with order:', order)
    return { data: null, error: null }
  },

  getOrders: async (filters?: {
    businessId?: string
    customerId?: string
    status?: string
  }) => {
    console.log('Mock: getOrders called with filters:', filters)
    return { data: [], error: null }
  },

  // Reviews
  createReview: async (review: any) => {
    console.log('Mock: createReview called with review:', review)
    return { data: null, error: null }
  },

  // Favorites
  addFavorite: async (userId: string, businessId: string) => {
    console.log('Mock: addFavorite called with userId:', userId, 'businessId:', businessId)
    return { data: null, error: null }
  },

  removeFavorite: async (userId: string, businessId: string) => {
    console.log('Mock: removeFavorite called with userId:', userId, 'businessId:', businessId)
    return { data: { success: true }, error: null }
  },

  getFavorites: async (userId: string) => {
    console.log('Mock: getFavorites called with userId:', userId)
    return { data: [], error: null }
  }
}

// Simple auth helpers (placeholder)
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    console.log('Mock: signUp called with email:', email)
    return { data: null, error: { message: 'Sign up not implemented' } }
  },

  signIn: async (email: string, password: string) => {
    console.log('Mock: signIn called with email:', email)
    return { data: null, error: { message: 'Sign in not implemented' } }
  },

  signOut: async () => {
    console.log('Mock: signOut called')
    return { error: null }
  },

  getCurrentUser: async () => {
    console.log('Mock: getCurrentUser called')
    return { user: null, error: { message: 'Get current user not implemented' } }
  },

  getSession: async () => {
    console.log('Mock: getSession called')
    return { session: null, error: { message: 'Get session not implemented' } }
  }
}

// Storage helpers (placeholder)
export const storage = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    console.log('Mock: uploadImage called with bucket:', bucket, 'path:', path)
    return { data: null, error: { message: 'Storage upload not implemented' } }
  },

  deleteImage: async (bucket: string, path: string) => {
    console.log('Mock: deleteImage called with bucket:', bucket, 'path:', path)
    return { data: null, error: { message: 'Storage delete not implemented' } }
  },

  getPublicUrl: (bucket: string, path: string) => {
    console.log('Mock: getPublicUrl called with bucket:', bucket, 'path:', path)
    return 'https://example.com/placeholder.jpg'
  }
}
