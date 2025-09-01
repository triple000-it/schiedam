'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Star, 
  Users, 
  TrendingUp,
  ArrowRight,
  Building2,
  Utensils,
  ShoppingBag,
  Car,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Stethoscope,
  Scissors,
  Wrench,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/supabase'
import { Category, BusinessWithDetails } from '@/types/database'
import { CategorySuggestionForm } from '@/components/forms/CategorySuggestionForm'
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

interface CategoryWithStats extends Category {
  businessCount: number
  featuredBusinesses: BusinessWithDetails[]
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryWithStats[]>([])
  const [allBusinesses, setAllBusinesses] = useState<BusinessWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTab, setSelectedTab] = useState('all')
  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await db.getCategories()
      if (categoriesError) throw categoriesError

      // Load all businesses
      const { data: businessesData, error: businessesError } = await db.getBusinesses({ limit: 1000 })
      if (businessesError) throw businessesError

      setAllBusinesses(businessesData || [])

      // Calculate stats for each category
      const categoriesWithStats = (categoriesData || []).map((category: Category) => {
        const categoryBusinesses = (businessesData || []).filter(
          (business: BusinessWithDetails) => business.category_id === category.id
        )
        
        return {
          ...category,
          businessCount: categoryBusinesses.length,
          featuredBusinesses: categoryBusinesses.slice(0, 3) // Top 3 businesses
        }
      })

      setCategories(categoriesWithStats)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Fout bij laden van categorieën')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().replace(/[^a-z]/g, '')
    return categoryIcons[normalizedName] || categoryIcons.default
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'businesses':
        return b.businessCount - a.businessCount
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/locaties?category=${categoryId}`)
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
      'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ontdek Schiedam
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Verken alle categorieën en vind de perfecte bedrijven, diensten en locaties in jouw stad
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Zoek categorieën..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-500">Categorieën</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{allBusinesses.length}</div>
              <div className="text-sm text-gray-500">Bedrijven</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(allBusinesses.reduce((sum, b) => sum + (b.reviews?.length || 0), 0) / allBusinesses.length) || 0}
              </div>
              <div className="text-sm text-gray-500">Gem. Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((allBusinesses.filter(b => b.claimed).length / allBusinesses.length) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-500">Geclaimd</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sorteer op" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Naam</SelectItem>
                <SelectItem value="businesses">Aantal bedrijven</SelectItem>
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

          <div className="text-sm text-gray-500">
            {filteredCategories.length} categorie{filteredCategories.length !== 1 ? 'ën' : ''} gevonden
          </div>
        </div>

        {/* Categories Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCategories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.name)
              const colorClass = getCategoryColor(index)
              
              return (
                <Card 
                  key={category.id} 
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {category.businessCount} bedrijf{category.businessCount !== 1 ? 'en' : ''}
                      </Badge>
                      
                      {category.featuredBusinesses.length > 0 && (
                        <div className="flex -space-x-2">
                          {category.featuredBusinesses.slice(0, 3).map((business, idx) => (
                            <div
                              key={business.id}
                              className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                              title={business.name}
                            >
                              {business.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {sortedCategories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.name)
              const colorClass = getCategoryColor(index)
              
              return (
                <Card 
                  key={category.id} 
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {category.businessCount} bedrijf{category.businessCount !== 1 ? 'en' : ''}
                          </Badge>
                          
                          {category.featuredBusinesses.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Populaire bedrijven:</span>
                              <div className="flex -space-x-1">
                                {category.featuredBusinesses.slice(0, 3).map((business) => (
                                  <div
                                    key={business.id}
                                    className="w-5 h-5 bg-gray-200 rounded-full border border-white flex items-center justify-center text-xs font-medium text-gray-600"
                                    title={business.name}
                                  >
                                    {business.name.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen categorieën gevonden</h3>
            <p className="text-gray-500 mb-6">
              Probeer een andere zoekterm of bekijk alle categorieën
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Alle categorieën tonen
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mis je een categorie?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Help ons Schiedam.app compleet te maken door nieuwe categorieën voor te stellen of je bedrijf toe te voegen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/claim">
              <Button size="lg">
                <Building2 className="h-5 w-5 mr-2" />
                Bedrijf toevoegen
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowCategorySuggestion(true)}
            >
              Categorie voorstellen
            </Button>
          </div>
        </div>
      </div>

      {/* Category Suggestion Form */}
      <CategorySuggestionForm 
        isOpen={showCategorySuggestion}
        onClose={() => setShowCategorySuggestion(false)}
      />
    </div>
  )
}
