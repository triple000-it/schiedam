'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingBag,
  Package
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { Product, Business } from '@/types/database'
import { getProductPlaceholderImage } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBusiness, setSelectedBusiness] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { addToCart: addToCartContext } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch products from the database
      // For now, we'll create mock products
      const mockProducts: Product[] = [
        {
          id: '1',
          business_id: 'business-1',
          name: 'Premium Koffiebonen',
          description: 'Verse koffiebonen van de beste kwaliteit, perfect voor thuis of op kantoor.',
          price: 24.99,
          image_url: null,
          stock: 100,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          business_id: 'business-2',
          name: 'Handgemaakte Sieraden',
          description: 'Unieke sieraden gemaakt door lokale kunstenaars in Schiedam.',
          price: 89.99,
          image_url: null,
          stock: 25,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          business_id: 'business-3',
          name: 'Biologische Groentenpakket',
          description: 'Vers biologisch groentenpakket van lokale boeren uit de omgeving.',
          price: 19.99,
          image_url: null,
          stock: 50,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          business_id: 'business-1',
          name: 'Koffiezetapparaat',
          description: 'Professioneel koffiezetapparaat voor de perfecte kop koffie.',
          price: 299.99,
          image_url: null,
          stock: 15,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          business_id: 'business-4',
          name: 'Lokale Honing',
          description: 'Pure honing van lokale bijen, direct van de imker.',
          price: 12.99,
          image_url: null,
          stock: 75,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          business_id: 'business-2',
          name: 'Kunstwerk op Canvas',
          description: 'Origineel kunstwerk van een bekende Schiedamse kunstenaar.',
          price: 450.00,
          image_url: null,
          stock: 1,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      const mockBusinesses: Business[] = [
        {
          id: 'business-1',
          name: 'Koffiehuis Schiedam',
          description: 'Gespecialiseerd in premium koffie en koffieapparatuur',
          category_id: 'horeca',
          address: 'Hoogstraat 45',
          postal_code: '3111 AA',
          city: 'Schiedam',
          phone: '+31 10 123 4567',
          email: 'info@koffiehuis-schiedam.nl',
          website: 'https://koffiehuis-schiedam.nl',
          lat: 51.9225,
          lng: 4.4792,
          owner_id: 'owner-1',
          claimed: true,
          theme_color: '#8B4513',
          subscription_plan: 'business',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'business-2',
          name: 'Atelier Creatief',
          description: 'Kunst en sieraden van lokale kunstenaars',
          category_id: 'diensten',
          address: 'Lange Nieuwstraat 12',
          postal_code: '3111 BB',
          city: 'Schiedam',
          phone: '+31 10 234 5678',
          email: 'info@atelier-creatief.nl',
          website: 'https://atelier-creatief.nl',
          lat: 51.9230,
          lng: 4.4800,
          owner_id: 'owner-2',
          claimed: true,
          theme_color: '#FF6B6B',
          subscription_plan: 'pro',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'business-3',
          name: 'Boerderij Groen',
          description: 'Biologische groenten en fruit van eigen land',
          category_id: 'winkels',
          address: 'Boerderijweg 8',
          postal_code: '3111 CC',
          city: 'Schiedam',
          phone: '+31 10 345 6789',
          email: 'info@boerderij-groen.nl',
          website: 'https://boerderij-groen.nl',
          lat: 51.9240,
          lng: 4.4810,
          owner_id: 'owner-3',
          claimed: true,
          theme_color: '#4CAF50',
          subscription_plan: 'business',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'business-4',
          name: 'Imkerij Honing',
          description: 'Pure honing van lokale bijen',
          category_id: 'winkels',
          address: 'Bijenlaan 3',
          postal_code: '3111 DD',
          city: 'Schiedam',
          phone: '+31 10 456 7890',
          email: 'info@imkerij-honing.nl',
          website: 'https://imkerij-honing.nl',
          lat: 51.9250,
          lng: 4.4820,
          owner_id: 'owner-4',
          claimed: true,
          theme_color: '#FFD700',
          subscription_plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      setProducts(mockProducts)
      setBusinesses(mockBusinesses)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Fout bij laden van producten')
    } finally {
      setLoading(false)
    }
  }

  const getBusinessName = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId)
    return business?.name || 'Onbekend bedrijf'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || true // In real app, filter by category
    const matchesBusiness = selectedBusiness === 'all' || product.business_id === selectedBusiness
    
    return matchesSearch && matchesCategory && matchesBusiness
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const addToCart = (product: Product) => {
    const business = businesses.find(b => b.id === product.business_id)
    addToCartContext({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || undefined,
      businessId: product.business_id,
      businessName: business?.name || 'Onbekend bedrijf',
      stock: product.stock
    })
    toast.success(`${product.name} toegevoegd aan winkelwagen`)
  }

  const addToFavorites = (product: Product) => {
    toast.success(`${product.name} toegevoegd aan favorieten`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop Lokaal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Ontdek unieke producten van lokale bedrijven in Schiedam en steun ondernemers in jouw buurt
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Zoek producten, merken, bedrijven..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Alle categorieën" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                <SelectItem value="horeca">Horeca</SelectItem>
                <SelectItem value="winkels">Winkels</SelectItem>
                <SelectItem value="diensten">Diensten</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
              </SelectContent>
            </Select>

            {/* Business Filter */}
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger>
                <SelectValue placeholder="Alle bedrijven" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle bedrijven</SelectItem>
                {businesses.map(business => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sorteren op" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Naam A-Z</SelectItem>
                <SelectItem value="price-low">Prijs (laag-hoog)</SelectItem>
                <SelectItem value="price-high">Prijs (hoog-laag)</SelectItem>
                <SelectItem value="newest">Nieuwste eerst</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} producten gevonden
          </p>
        </div>

        {/* Products Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                    <Image
                      src={getProductPlaceholderImage(product.name, 'medium')}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">
                        {getBusinessName(product.business_id)}
                      </p>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        €{product.price.toFixed(2)}
                      </span>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                        {product.stock > 0 ? `${product.stock} op voorraad` : 'Uitverkocht'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        In Winkelwagen
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addToFavorites(product)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Products List View */
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={getProductPlaceholderImage(product.name, 'medium')}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 mb-1">
                          {getBusinessName(product.business_id)}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">
                          €{product.price.toFixed(2)}
                        </span>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="ml-2">
                          {product.stock > 0 ? `${product.stock} op voorraad` : 'Uitverkocht'}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          In Winkelwagen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addToFavorites(product)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Geen producten gevonden
              </h3>
              <p className="text-gray-600 mb-4">
                Probeer je zoekopdracht aan te passen of bekijk alle beschikbare producten.
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedBusiness('all')
              }}>
                Alle filters wissen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
