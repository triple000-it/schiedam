// Always export the client-safe database helper
export { db } from './db-client'

// Auth and storage are not available on client side
export const auth = {
  signUp: async () => ({ data: null, error: { message: 'Not available on client' } }),
  signIn: async () => ({ data: null, error: { message: 'Not available on client' } }),
  signOut: async () => ({ error: null }),
  getCurrentUser: async () => ({ user: null, error: { message: 'Not available on client' } }),
  getSession: async () => ({ session: null, error: { message: 'Not available on client' } })
}

export const storage = {
  uploadImage: async () => ({ data: null, error: { message: 'Not available on client' } }),
  deleteImage: async () => ({ data: null, error: { message: 'Not available on client' } }),
  getPublicUrl: () => 'https://example.com/placeholder.jpg'
}

// Keep the supabase export for backward compatibility
export const supabase = {
  auth: {
  signUp: async (email: string, password: string, userData?: any) => {
      console.log('Mock: signUp called with email:', email)
      return { data: null, error: { message: 'Sign up not implemented' } }
    },
    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      console.log('Mock: signInWithPassword called with email:', email)
      return { data: null, error: { message: 'Sign in not implemented' } }
    },
  signOut: async () => {
      console.log('Mock: signOut called')
      return { error: null }
    },
    getUser: async () => {
      console.log('Mock: getUser called')
      return { data: { user: null }, error: { message: 'Get user not implemented' } }
    },
  getSession: async () => {
      console.log('Mock: getSession called')
      return { data: { session: null }, error: { message: 'Get session not implemented' } }
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('Mock: onAuthStateChange called')
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Mock: unsubscribe called')
            }
          }
        }
      }
    }
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          console.log(`Mock: select from ${table} where ${column} = ${value}`)
          return { data: null, error: { message: 'Use db.getProfile, db.getBusiness, etc. instead' } }
        }
      })
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Mock: upload to ${bucket}/${path}`)
        return { data: null, error: { message: 'Storage upload not implemented' } }
      },
      remove: async (paths: string[]) => {
        console.log(`Mock: remove from ${bucket}:`, paths)
        return { data: null, error: { message: 'Storage remove not implemented' } }
      },
      getPublicUrl: (path: string) => {
        console.log(`Mock: getPublicUrl for ${bucket}/${path}`)
        return { data: { publicUrl: 'https://example.com/placeholder.jpg' } }
      }
    })
  }
} as any