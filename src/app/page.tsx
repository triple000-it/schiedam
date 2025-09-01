import Link from 'next/link'
import { ArrowRight, MapPin, Store, Users, Zap, Shield, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Betrouwbaar",
      description: "Geverifieerde bedrijven en locaties voor transparante informatie."
    },
    {
      icon: Users,
      title: "Community",
      description: "Beoordelingen en ervaringen van echte bezoekers uit Schiedam en omgeving."
    },
    {
      icon: Zap,
      title: "Gemakkelijk en snel",
      description: "Een handige en intuïtieve zoekfunctie met filters op categorie en locatie."
    },
    {
      icon: MapPin,
      title: "Lokaal ontdekken",
      description: "Vind bedrijven, horeca, instanties, verenigingen en winkels in de buurt op één plek."
    },
    {
      icon: Heart,
      title: "Steun",
      description: "Help lokale ondernemers groeien en de economie bloeien."
    },
    {
      icon: Store,
      title: "Webshops",
      description: "Shop direct bij lokale ondernemers met geïntegreerde betalingen."
    }
    
    
    
    
  ]

  const categories = [
    { name: "Horeca", count: 150, color: "bg-orange-500" },
    { name: "Winkels", count: 230, color: "bg-blue-500" },
    { name: "Sport", count: 45, color: "bg-green-500" },
    { name: "Diensten", count: 180, color: "bg-purple-500" },
    { name: "Gezondheid", count: 90, color: "bg-red-500" },
    { name: "Cultuur", count: 35, color: "bg-pink-500" }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Ontdek <span className="text-blue-600">Schiedam</span>
              <br />
              <span className="text-3xl sm:text-5xl">zoals nooit tevoren</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-8">
              Dé complete gids voor bedrijven, cultuur, diensten, horeca, instanties, onderwijs, sport, verenigingen, winkels, zorg en overige locaties in Schiedam. 
              <br /><br />Shop lokaal, steun ondernemers en ontdek wat Schiedam te bieden heeft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/locaties">
                <Button size="lg" className="w-full sm:w-auto">
                  Ontdekken
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/claim">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Locatie claimen?
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categorieën
            </h2>
            <p className="text-lg text-gray-600">
              Verken honderden locaties verdeeld over verschillende categorieën
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/locaties?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {category.name[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.count} bedrijven
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Waarom Schiedam.app?
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je nodig hebt om lokale bedrijven te ontdekken en te ondersteunen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">750+</div>
              <div className="text-blue-100">Geregistreerde Bedrijven</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">15K+</div>
              <div className="text-blue-100">Maandelijkse Bezoekers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">2.5K+</div>
              <div className="text-blue-100">Beoordelingen</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Tevredenheid</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section for Business Owners */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Eigenaar van een bedrijf in Schiedam?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Claim je bedrijfspagina, voeg je producten toe en bereik duizenden potentiële bezoekers. 
            Start gratis en upgrade wanneer je klaar bent.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">Claim je Pagina</h3>
              <p className="text-sm text-gray-600">Vind je bedrijf en claim het in enkele stappen</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">Voeg Producten Toe</h3>
              <p className="text-sm text-gray-600">Maak je eigen webshop met onze tools</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">Bereik Bezoekers</h3>
              <p className="text-sm text-gray-600">Verkoop direct aan lokale bezoekers</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/claim">
              <Button size="lg" className="w-full sm:w-auto">
                Gratis Starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Bekijk Tarieven
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}