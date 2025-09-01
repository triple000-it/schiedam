'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Building2, Crown, Check, MapPin, Plus } from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { BusinessWithDetails, Category } from '@/types/database'
import { toast } from 'sonner'

export default function ClaimPage() {
  const { user, profile } = useAuth()
  const { isOwner } = useRole()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [businesses, setBusinesses] = useState<BusinessWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newBusinessData, setNewBusinessData] = useState({
    name: '',
    description: '',
    category_id: '',
    address: '',
    postal_code: '',
    city: 'Schiedam',
    phone: '',
    email: '',
    website: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadCategories()
    searchBusinesses()
  }, [user])

  const loadCategories = async () => {
    try {
      const { data } = await db.getCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const searchBusinesses = async () => {
    setLoading(true)
    try {
      console.log('Searching businesses with query:', searchQuery)
      
      const { data, error } = await db.getBusinesses({
        search: searchQuery,
        limit: 50
      })
      
      console.log('Businesses search response:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      // Filter only unclaimed businesses
      const unclaimedBusinesses = (data as any[])?.filter((b: any) => !b.claimed) || []
      setBusinesses(unclaimedBusinesses)
    } catch (error) {
      console.error('Error searching businesses:', error)
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
      toast.error('Fout bij zoeken naar bedrijven')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchBusinesses()
  }

  const claimBusiness = async (businessId: string) => {
    if (!user?.id) return

    setClaimingId(businessId)
    try {
      const { error } = await db.claimBusiness(businessId, user.id)
      if (error) throw error

      toast.success('Bedrijf succesvol geclaimd!')
      router.push('/dashboard/business')
    } catch (error) {
      console.error('Error claiming business:', error)
      toast.error('Fout bij claimen van bedrijf')
    } finally {
      setClaimingId(null)
    }
  }

  const addNewBusiness = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await db.createBusiness({
        ...newBusinessData,
        owner_id: user.id,
        claimed: true
      })

      if (error) throw error

      toast.success('Bedrijf succesvol toegevoegd!')
      setShowAddDialog(false)
      router.push('/dashboard/business')
    } catch (error) {
      console.error('Error adding business:', error)
      toast.error('Fout bij toevoegen van bedrijf')
    }
  }

  const updateNewBusinessData = (field: string, value: string) => {
    setNewBusinessData(prev => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Claim je Bedrijf
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Eigenaar van een bedrijf in Schiedam? Claim je bedrijfspagina en bereik meer bezoekers 
            met je eigen webshop en online aanwezigheid.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Eigen Webshop</h3>
              <p className="text-sm text-gray-600">
                Verkoop je producten direct aan bezoekers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Meer Zichtbaarheid</h3>
              <p className="text-sm text-gray-600">
                Word gevonden door duizenden lokale bezoekers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Professionele Pagina</h3>
              <p className="text-sm text-gray-600">
                Pas je bedrijfspagina volledig aan
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Zoek je Bedrijf</TabsTrigger>
            <TabsTrigger value="add">Voeg Nieuw Bedrijf Toe</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Zoek je Bedrijf</CardTitle>
                <CardDescription>
                  Zoek je bedrijf in onze database en claim het in één klik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder="Bedrijfsnaam, adres of categorie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                      <Search className="w-4 h-4 mr-2" />
                      {loading ? 'Zoeken...' : 'Zoeken'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            {businesses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {businesses.length} bedrijven gevonden
                </h3>
                <div className="grid gap-4">
                  {businesses.map((business) => (
                    <Card key={business.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{business.name}</h3>
                              {business.category && (
                                <Badge variant="secondary">
                                  {business.category.name}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">
                                {business.address}, {business.city}
                              </span>
                            </div>
                            {business.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {business.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-4">
                            <Button
                              onClick={() => claimBusiness(business.id)}
                              disabled={claimingId === business.id}
                              className="whitespace-nowrap"
                            >
                              {claimingId === business.id ? (
                                'Claimen...'
                              ) : (
                                <>
                                  <Crown className="w-4 h-4 mr-2" />
                                  Claim Bedrijf
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && !loading && businesses.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Geen bedrijven gevonden
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We konden je bedrijf niet vinden. Voeg het toe aan onze directory!
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nieuw Bedrijf Toevoegen
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nieuw Bedrijf Toevoegen</CardTitle>
                <CardDescription>
                  Staat je bedrijf nog niet in onze directory? Voeg het toe!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Bedrijfsnaam *</Label>
                    <Input
                      id="name"
                      value={newBusinessData.name}
                      onChange={(e) => updateNewBusinessData('name', e.target.value)}
                      placeholder="Naam van je bedrijf"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Select value={newBusinessData.category_id} onValueChange={(value) => updateNewBusinessData('category_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={newBusinessData.description}
                    onChange={(e) => updateNewBusinessData('description', e.target.value)}
                    placeholder="Vertel over je bedrijf..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adres *</Label>
                  <Input
                    id="address"
                    value={newBusinessData.address}
                    onChange={(e) => updateNewBusinessData('address', e.target.value)}
                    placeholder="Straatnaam en huisnummer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postcode *</Label>
                    <Input
                      id="postal_code"
                      value={newBusinessData.postal_code}
                      onChange={(e) => updateNewBusinessData('postal_code', e.target.value)}
                      placeholder="1234 AB"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={newBusinessData.city}
                      onChange={(e) => updateNewBusinessData('city', e.target.value)}
                      placeholder="Schiedam"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefoonnummer</Label>
                    <Input
                      id="phone"
                      value={newBusinessData.phone}
                      onChange={(e) => updateNewBusinessData('phone', e.target.value)}
                      placeholder="010 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mailadres</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newBusinessData.email}
                      onChange={(e) => updateNewBusinessData('email', e.target.value)}
                      placeholder="info@bedrijf.nl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newBusinessData.website}
                    onChange={(e) => updateNewBusinessData('website', e.target.value)}
                    placeholder="https://www.bedrijf.nl"
                  />
                </div>

                <Button onClick={addNewBusiness} className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Bedrijf Toevoegen & Claimen
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Hulp nodig?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Heb je problemen met het claimen van je bedrijf? Neem contact met ons op.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/contact">
                  <Button variant="outline">
                    Contact Opnemen
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="outline">
                    Help & Support
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
