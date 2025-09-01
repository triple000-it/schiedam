'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/supabase'
import { Product, Business } from '@/types/database'
import { getProductPlaceholderImage, getBusinessPlaceholderImage } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart: addToCartContext } = useCart()

  useEffect(() => {
    if (params.slug) {
      loadProduct()
    }
  }, [params.slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch the product by slug
      // For now, we'll create a mock product
      const mockProduct: Product = {
        id: 'mock-product-id',
        business_id: 'mock-business-id',
        name: 'Voorbeeld Product',
        description: 'Dit is een voorbeeld product met een uitgebreide beschrijving. Het product heeft verschillende kenmerken en eigenschappen die hier worden beschreven.',
        price: 29.99,
        image_url: null,
        stock: 50,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const mockBusiness: Business = {
        id: 'mock-business-id',
        name: 'Voorbeeld Bedrijf',
        description: 'Een voorbeeld bedrijf in Schiedam',
        category_id: 'mock-category',
        address: 'Voorbeeldstraat 123',
        postal_code: '3111 AA',
        city: 'Schiedam',
        phone: '+31 10 123 4567',
        email: 'info@voorbeeldbedrijf.nl',
        website: 'https://voorbeeldbedrijf.nl',
        lat: 51.9225,
        lng: 4.4792,
        owner_id: 'mock-owner',
        claimed: true,
        theme_color: '#3B82F6',
        subscription_plan: 'business',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setProduct(mockProduct)
      setBusiness(mockBusiness)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Fout bij laden van product')
    } finally {
      setLoading(false)
    }
  }

  const generateProductImages = (productName: string) => {
    return [
      getProductPlaceholderImage(productName, 'large'),
      getProductPlaceholderImage(productName, 'large'),
      getProductPlaceholderImage(productName, 'large'),
      getProductPlaceholderImage(productName, 'large')
    ]
  }

  const addToCart = () => {
    if (!product || !business) return
    
    addToCartContext({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image_url || undefined,
      businessId: product.business_id,
      businessName: business.name,
      stock: product.stock
    })
    toast.success(`${quantity}x ${product.name} toegevoegd aan winkelwagen`)
  }

  const addToFavorites = () => {
    toast.success(`${product?.name} toegevoegd aan favorieten`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product || !business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product niet gevonden</h1>
              <p className="text-gray-600 mb-6">
                Het opgevraagde product kon niet worden gevonden.
              </p>
              <Link href="/locaties">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar Locaties
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const productImages = generateProductImages(product.name)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/locaties" className="hover:text-gray-700">
            Locaties
          </Link>
          <span>/</span>
          <Link href={`/business/${business.id}`} className="hover:text-gray-700">
            {business.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Afbeelding ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Verkocht door {business.name}</span>
                <span>•</span>
                <span>Voorraad: {product.stock} stuks</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">
                €{product.price.toFixed(2)}
              </span>
              {product.stock === 0 && (
                <Badge variant="destructive">Uitverkocht</Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Beschrijving</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={addToCart}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    In Winkelwagen
                  </Button>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="lg" onClick={addToFavorites}>
                  <Heart className="mr-2 h-5 w-5" />
                  Favorieten
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="mr-2 h-5 w-5" />
                  Delen
                </Button>
              </div>
            </div>

            {/* Business Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src={getBusinessPlaceholderImage(business.name, 'small')}
                    alt={business.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <p className="text-sm text-gray-500">{business.city}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{business.address}, {business.postal_code} {business.city}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{business.email}</span>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website bezoeken
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href={`/business/${business.id}`}>
                    <Button variant="outline" className="w-full">
                      Bekijk Bedrijfspagina
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Verzending</TabsTrigger>
              <TabsTrigger value="reviews">Beoordelingen</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Productkenmerken</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Categorie</span>
                          <span className="text-gray-900">Algemeen</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Voorraad</span>
                          <span className="text-gray-900">{product.stock} stuks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="text-gray-900">
                            {product.active ? 'Actief' : 'Inactief'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Garantie</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>30 dagen niet-goed-geld-terug garantie</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Gratis verzending</h3>
                        <p className="text-sm text-gray-600">
                          Gratis verzending bij bestellingen boven €50
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Snelle levering</h3>
                        <p className="text-sm text-gray-600">
                          Levering binnen 1-3 werkdagen
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nog geen beoordelingen
                    </h3>
                    <p className="text-gray-600">
                      Wees de eerste om dit product te beoordelen!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
