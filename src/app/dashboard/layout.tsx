'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Building2, 
  ShoppingBag, 
  Users, 
  Settings, 
  BarChart3, 
  Heart,
  Crown,
  Shield,
  Store
} from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, loading } = useAuth()
  const { role, isAdmin, isOwner, isCustomer } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'eigenaar', 'bezoeker']
    },
    {
      name: 'Mijn Bedrijf',
      href: '/dashboard/business',
      icon: Building2,
      roles: ['eigenaar'],
      badge: profile?.role === 'eigenaar' ? 'Eigenaar' : undefined
    },
    {
      name: 'Producten',
      href: '/dashboard/products',
      icon: ShoppingBag,
      roles: ['eigenaar']
    },
    {
      name: 'Bestellingen',
      href: '/dashboard/orders',
      icon: Store,
      roles: ['eigenaar', 'bezoeker']
    },
    {
      name: 'Favorieten',
      href: '/dashboard/favorites',
      icon: Heart,
      roles: ['bezoeker']
    },
    {
      name: 'Abonnement',
      href: '/dashboard/subscription',
      icon: Crown,
      roles: ['eigenaar']
    },
    {
      name: 'Alle Bedrijven',
      href: '/admin/businesses',
      icon: Building2,
      roles: ['admin']
    },
    {
      name: 'Gebruikers',
      href: '/admin/users',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Statistieken',
      href: '/admin/analytics',
      icon: BarChart3,
      roles: ['admin']
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: Shield,
      roles: ['admin'],
      badge: 'Admin'
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(role || 'bezoeker')
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'eigenaar': return 'bg-blue-100 text-blue-800'
      case 'bezoeker': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield
      case 'eigenaar': return Building2
      case 'bezoeker': return Users
      default: return Users
    }
  }

  const RoleIcon = getRoleIcon(role || 'bezoeker')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RoleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {profile?.full_name || 'Gebruiker'}
                </h3>
                <Badge variant="secondary" className={getRoleColor(role || 'bezoeker')}>
                  {role === 'admin' ? 'Administrator' : 
                   role === 'eigenaar' ? 'Bedrijfseigenaar' : 
                   'Bezoeker'}
                </Badge>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Navigation */}
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-0 w-64 p-6 border-t bg-gray-50">
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-4 w-4" />
                Instellingen
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
