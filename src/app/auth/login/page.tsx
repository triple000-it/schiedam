'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Vul alle velden in')
      return
    }

    setLoading(true)
    
    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.error(error.message || 'Inloggen mislukt')
      } else {
        toast.success('Succesvol ingelogd!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inloggen</h2>
        <p className="mt-2 text-sm text-gray-600">
          Log in om toegang te krijgen tot je account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@voorbeeld.nl"
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="password">Wachtwoord</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer je wachtwoord in"
              className="pr-10"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Wachtwoord vergeten?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inloggen...
            </>
          ) : (
            'Inloggen'
          )}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Nog geen account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Registreer hier
          </Link>
        </span>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <p className="text-xs text-amber-700">
              <strong>Beveiligingswaarschuwing:</strong> Deel nooit je inloggegevens met anderen. Schiedam.app zal je nooit vragen om je wachtwoord via e-mail of telefoon.
            </p>
          </div>
        </div>
      </div>


    </div>
  )
}
