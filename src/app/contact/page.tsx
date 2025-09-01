'use client'

import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  User, 
  Building2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    businessName: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your backend
      console.log('Contact form submitted:', formData)
      
      toast.success('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.')
      setSubmitted(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        businessName: '',
        phone: ''
      })
    } catch (error) {
      toast.error('Er is iets misgegaan. Probeer het opnieuw of neem direct contact met ons op.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.name.trim() && 
                     formData.email.trim() && 
                     formData.subject.trim() && 
                     formData.category && 
                     formData.message.trim()

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-mail',
      details: ['info@schiedam.app', 'support@schiedam.app'],
      description: 'Stuur ons een e-mail en we reageren binnen 24 uur'
    },
    {
      icon: Phone,
      title: 'Telefoon',
      details: ['+31 10 123 4567'],
      description: 'Maandag t/m vrijdag van 9:00 tot 17:00'
    },
    {
      icon: MapPin,
      title: 'Adres',
      details: ['Hoogstraat 123', '3111 HG Schiedam'],
      description: 'Bezoek ons kantoor in het centrum van Schiedam'
    },
    {
      icon: Clock,
      title: 'Openingstijden',
      details: ['Ma-Vr: 9:00 - 17:00', 'Za: 10:00 - 16:00'],
      description: 'Gesloten op zondag en feestdagen'
    }
  ]

  const faqItems = [
    {
      question: 'Hoe kan ik mijn bedrijf toevoegen aan Schiedam.app?',
      answer: 'Je kunt je bedrijf toevoegen via de "Bedrijf claimen" pagina. Vul het formulier in en we nemen contact met je op om je bedrijf te verifiëren en toe te voegen.'
    },
    {
      question: 'Wat kost het om een bedrijf te vermelden?',
      answer: 'Basisvermelding is gratis! We bieden ook premium abonnementen met extra functies zoals uitgebreide profielen, statistieken en marketing tools.'
    },
    {
      question: 'Hoe lang duurt het voordat mijn bedrijf online staat?',
      answer: 'Na het indienen van je aanvraag controleren we de gegevens en nemen we binnen 2-3 werkdagen contact met je op. Je bedrijf staat meestal binnen een week online.'
    },
    {
      question: 'Kan ik mijn bedrijfsinformatie wijzigen?',
      answer: 'Ja, als eigenaar van een bedrijf kun je inloggen en je bedrijfsinformatie altijd bijwerken. Wijzigingen worden binnen 24 uur doorgevoerd.'
    },
    {
      question: 'Hoe werkt het reviewsysteem?',
      answer: 'Klanten kunnen reviews achterlaten na een bezoek aan je bedrijf. Reviews worden gemodereerd om kwaliteit te waarborgen en spam te voorkomen.'
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bericht Verzonden!</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Bedankt voor je bericht. We hebben je vraag ontvangen en nemen zo snel mogelijk contact met je op.
            </p>
            <div className="space-y-4">
              <Button onClick={() => setSubmitted(false)}>
                Nieuw Bericht Verzenden
              </Button>
              <div className="text-sm text-gray-500">
                <p>Meestal reageren we binnen 24 uur</p>
                <p>Voor urgente zaken: bel +31 10 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Neem Contact Op
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Heb je vragen, suggesties of hulp nodig? We staan voor je klaar!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Stuur ons een bericht
                </CardTitle>
                <CardDescription>
                  Vul het formulier in en we nemen zo snel mogelijk contact met je op
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Naam *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Je volledige naam"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="je@email.nl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+31 6 12345678"
                    />
                  </div>

                  {/* Business Information */}
                  <div>
                    <Label htmlFor="businessName">Bedrijfsnaam (optioneel)</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Naam van je bedrijf"
                    />
                  </div>

                  {/* Subject and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Onderwerp *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Korte beschrijving van je vraag"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categorie *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer een categorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Algemene vraag</SelectItem>
                          <SelectItem value="business">Bedrijf toevoegen/wijzigen</SelectItem>
                          <SelectItem value="technical">Technische ondersteuning</SelectItem>
                          <SelectItem value="billing">Facturatie/Abonnement</SelectItem>
                          <SelectItem value="suggestion">Suggestie/Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Anders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Bericht *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Beschrijf je vraag of opmerking zo uitgebreid mogelijk..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Verzenden...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Bericht Verzenden
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & FAQ */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-gray-600">{detail}</p>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Snelle Acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Bedrijf toevoegen
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Account aanmaken
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live chat
                </Button>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Veelgestelde Vragen</CardTitle>
                <CardDescription>
                  Vind snel antwoorden op veelgestelde vragen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium text-gray-900 mb-1">{item.question}</h4>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Service Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Website</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-mail Support</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actief
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Tijd</span>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    &lt; 24 uur
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
