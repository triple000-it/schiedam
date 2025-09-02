import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    switch (action) {
      case 'getBusinesses':
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')
        
        const result = await db.getBusinesses({
          category: category || undefined,
          search: search || undefined,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined
        })
        
        return NextResponse.json(result)
        
      case 'getCategories':
        const categoriesResult = await db.getCategories()
        return NextResponse.json(categoriesResult)
        
      case 'getBusiness':
        const businessId = searchParams.get('id')
        if (!businessId) {
          return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
        }
        const businessResult = await db.getBusiness(businessId)
        return NextResponse.json(businessResult)
        
      case 'getProducts':
        const productsBusinessId = searchParams.get('businessId')
        if (!productsBusinessId) {
          return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
        }
        const productsResult = await db.getProducts(productsBusinessId)
        return NextResponse.json(productsResult)
        
      case 'getFavorites':
        const favoritesUserId = searchParams.get('userId')
        if (!favoritesUserId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }
        const favoritesResult = await db.getFavorites(favoritesUserId)
        return NextResponse.json(favoritesResult)
        
      case 'getOrders':
        const ordersBusinessId = searchParams.get('businessId')
        const ordersCustomerId = searchParams.get('customerId')
        const ordersStatus = searchParams.get('status')
        
        const ordersResult = await db.getOrders({
          businessId: ordersBusinessId || undefined,
          customerId: ordersCustomerId || undefined,
          status: ordersStatus || undefined
        })
        return NextResponse.json(ordersResult)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'createBusiness':
        const businessResult = await db.createBusiness(data)
        return NextResponse.json(businessResult)
        
      case 'updateBusiness':
        const { id, ...updates } = data
        const updateResult = await db.updateBusiness(id, updates)
        return NextResponse.json(updateResult)
        
      case 'claimBusiness':
        const { businessId, ownerId } = data
        const claimResult = await db.claimBusiness(businessId, ownerId)
        return NextResponse.json(claimResult)
        
      case 'createProduct':
        const productResult = await db.createProduct(data)
        return NextResponse.json(productResult)
        
      case 'updateProduct':
        const { productId, ...productUpdates } = data
        const productUpdateResult = await db.updateProduct(productId, productUpdates)
        return NextResponse.json(productUpdateResult)
        
      case 'deleteProduct':
        const deleteResult = await db.deleteProduct(data.id)
        return NextResponse.json(deleteResult)
        
      case 'createOrder':
        const orderResult = await db.createOrder(data)
        return NextResponse.json(orderResult)
        
      case 'createReview':
        const reviewResult = await db.createReview(data)
        return NextResponse.json(reviewResult)
        
      case 'addFavorite':
        const { userId: addUserId, businessId: addBusinessId } = data
        const favoriteResult = await db.addFavorite(addUserId, addBusinessId)
        return NextResponse.json(favoriteResult)
        
      case 'removeFavorite':
        const { userId: removeUserId, businessId: removeBusinessId } = data
        const removeFavoriteResult = await db.removeFavorite(removeUserId, removeBusinessId)
        return NextResponse.json(removeFavoriteResult)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
