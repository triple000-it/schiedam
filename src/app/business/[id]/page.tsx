'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star,
  Heart,
  Share2,
  ShoppingBag,
  MessageCircle,
  Navigation,
  Calendar,
  Check,
  Crown
} from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { BusinessWithDetails, Product } from '@/types/database'
import { getProductPlaceholderImage } from '@/lib/utils'
import { toast } from 'sonner'

export default function BusinessPage() {
  const params = useParams()
  const businessId = params.id as string
  const { user, profile } = useAuth()
  const { isOwner } = useRole()
  const [business, setBusiness] = useState<BusinessWithDetails | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    loadBusinessData()
    if (user) {
      checkIfFavorite()
    }
  }, [businessId, user])

  const loadBusinessData = async () => {
    try {
      setLoading(true)
      const [businessResult, productsResult] = await Promise.all([
        db.getBusiness(businessId),
        db.getProducts(businessId)
      ])

      if (businessResult.error) throw businessResult.error
      if (productsResult.error) throw productsResult.error

      setBusiness(businessResult.data)
      setProducts(productsResult.data || [])
    } catch (error) {
      console.error('Error loading business:', error)
      toast.error('Bedrijf niet gevonden')
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorite = async () => {
    if (!user?.id) return
    
    try {
      const { data: favorites } = await db.getFavorites(user.id)
      const isFav = (favorites as any[])?.some((fav: any) => fav.business_id === businessId)
      setIsFavorite(!!isFav)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user?.id) {
      toast.error('Log in om favorieten toe te voegen')
      return
    }

    try {
      if (isFavorite) {
        await db.removeFavorite(user.id, businessId)
        setIsFavorite(false)
        toast.success('Verwijderd uit favorieten')
      } else {
        await db.addFavorite(user.id, businessId)
        setIsFavorite(true)
        toast.success('Toegevoegd aan favorieten')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Er ging iets mis')
    }
  }

  const handleClaimBusiness = async () => {
    if (!user?.id || !business) return

    try {
      const { error } = await db.claimBusiness(business.id, user.id)
      if (error) throw error

      toast.success('Bedrijf succesvol geclaimd!')
      setShowClaimDialog(false)
      loadBusinessData()
    } catch (error) {
      console.error('Error claiming business:', error)
      toast.error('Fout bij claimen van bedrijf')
    }
  }

  const submitReview = async () => {
    if (!user?.id || !business) return

    setSubmittingReview(true)
    try {
      const { error } = await db.createReview({
        business_id: business.id,
        user_id: user.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })

      if (error) throw error

      toast.success('Beoordeling toegevoegd!')
      setReviewData({ rating: 5, comment: '' })
      loadBusinessData()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Fout bij toevoegen beoordeling')
    } finally {
      setSubmittingReview(false)
    }
  }

  const getAverageRating = () => {
    if (!business?.reviews || business.reviews.length === 0) return 0
    const sum = business.reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / business.reviews.length
  }

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  }

  const shareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: business?.name || '',
        text: business?.description || '',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link gekopieerd!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Bedrijf niet gevonden</h2>
            <p className="text-gray-600 mb-4">
              Het bedrijf dat je zoekt bestaat niet of is verwijderd.
            </p>
            <Link href="/locaties">
              <Button>Terug naar Directory</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const averageRating = getAverageRating()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0" style={{ backgroundColor: business.theme_color, opacity: 0.9 }}></div>
        <div className="relative max-w-6xl mx-auto px-6 h-full flex items-end pb-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              {business.claimed && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Check className="w-3 h-3 mr-1" />
                  Geclaimd
                </Badge>
              )}
              {business.subscription_plan !== 'free' && (
                <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                  <Crown className="w-3 h-3 mr-1" />
                  {business.subscription_plan.toUpperCase()}
                </Badge>
              )}
            </div>
            {business.category && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {business.category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={toggleFavorite} variant="outline">
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Opgeslagen' : 'Opslaan'}
              </Button>
              <Button onClick={shareUrl} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Delen
              </Button>
              {business.subscription?.includes_chat && (
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              )}
              {!business.claimed && user && (
                <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Crown className="w-4 h-4 mr-2" />
                      Claim Bedrijf
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bedrijf Claimen</DialogTitle>
                      <DialogDescription>
                        Ben je de eigenaar van {business.name}? Claim je bedrijf om het te beheren.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Door dit bedrijf te claimen krijg je toegang tot:
                      </p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Bedrijfspagina beheren</li>
                        <li>• Producten toevoegen</li>
                        <li>• Bestellingen ontvangen</li>
                        <li>• Statistieken bekijken</li>
                      </ul>
                      <div className="flex gap-2">
                        <Button onClick={handleClaimBusiness} className="flex-1">
                          Bevestig Claim
                        </Button>
                        <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
                          Annuleren
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="products">Producten ({products.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({business.reviews?.length || 0})</TabsTrigger>
                <TabsTrigger value="photos">Foto&apos;s</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6">
                {/* Description */}
                {business.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Over {business.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{business.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Opening Hours */}
                {business.hours && business.hours.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Openingstijden
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'].map((day, index) => {
                          const hours = business.hours?.find(h => h.day_of_week === index)
                          return (
                            <div key={day} className="flex justify-between">
                              <span className="font-medium">{day}</span>
                              <span className="text-gray-600">
                                {hours?.closed ? 'Gesloten' : 
                                 hours ? `${hours.open_time} - ${hours.close_time}` : 
                                 'Onbekend'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Link key={product.id} href={`/shop/${product.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <Image
                                  src={product.image_url || getProductPlaceholderImage(product.name, 'medium')}
                                  alt={product.name}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <span className="text-lg font-bold text-green-600">
                                    €{product.price.toFixed(2)}
                                  </span>
                                </div>
                                {product.description && (
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    Voorraad: {product.stock}
                                  </span>
                                  <Button size="sm" onClick={(e) => e.preventDefault()}>
                                    <ShoppingBag className="w-3 h-3 mr-1" />
                                    Bekijk Product
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Geen producten beschikbaar
                      </h3>
                      <p className="text-gray-600">
                        Dit bedrijf heeft nog geen producten toegevoegd.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Add Review */}
                {user && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Beoordeling schrijven</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <Select value={reviewData.rating.toString()} onValueChange={(value) => setReviewData({...reviewData, rating: parseInt(value)})}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5,4,3,2,1].map(rating => (
                              <SelectItem key={rating} value={rating.toString()}>
                                <div className="flex items-center gap-1">
                                  {rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Commentaar</label>
                        <Textarea
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                          placeholder="Deel je ervaring..."
                          rows={3}
                        />
                      </div>
                      <Button onClick={submitReview} disabled={submittingReview}>
                        {submittingReview ? 'Verzenden...' : 'Beoordeling Plaatsen'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                {business.reviews && business.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {business.reviews.map((review, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                U
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  Anonieme gebruiker
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700 text-sm">{review.comment}</p>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('nl-NL')}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nog geen beoordelingen
                      </h3>
                      <p className="text-gray-600">
                        Wees de eerste om dit bedrijf te beoordelen!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="photos">
                <Card>
                  <CardContent className="text-center py-8">
                    <Image
                      src="/api/placeholder/400/300"
                      alt="Bedrijfsfoto's"
                      width={400}
                      height={300}
                      className="mx-auto mb-4 rounded"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Foto&apos;s komen binnenkort
                    </h3>
                    <p className="text-gray-600">
                      Bedrijfsfoto&apos;s worden binnenkort toegevoegd.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm">{business.address}</p>
                    <p className="text-sm text-gray-600">{business.postal_code} {business.city}</p>
                  </div>
                </div>
                
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${business.phone}`} className="text-sm hover:text-blue-600">
                      {formatPhoneNumber(business.phone)}
                    </a>
                  </div>
                )}
                
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${business.email}`} className="text-sm hover:text-blue-600">
                      {business.email}
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:text-blue-600"
                    >
                      Website bezoeken
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button className="w-full" size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    Route plannen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rating Summary */}
            {business.reviews && business.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Beoordelingen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Gebaseerd op {business.reviews.length} beoordelingen
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Actions */}
            {isOwner && business.owner_id === profile?.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Eigenaar Acties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/business">
                    <Button variant="outline" className="w-full justify-start">
                      Bedrijf Bewerken
                    </Button>
                  </Link>
                  <Link href="/dashboard/products">
                    <Button variant="outline" className="w-full justify-start">
                      Producten Beheren
                    </Button>
                  </Link>
                  <Link href="/dashboard/orders">
                    <Button variant="outline" className="w-full justify-start">
                      Bestellingen Bekijken
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
