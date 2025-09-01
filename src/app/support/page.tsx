'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  BookOpen, 
  Users, 
  Building2, 
  ShoppingBag, 
  MapPin, 
  Star, 
  CreditCard, 
  Shield, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Video,
  Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const quickLinks = [
    {
      icon: Building2,
      title: 'Bedrijf toevoegen',
      description: 'Voeg je bedrijf toe aan Schiedam.app',
      href: '/claim',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: ShoppingBag,
      title: 'Shop gebruiken',
      description: 'Leer hoe je lokaal kunt winkelen',
      href: '/shop',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      icon: MapPin,
      title: 'Locaties vinden',
      description: 'Zoek bedrijven in je buurt',
      href: '/locaties',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      icon: Users,
      title: 'Account beheren',
      description: 'Beheer je profiel en instellingen',
      href: '/dashboard',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'E-mail Support',
      details: ['support@schiedam.app', 'info@schiedam.app'],
      description: 'Stuur ons een e-mail en we reageren binnen 24 uur',
      responseTime: '24 uur'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      details: ['Ma-Vr: 9:00 - 17:00', 'Za: 10:00 - 16:00'],
      description: 'Chat direct met ons support team',
      responseTime: 'Direct'
    },
    {
      icon: Phone,
      title: 'Telefoon',
      details: ['+31 10 123 4567'],
      description: 'Bel ons voor urgente vragen',
      responseTime: 'Direct'
    }
  ]

  const faqCategories = {
    general: [
      {
        id: 'what-is-schiedam-app',
        question: 'Wat is Schiedam.app?',
        answer: 'Schiedam.app is een platform dat alle lokale bedrijven, horeca, winkels en dienstverleners in Schiedam verbindt. We helpen inwoners om lokale bedrijven te ontdekken en ondernemers om hun bedrijf online te promoten.'
      },
      {
        id: 'how-to-use',
        question: 'Hoe gebruik ik Schiedam.app?',
        answer: 'Je kunt Schiedam.app gebruiken om bedrijven te zoeken, producten te kopen, reviews te lezen en lokale diensten te vinden. Maak een gratis account aan om toegang te krijgen tot alle functies.'
      },
      {
        id: 'is-it-free',
        question: 'Is Schiedam.app gratis?',
        answer: 'Ja, Schiedam.app is volledig gratis voor gebruikers. Bedrijven kunnen kiezen voor een gratis basisvermelding of een betaald abonnement met extra functies.'
      },
      {
        id: 'mobile-app',
        question: 'Is er een mobiele app?',
        answer: 'Momenteel is Schiedam.app alleen beschikbaar als website. We werken aan een mobiele app die binnenkort beschikbaar zal zijn voor iOS en Android.'
      }
    ],
    business: [
      {
        id: 'add-business',
        question: 'Hoe voeg ik mijn bedrijf toe?',
        answer: 'Ga naar de "Bedrijf claimen" pagina, vul het formulier in met je bedrijfsgegevens en we nemen contact met je op om je bedrijf te verifiëren en toe te voegen.'
      },
      {
        id: 'business-verification',
        question: 'Hoe wordt mijn bedrijf geverifieerd?',
        answer: 'We controleren je bedrijfsgegevens, contactinformatie en bezoeken je locatie indien nodig. Dit proces duurt meestal 2-3 werkdagen.'
      },
      {
        id: 'business-features',
        question: 'Welke functies krijg ik als bedrijf?',
        answer: 'Je krijgt een bedrijfsprofiel, kunt producten toevoegen, reviews beheren, statistieken bekijken en je bedrijf promoten. Premium abonnementen bieden extra functies.'
      },
      {
        id: 'business-pricing',
        question: 'Wat kost het om mijn bedrijf te vermelden?',
        answer: 'Basisvermelding is gratis. Premium abonnementen starten vanaf €29/maand en bieden uitgebreide profielen, statistieken en marketing tools.'
      }
    ],
    shopping: [
      {
        id: 'how-to-shop',
        question: 'Hoe koop ik producten?',
        answer: 'Blader door de shop, voeg producten toe aan je winkelwagen en ga naar de checkout. Je kunt betalen via iDEAL, creditcard of PayPal.'
      },
      {
        id: 'shipping-info',
        question: 'Wat zijn de verzendkosten?',
        answer: 'Verzending is gratis vanaf €25. Voor bestellingen onder €25 betaal je €4,95 verzendkosten. Lokale ophaalpunten zijn ook beschikbaar.'
      },
      {
        id: 'return-policy',
        question: 'Wat is het retourbeleid?',
        answer: 'Je hebt 30 dagen om producten te retourneren. Producten moeten in originele staat zijn. Retourzending is gratis.'
      },
      {
        id: 'payment-methods',
        question: 'Welke betaalmethoden worden geaccepteerd?',
        answer: 'We accepteren iDEAL, creditcard (Visa, Mastercard), PayPal en bankoverschrijving. Alle betalingen zijn beveiligd met SSL-encryptie.'
      }
    ],
    account: [
      {
        id: 'create-account',
        question: 'Hoe maak ik een account aan?',
        answer: 'Klik op "Registreren" in de rechterbovenhoek, vul je gegevens in en bevestig je e-mailadres. Je account is dan direct actief.'
      },
      {
        id: 'forgot-password',
        question: 'Ik ben mijn wachtwoord vergeten',
        answer: 'Klik op "Wachtwoord vergeten" op de inlogpagina en volg de instructies in de e-mail die je ontvangt.'
      },
      {
        id: 'update-profile',
        question: 'Hoe update ik mijn profiel?',
        answer: 'Ga naar je dashboard, klik op "Profiel" en bewerk je gegevens. Wijzigingen worden direct opgeslagen.'
      },
      {
        id: 'delete-account',
        question: 'Hoe verwijder ik mijn account?',
        answer: 'Ga naar je accountinstellingen en klik op "Account verwijderen". Let op: dit kan niet ongedaan worden gemaakt.'
      }
    ]
  }

  const guides = [
    {
      icon: BookOpen,
      title: 'Gebruikershandleiding',
      description: 'Complete gids voor het gebruik van Schiedam.app',
      type: 'PDF',
      size: '2.3 MB',
      href: '#'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Stap-voor-stap video\'s voor alle functies',
      type: 'Video',
      size: '15 min',
      href: '#'
    },
    {
      icon: FileText,
      title: 'FAQ Document',
      description: 'Uitgebreide lijst met veelgestelde vragen',
      type: 'PDF',
      size: '1.8 MB',
      href: '#'
    },
    {
      icon: Download,
      title: 'Bedrijfsgids',
      description: 'Gids voor bedrijven die willen deelnemen',
      type: 'PDF',
      size: '3.1 MB',
      href: '#'
    }
  ]

  const filteredFaqs = Object.entries(faqCategories).reduce((acc, [category, faqs]) => {
    (acc as any)[category] = faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return acc
  }, {} as typeof faqCategories)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help & Support
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Vind antwoorden op je vragen en krijg hulp bij het gebruik van Schiedam.app
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Zoek in help artikelen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Snelle Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <Link key={index} href={link.href}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`p-3 rounded-lg ${link.color} w-fit mb-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Neem Contact Op</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    {method.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-600 mb-1">
                        {detail}
                      </p>
                    ))}
                    <p className="text-xs text-gray-500 mt-2 mb-3">
                      {method.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.responseTime}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen</h2>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Algemeen</TabsTrigger>
              <TabsTrigger value="business">Bedrijven</TabsTrigger>
              <TabsTrigger value="shopping">Winkelen</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {Object.entries(filteredFaqs).map(([category, faqs]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="space-y-4">
                  {faqs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Geen resultaten gevonden
                        </h3>
                        <p className="text-gray-500">
                          Probeer een andere zoekterm of bekijk een andere categorie
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    faqs.map((faq) => (
                      <Card key={faq.id}>
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-6 h-auto"
                              onClick={() => handleFaqToggle(faq.id)}
                            >
                              <span className="text-left font-medium text-gray-900">
                                {faq.question}
                              </span>
                              {expandedFaq === faq.id ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-6 pb-6">
                              <Separator className="mb-4" />
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Guides and Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gidsen & Documenten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => {
              const IconComponent = guide.icon
              return (
                <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="h-6 w-6 text-gray-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {guide.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {guide.size}
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Status and System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Systeem Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Website</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment System</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Support Tijden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Maandag - Vrijdag</span>
                <span className="text-sm font-medium">9:00 - 17:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Zaterdag</span>
                <span className="text-sm font-medium">10:00 - 16:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Zondag</span>
                <span className="text-sm font-medium text-red-600">Gesloten</span>
              </div>
              <Separator />
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">Urgente vragen:</p>
                <p>Bel +31 10 123 4567 of stuur een e-mail naar support@schiedam.app</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vind je niet wat je zoekt?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ons support team staat klaar om je te helpen. Neem contact met ons op en we lossen je probleem zo snel mogelijk op.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Opnemen
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              +31 10 123 4567
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
