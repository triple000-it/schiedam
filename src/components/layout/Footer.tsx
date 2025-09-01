import Link from 'next/link'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Locaties",
      links: [
        { name: "Alle Bedrijven", href: "/locaties" },
                  { name: "Shop", href: "/shop" },
        { name: "Horeca", href: "/locaties?category=horeca" },
        { name: "Winkels", href: "/locaties?category=winkels" },
        { name: "Sport", href: "/locaties?category=sport" },
        { name: "Diensten", href: "/locaties?category=diensten" },
      ]
    },
    {
      title: "Voor Eigenaren",
      links: [
        { name: "Bedrijf Claimen", href: "/claim" },
        { name: "Abonnementen", href: "/pricing" },
        { name: "Help & Support", href: "/support" },
        { name: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Over Ons",
      links: [
        { name: "Over Schiedam.app", href: "/about" },
        { name: "Privacy Beleid", href: "/privacy" },
        { name: "Algemene Voorwaarden", href: "/terms" },
        { name: "Cookie Beleid", href: "/cookies" },
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">
                  Schiedam.app
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Dé complete gids voor alle bedrijven, horeca, winkels, verenigingen en locaties in Schiedam. 
                Ontdek, shop en verbind met lokale ondernemers.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Schiedam, Nederland</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@schiedam.app</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>www.schiedam.app</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-300">
            Schiedam.app © {currentYear}
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6 text-sm text-gray-300">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacybeleid
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Algemene voorwaarden
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookiebeleid
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact 
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action for Business Owners */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <h4 className="font-semibold">Eigenaar van een bedrijf in Schiedam?</h4>
              <p className="text-blue-100 text-sm">
                Claim je pagina en bereik meer bezoekers met je eigen webshop.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/claim"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
              >
                Bedrijf Claimen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
