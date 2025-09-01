'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, db } from '@/lib/supabase'
import { Profile } from '@/types/database'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ session }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await db.getProfile(userId)
      if (error) {
        console.error('Error loading profile:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile(userId)
        }
      } else {
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (userId: string) => {
    const user = await auth.getCurrentUser()
    if (user.user) {
      const { data, error } = await db.createProfile({
        id: userId,
        email: user.user.email!,
        role: 'bezoeker',
        full_name: user.user.user_metadata?.full_name || null
      })

      if (!error && data) {
        setProfile(data)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await auth.signIn(email, password)
    return result
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    const result = await auth.signUp(email, password, userData)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    await auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
    setLoading(false)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' }
    
    const { data, error } = await db.updateProfile(user.id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
    
    if (!error && data) {
      setProfile(data)
    }
    
    return { data, error }
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
