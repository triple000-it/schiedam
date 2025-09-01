'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Heart,
  Star,
  Euro,
  Package,
  Eye,
  Plus
} from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { db } from '@/lib/supabase'

export default function DashboardPage() {
  const { profile } = useAuth()
  const { role, isAdmin, isOwner, isCustomer } = useRole()
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [profile?.id, role])

  const loadDashboardData = async () => {
    if (!profile?.id) return

    try {
      setLoading(true)
      
      if (isAdmin) {
        // Load admin stats
        const [businessesResult, usersResult] = await Promise.all([
          db.getBusinesses({ limit: 1000 }),
          // Mock user count for now
          Promise.resolve({ data: [], error: null })
        ])
        
        setStats({
          totalBusinesses: businessesResult.data?.length || 0,
          totalUsers: 1250, // Mock data
          totalOrders: 890, // Mock data
          totalRevenue: 15420 // Mock data
        })
      } else if (isOwner) {
        // Load business owner stats
        const businessesResult = await db.getBusinesses({ limit: 100 })
        const ownedBusiness = (businessesResult.data as any[])?.find((b: any) => b.owner_id === profile.id)
        
        if (ownedBusiness) {
          const productsResult = await db.getProducts(ownedBusiness.id)
          const ordersResult = await db.getOrders({ businessId: ownedBusiness.id })
          
          setStats({
            business: ownedBusiness,
            totalProducts: productsResult.data?.length || 0,
            totalOrders: ordersResult.data?.length || 0,
            monthlyRevenue: 0, // Calculate from orders
            subscriptionPlan: ownedBusiness.subscription_plan
          })
        }
      } else if (isCustomer) {
        // Load customer stats
        const [favoritesResult, ordersResult] = await Promise.all([
          db.getFavorites(profile.id),
          db.getOrders({ customerId: profile.id })
        ])
        
        setStats({
          favoriteBusinesses: favoritesResult.data?.length || 0,
          totalOrders: ordersResult.data?.length || 0,
          totalSpent: 0 // Calculate from orders
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanLimits = (plan: string) => {
    const limits = {
      free: { products: 10, images: 1 },
      business: { products: 50, images: 5 },
      pro: { products: 100, images: 10 },
      vip: { products: 250, images: 24 }
    }
    return limits[plan as keyof typeof limits] || limits.free
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welkom terug, {profile?.full_name || 'gebruiker'}!
          </p>
        </div>
        
        {isOwner && !stats.business && (
          <Link href="/claim">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Bedrijf Claimen
            </Button>
          </Link>
        )}
      </div>

      {/* Admin Dashboard */}
      {isAdmin && (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Bedrijven</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                <p className="text-xs text-muted-foreground">+12% van vorige maand</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+8% van vorige maand</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Bestellingen</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+23% van vorige maand</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale Omzet</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.totalRevenue}</div>
                <p className="text-xs text-muted-foreground">+18% van vorige maand</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snelle Acties</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/businesses">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="mr-2 h-4 w-4" />
                  Beheer Bedrijven
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Beheer Gebruikers
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Bekijk Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}

      {/* Business Owner Dashboard */}
      {isOwner && (
        <>
          {stats.business ? (
            <>
              {/* Business Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mijn Bedrijf</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{stats.business.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {stats.subscriptionPlan.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Producten</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                    <Progress 
                      value={(stats.totalProducts / getPlanLimits(stats.subscriptionPlan).products) * 100} 
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalProducts} van {getPlanLimits(stats.subscriptionPlan).products}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bestellingen</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Deze maand</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Omzet</CardTitle>
                    <Euro className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€{stats.monthlyRevenue}</div>
                    <p className="text-xs text-muted-foreground">Deze maand</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Beheer je Bedrijf</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/dashboard/business">
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="mr-2 h-4 w-4" />
                      Bedrijfspagina
                    </Button>
                  </Link>
                  <Link href="/dashboard/products">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Producten Beheren
                    </Button>
                  </Link>
                  <Link href="/dashboard/subscription">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Upgrade Abonnement
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                Je hebt nog geen bedrijf geclaimd. 
                <Link href="/claim" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
                  Claim je bedrijf nu
                </Link> om te beginnen.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Customer Dashboard */}
      {isCustomer && (
        <>
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoriete Bedrijven</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoriteBusinesses}</div>
                <p className="text-xs text-muted-foreground">Bedrijven opgeslagen</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bestellingen</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">Totaal geplaatst</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Uitgegeven</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.totalSpent}</div>
                <p className="text-xs text-muted-foreground">Bij lokale bedrijven</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ontdek Meer</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/locaties">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Verken Directory
                </Button>
              </Link>
              <Link href="/dashboard/favorites">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Mijn Favorieten
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Mijn Bestellingen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
