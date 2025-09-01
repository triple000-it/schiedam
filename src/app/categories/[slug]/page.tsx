'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  Users,
  TrendingUp,
  Grid3X3,
  List,
  Building2,
  Utensils,
  ShoppingBag,
  Car,
  Stethoscope,
  Scissors,
  Wrench,
  Briefcase,
  GraduationCap,
  Home,
  Palette,
  Dumbbell,
  Music,
  Camera,
  BookOpen,
  Gamepad2,
  TreePine,
  Baby,
  Dog,
  Plane
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { Category, BusinessWithDetails } from '@/types/database'
import { toast } from 'sonner'

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  'horeca': Utensils,
  'restaurants': Utensils,
  'cafes': Utensils,
  'bars': Utensils,
  'winkels': ShoppingBag,
  'shops': ShoppingBag,
  'retail': ShoppingBag,
  'automotive': Car,
  'auto': Car,
  'healthcare': Stethoscope,
  'health': Stethoscope,
  'beauty': Scissors,
  'salon': Scissors,
  'services': Wrench,
  'professional': Briefcase,
  'business': Briefcase,
  'education': GraduationCap,
  'school': GraduationCap,
  'real-estate': Home,
  'housing': Home,
  'arts': Palette,
  'creative': Palette,
  'fitness': Dumbbell,
  'sports': Dumbbell,
  'entertainment': Music,
  'media': Camera,
  'books': BookOpen,
  'gaming': Gamepad2,
  'nature': TreePine,
  'family': Baby,
  'pets': Dog,
  'travel': Plane,
  'default': Building2
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [businesses, setBusinesses] = useState<BusinessWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (params.slug) {
      loadCategoryData()
    }
  }, [params.slug])

  const loadCategoryData = async () => {
    setLoading(true)
    try {
      // Load all categories to find the one matching the slug
      const { data: categoriesData, error: categoriesError } = await db.getCategories()
      if (categoriesError) throw categoriesError

      const foundCategory = categoriesData?.find((cat: Category) => 
        cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === params.slug
      )

      if (!foundCategory) {
        toast.error('Categorie niet gevonden')
        router.push('/categories')
        return
      }

      setCategory(foundCategory)

      // Load businesses for this category
      const { data: businessesData, error: businessesError } = await db.getBusinesses({
        category: foundCategory.id,
        limit: 1000
      })
      if (businessesError) throw businessesError

      setBusinesses(businessesData || [])
    } catch (error) {
      console.error('Error loading category data:', error)
      toast.error('Fout bij laden van categorie gegevens')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().replace(/[^a-z]/g, '')
    return categoryIcons[normalizedName] || categoryIcons.default
  }

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        const aRating = (a.reviews?.reduce((sum, r: any) => sum + (r?.rating || 0), 0) || 0) / (a.reviews?.length || 1)
        const bRating = (b.reviews?.reduce((sum, r: any) => sum + (r?.rating || 0), 0) || 0) / (b.reviews?.length || 1)
        return bRating - aRating
      case 'reviews':
        return (b.reviews?.length || 0) - (a.reviews?.length || 0)
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const getAverageRating = (business: BusinessWithDetails) => {
    if (!business.reviews || business.reviews.length === 0) return 0
    return business.reviews.reduce((sum, review) => sum + (review?.rating || 0), 0) / business.reviews.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categorie niet gevonden</h1>
          <Link href="/categories">
            <Button>Terug naar categorieën</Button>
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = getCategoryIcon(category.name)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="flex items-center text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug
              </Button>
              <Link href="/categories" className="text-blue-100 hover:text-white">
                Alle categorieën
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-white/20 rounded-xl">
                <IconComponent className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
                {category.description && (
                  <p className="text-xl text-blue-100 mt-2">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{businesses.length}</div>
              <div className="text-sm text-gray-500">Bedrijven</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {businesses.filter(b => b.claimed).length}
              </div>
              <div className="text-sm text-gray-500">Geclaimd</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {businesses.reduce((sum, b) => sum + (b.reviews?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {businesses.length > 0 ? 
                  (businesses.reduce((sum, b) => sum + getAverageRating(b), 0) / businesses.length).toFixed(1) : 
                  '0.0'
                }
              </div>
              <div className="text-sm text-gray-500">Gem. Rating</div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={`Zoek in ${category.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sorteer op" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Naam</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Aantal reviews</SelectItem>
                <SelectItem value="newest">Nieuwste</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {filteredBusinesses.length} van {businesses.length} bedrijven gevonden
          </p>
        </div>

        {/* Businesses Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBusinesses.map((business) => (
              <Card key={business.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {business.name}
                      </h3>
                      {business.claimed && (
                        <Badge variant="default" className="text-xs">
                          Geclaimd
                        </Badge>
                      )}
                    </div>
                    
                    {business.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {business.address}, {business.city}
                      </span>
                    </div>
                    
                    {business.reviews && business.reviews.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(getAverageRating(business))
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({business.reviews.length} reviews)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {business.phone && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {business.email && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {business.website && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Globe className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Link href={`/business/${business.id}`}>
                        <Button size="sm">
                          Bekijk
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {sortedBusinesses.map((business) => (
              <Card key={business.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {business.name}
                          </h3>
                          {business.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {business.description}
                            </p>
                          )}
                        </div>
                        {business.claimed && (
                          <Badge variant="default" className="text-xs">
                            Geclaimd
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {business.address}, {business.city}
                          </span>
                        </div>
                        
                        {business.reviews && business.reviews.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.round(getAverageRating(business))
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({business.reviews.length})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {business.phone && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {business.email && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {business.website && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      <Link href={`/business/${business.id}`}>
                        <Button size="sm">
                          Bekijk
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen bedrijven gevonden</h3>
            <p className="text-gray-500 mb-6">
              Probeer een andere zoekterm of bekijk alle bedrijven in deze categorie
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Alle bedrijven tonen
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Voeg je bedrijf toe aan {category.name}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ben je eigenaar van een bedrijf in deze categorie? Claim je bedrijf en krijg toegang tot extra functies.
          </p>
          <Link href="/claim">
            <Button size="lg">
              <Building2 className="h-5 w-5 mr-2" />
              Bedrijf claimen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
