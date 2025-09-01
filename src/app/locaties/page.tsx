'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, MapPin, Star, Clock, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { BusinessWithDetails, Category } from '@/types/database'
import Link from 'next/link'

function DirectoryPageContent() {
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<BusinessWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    loadCategories()
    loadBusinesses()
  }, [searchQuery, selectedCategory, sortBy])

  const loadCategories = async () => {
    try {
      const { data, error } = await db.getCategories()
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadBusinesses = async () => {
    setLoading(true)
    try {
      console.log('Loading businesses with filters:', {
        search: searchQuery,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        limit: 50
      })
      
      const { data, error } = await db.getBusinesses({
        search: searchQuery,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        limit: 50
      })
      
      console.log('Businesses response:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error loading businesses:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      console.error('Error stringified:', JSON.stringify(error, null, 2))
      console.error('Error details:', {
        message: (error as any)?.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        stack: (error as any)?.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadBusinesses()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('created_at')
  }

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.length
  }

  const formatPhoneNumber = (phone: string) => {
    // Simple Dutch phone number formatting
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bedrijven in Schiedam
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Ontdek alle lokale bedrijven, horeca, winkels en dienstverleners in jouw stad
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Zoek bedrijven, producten, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Categorie
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alle categorieën" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle categorieën</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sorteren op
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Nieuwste eerst</SelectItem>
                      <SelectItem value="name">Alfabetisch</SelectItem>
                      <SelectItem value="rating">Hoogste beoordeling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Filters wissen
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Geen bedrijven gevonden
                  </h3>
                  <p className="text-gray-600">
                    Probeer je zoekopdracht aan te passen of verwijder filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businesses.map((business) => (
                  <Link key={business.id} href={`/business/${business.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {business.name}
                            </h3>
                            {business.category && (
                              <Badge variant="secondary" className="mb-2">
                                {business.category.name}
                              </Badge>
                            )}
                          </div>
                          {business.subscription?.plan && business.subscription.plan !== 'free' && (
                            <Badge variant="default">
                              {business.subscription.plan.toUpperCase()}
                            </Badge>
                          )}
                        </div>

                        {business.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {business.description}
                          </p>
                        )}

                        {/* Rating */}
                        {business.reviews && business.reviews.length > 0 && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {getAverageRating(business.reviews).toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({business.reviews.length} beoordelingen)
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{business.address}, {business.city}</span>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {business.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{formatPhoneNumber(business.phone)}</span>
                            </div>
                          )}
                          {business.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <span>Website</span>
                            </div>
                          )}
                        </div>

                        {/* Claimed Badge */}
                        {business.claimed && (
                          <div className="mt-3 pt-3 border-t">
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              ✓ Geclaimd bedrijf
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More */}
            {businesses.length >= 50 && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  Meer locaties laden...
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    }>
      <DirectoryPageContent />
    </Suspense>
  )
}
