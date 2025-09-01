'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Upload, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  Palette,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { THEME_COLORS } from '@/types/database'
import { db } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BusinessDashboardPage() {
  const { profile } = useAuth()
  const { isOwner } = useRole()
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    address: '',
    postal_code: '',
    city: 'Schiedam',
    phone: '',
    email: '',
    website: '',
    theme_color: '#3B82F6'
  })

  useEffect(() => {
    if (!isOwner) {
      router.push('/dashboard')
      return
    }
    loadBusinessData()
    loadCategories()
  }, [profile?.id, isOwner])

  const loadBusinessData = async () => {
    if (!profile?.id) return

    try {
      const { data: businesses } = await db.getBusinesses({ limit: 100 })
      const ownedBusiness = (businesses as any[])?.find((b: any) => b.owner_id === profile.id)
      
      if (ownedBusiness) {
        setBusiness(ownedBusiness)
        setFormData({
          name: ownedBusiness.name || '',
          description: ownedBusiness.description || '',
          category_id: ownedBusiness.category_id || '',
          address: ownedBusiness.address || '',
          postal_code: ownedBusiness.postal_code || '',
          city: ownedBusiness.city || 'Schiedam',
          phone: ownedBusiness.phone || '',
          email: ownedBusiness.email || '',
          website: ownedBusiness.website || '',
          theme_color: ownedBusiness.theme_color || '#3B82F6'
        })
      }
    } catch (error) {
      console.error('Error loading business:', error)
      toast.error('Fout bij laden van bedrijfsgegevens')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data } = await db.getCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business?.id) return

    setSaving(true)
    try {
      const { error } = await db.updateBusiness(business.id, {
        ...formData,
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      toast.success('Bedrijfsgegevens succesvol bijgewerkt!')
      loadBusinessData() // Reload data
    } catch (error) {
      console.error('Error updating business:', error)
      toast.error('Fout bij bijwerken van bedrijfsgegevens')
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="p-6">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            Je hebt nog geen bedrijf geclaimd. 
            <Link href="/claim" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
              Claim je bedrijf nu
            </Link> om aan de slag te gaan.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mijn Bedrijf
          </h1>
          <p className="text-gray-600">
            Beheer je bedrijfspagina en instellingen
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Link href={`/business/${business.id}`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Bekijk Pagina
            </Button>
          </Link>
          <Button form="business-form" type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Huidige Abonnement</h3>
              <p className="text-sm text-gray-600">
                Je bent momenteel op het {business.subscription_plan.toUpperCase()} plan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={business.subscription_plan === 'free' ? 'secondary' : 'default'}>
                {business.subscription_plan.toUpperCase()}
              </Badge>
              <Link href="/dashboard/subscription">
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Algemeen</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="appearance">Uiterlijk</TabsTrigger>
          <TabsTrigger value="hours">Openingstijden</TabsTrigger>
        </TabsList>

        <form id="business-form" onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bedrijfsinformatie</CardTitle>
                <CardDescription>
                  Basis informatie over je bedrijf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Bedrijfsnaam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Naam van je bedrijf"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Vertel over je bedrijf..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categorie</Label>
                  <Select value={formData.category_id} onValueChange={(value) => updateFormData('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een categorie" />
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactgegevens</CardTitle>
                <CardDescription>
                  Hoe kunnen bezoekers je bereiken?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adres *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="Straatnaam en huisnummer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postcode *</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => updateFormData('postal_code', e.target.value)}
                      placeholder="1234 AB"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="Schiedam"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefoonnummer</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="010 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="info@bedrijf.nl"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://www.bedrijf.nl"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uiterlijk</CardTitle>
                <CardDescription>
                  Pas het uiterlijk van je bedrijfspagina aan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Themakleur</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {THEME_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-12 h-12 rounded-lg border-2 ${
                          formData.theme_color === color ? 'border-gray-900' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateFormData('theme_color', color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={formData.theme_color}
                    onChange={(e) => updateFormData('theme_color', e.target.value)}
                    className="mt-2 w-20 h-10"
                  />
                </div>

                <div>
                  <Label>Bedrijfsafbeeldingen</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Sleep afbeeldingen hier of klik om te uploaden
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG tot 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Openingstijden</CardTitle>
                <CardDescription>
                  Stel je openingstijden in voor elke dag van de week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'].map((day, index) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <Label>{day}</Label>
                      </div>
                      <Input
                        type="time"
                        placeholder="09:00"
                        className="w-32"
                      />
                      <span className="text-gray-500">tot</span>
                      <Input
                        type="time"
                        placeholder="17:00"
                        className="w-32"
                      />
                      <Button variant="outline" size="sm" type="button">
                        Gesloten
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
