// Client-safe database helper that uses API routes
// This can be safely imported in client components

export const db = {
  // Businesses
  getBusinesses: async (filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getBusinesses')
      
      if (filters?.category) params.set('category', filters.category)
      if (filters?.search) params.set('search', filters.search)
      if (filters?.limit) params.set('limit', filters.limit.toString())
      if (filters?.offset) params.set('offset', filters.offset.toString())
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching businesses:', error)
      return { data: null, error }
    }
  },

  getBusiness: async (id: string) => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getBusiness')
      params.set('id', id)
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching business:', error)
      return { data: null, error }
    }
  },

  createBusiness: async (business: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createBusiness',
          ...business
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating business:', error)
      return { data: null, error }
    }
  },

  updateBusiness: async (id: string, updates: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateBusiness',
          id,
          ...updates
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error updating business:', error)
      return { data: null, error }
    }
  },

  claimBusiness: async (businessId: string, ownerId: string) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'claimBusiness',
          businessId,
          ownerId
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error claiming business:', error)
      return { data: null, error }
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getCategories')
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error }
    }
  },

  // Products
  getProducts: async (businessId: string) => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getProducts')
      params.set('businessId', businessId)
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching products:', error)
      return { data: null, error }
    }
  },

  createProduct: async (product: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createProduct',
          ...product
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating product:', error)
      return { data: null, error }
    }
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateProduct',
          productId: id,
          ...updates
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error updating product:', error)
      return { data: null, error }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteProduct',
          id
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error deleting product:', error)
      return { data: null, error }
    }
  },

  // Orders
  createOrder: async (order: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createOrder',
          ...order
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  },

  // Reviews
  createReview: async (review: any) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createReview',
          ...review
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating review:', error)
      return { data: null, error }
    }
  },

  // Favorites
  addFavorite: async (userId: string, businessId: string) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addFavorite',
          userId,
          businessId
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error adding favorite:', error)
      return { data: null, error }
    }
  },

  removeFavorite: async (userId: string, businessId: string) => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'removeFavorite',
          userId,
          businessId
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error removing favorite:', error)
      return { data: null, error }
    }
  },

  getFavorites: async (userId: string) => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getFavorites')
      params.set('userId', userId)
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return { data: null, error }
    }
  },

  getOrders: async (filters?: {
    businessId?: string
    customerId?: string
    status?: string
  }) => {
    try {
      const params = new URLSearchParams()
      params.set('action', 'getOrders')
      
      if (filters?.businessId) params.set('businessId', filters.businessId)
      if (filters?.customerId) params.set('customerId', filters.customerId)
      if (filters?.status) params.set('status', filters.status)
      
      const response = await fetch(`/api/db?${params}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error fetching orders:', error)
      return { data: null, error }
    }
  }
}

