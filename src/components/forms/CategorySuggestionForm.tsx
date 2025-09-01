'use client'

import { useState } from 'react'
import { X, Send, Building2, FileText, User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CategorySuggestionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function CategorySuggestionForm({ isOpen, onClose }: CategorySuggestionFormProps) {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    reason: '',
    contactName: '',
    contactEmail: '',
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your backend
      console.log('Category suggestion submitted:', formData)
      
      toast.success('Bedankt voor je suggestie! We bekijken je voorstel en nemen contact met je op.')
      
      // Reset form and close
      setFormData({
        categoryName: '',
        description: '',
        reason: '',
        contactName: '',
        contactEmail: '',
        additionalInfo: ''
      })
      onClose()
    } catch (error) {
      toast.error('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.categoryName.trim() && 
                     formData.description.trim() && 
                     formData.reason && 
                     formData.contactName.trim() && 
                     formData.contactEmail.trim()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Categorie Voorstellen</span>
          </DialogTitle>
          <DialogDescription>
            Help ons Schiedam.app compleet te maken door een nieuwe categorie voor te stellen. 
            We bekijken alle voorstellen en nemen contact met je op.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Categorie Informatie
            </h3>
            
            <div>
              <Label htmlFor="categoryName">Categorie Naam *</Label>
              <Input
                id="categoryName"
                value={formData.categoryName}
                onChange={(e) => handleInputChange('categoryName', e.target.value)}
                placeholder="Bijv. Bakkerijen, Fitness, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Beschrijving *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Beschrijf wat voor bedrijven/diensten in deze categorie vallen..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Waarom is deze categorie nodig? *</Label>
              <Select value={formData.reason} onValueChange={(value) => handleInputChange('reason', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een reden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missing">Deze categorie ontbreekt volledig</SelectItem>
                  <SelectItem value="subcategory">Het is een subcategorie van een bestaande categorie</SelectItem>
                  <SelectItem value="specific">Het is een specifieke niche die apart moet staan</SelectItem>
                  <SelectItem value="popular">Er zijn veel bedrijven in deze categorie</SelectItem>
                  <SelectItem value="other">Andere reden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Contact Informatie
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Je Naam *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="Volledige naam"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">E-mailadres *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="je@email.nl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Extra Informatie
            </h3>
            
            <div>
              <Label htmlFor="additionalInfo">Aanvullende Opmerkingen</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Heb je nog andere opmerkingen, voorbeelden van bedrijven, of suggesties?"
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Verzenden...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Voorstel Verzenden
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Wat gebeurt er met je voorstel?</p>
            <ul className="space-y-1 text-xs">
              <li>• We bekijken je voorstel binnen 2-3 werkdagen</li>
              <li>• We nemen contact met je op via e-mail</li>
              <li>• Als je voorstel wordt goedgekeurd, voegen we de categorie toe</li>
              <li>• Je krijgt een melding wanneer de categorie live gaat</li>
            </ul>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
