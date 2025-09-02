'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Profile } from '@/types/database'

// Simplified user type for client-side use
interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

interface Session {
  user: User
  access_token: string
  refresh_token: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false) // Start with false since we're not implementing auth yet

  useEffect(() => {
    // TODO: Implement proper authentication
    // For now, we'll just set loading to false
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // TODO: Implement proper authentication with server-side API
      console.log('Sign in not implemented yet - using placeholder')
      
      // Placeholder response
      const mockUser: User = {
        id: '00000000-0000-0000-0000-000000000001',
        email: email,
        user_metadata: { full_name: 'Test User' }
      }
      
      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock_token',
        refresh_token: 'mock_refresh_token'
      }
      
      setUser(mockUser)
      setSession(mockSession)
      
      // Mock profile for admin user
      if (email === 'admin@schiedam.app') {
        const mockProfile: Profile = {
          id: '00000000-0000-0000-0000-000000000001',
          role: 'admin',
          email: email,
          full_name: 'Schiedam Admin',
          avatar_url: null,
          stripe_customer_id: null,
          mollie_customer_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setProfile(mockProfile)
      }
      
      return { data: { user: mockUser, session: mockSession }, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    try {
      // TODO: Implement proper authentication with server-side API
      console.log('Sign up not implemented yet - using placeholder')
      return { data: null, error: { message: 'Sign up not implemented' } }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // TODO: Implement proper sign out
      console.log('Sign out not implemented yet - using placeholder')
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' }
    
    try {
      // TODO: Implement proper profile updates with server-side API
      console.log('Update profile not implemented yet - using placeholder')
      
      if (profile) {
        const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
        setProfile(updatedProfile)
        return { data: updatedProfile, error: null }
      }
      
      return { data: null, error: { message: 'No profile found' } }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook voor het checken van rollen
export function useRole(requiredRole?: 'admin' | 'eigenaar' | 'bezoeker') {
  const { profile, loading } = useAuth()
  
  const hasRole = (role: 'admin' | 'eigenaar' | 'bezoeker') => {
    if (!profile) return false
    
    // Admin heeft toegang tot alles
    if (profile.role === 'admin') return true
    
    // Check specifieke rol
    return profile.role === role
  }

  const canAccess = requiredRole ? hasRole(requiredRole) : true

  return {
    role: profile?.role,
    hasRole,
    canAccess,
    loading,
    isAdmin: profile?.role === 'admin',
    isOwner: profile?.role === 'eigenaar',
    isCustomer: profile?.role === 'bezoeker'
  }
}