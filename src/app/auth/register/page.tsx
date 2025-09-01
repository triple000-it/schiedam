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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'bezoeker' as 'bezoeker' | 'eigenaar'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error('Vul alle verplichte velden in')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Wachtwoorden komen niet overeen')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 karakters zijn')
      return
    }

    setLoading(true)
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        role: formData.role
      })
      
      if (error) {
        toast.error(error.message || 'Registratie mislukt')
      } else {
        toast.success('Account succesvol aangemaakt! Check je e-mail voor verificatie.')
        router.push('/auth/login')
      }
    } catch (error) {
      toast.error('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account aanmaken</h2>
        <p className="mt-2 text-sm text-gray-600">
          Maak een account aan om deel te nemen aan de Schiedam community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="fullName">Volledige naam *</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            placeholder="Voor- en achternaam"
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="email">E-mailadres *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="je@voorbeeld.nl"
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="role">Account type</Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => updateFormData('role', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            disabled={loading}
          >
            <option value="bezoeker">Bezoeker</option>
            <option value="eigenaar">Eigenaar</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Je kunt dit later altijd wijzigen in je profiel
          </p>
        </div>

        <div>
          <Label htmlFor="password">Wachtwoord *</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="Minimaal 6 karakters"
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

        <div>
          <Label htmlFor="confirmPassword">Bevestig wachtwoord *</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              placeholder="Herhaal je wachtwoord"
              className="pr-10"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Door een account aan te maken ga je akkoord met onze{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Algemene Voorwaarden
          </Link>{' '}
          en{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacybeleid
          </Link>
          .
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Account aanmaken...
            </>
          ) : (
            'Account aanmaken'
          )}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Al een account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log hier in
          </Link>
        </span>
      </div>
    </div>
  )
}
