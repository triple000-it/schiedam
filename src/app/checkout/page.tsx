'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart and show success
    clearCart()
    toast.success('Bestelling succesvol geplaatst!')
    router.push('/dashboard')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Geen items om af te rekenen</h1>
            <p className="text-gray-500 mb-8">Je winkelwagen is leeg</p>
            <Button onClick={() => router.push('/shop')}>
              Ga naar shop
            </Button>
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
                Afrekenen
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Voltooi je bestelling en steun lokale ondernemers in Schiedam
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug
            </Button>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Klantgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Voornaam</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={profile?.full_name?.split(' ')[0] || ''} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Achternaam</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={profile?.full_name?.split(' ').slice(1).join(' ') || ''} 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ''} 
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefoon</Label>
                  <Input id="phone" type="tel" />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Verzendadres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Input id="address" placeholder="Straatnaam en huisnummer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postcode</Label>
                    <Input id="postalCode" placeholder="1234 AB" />
                  </div>
                  <div>
                    <Label htmlFor="city">Plaats</Label>
                    <Input id="city" defaultValue="Schiedam" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Betaalmethode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="ideal" name="payment" value="ideal" defaultChecked />
                    <Label htmlFor="ideal">iDEAL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="card" name="payment" value="card" />
                    <Label htmlFor="card">Creditcard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="paypal" name="payment" value="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Bestelling Samenvatting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.businessName}</p>
                          <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotaal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verzending</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Totaal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Veilig betalen</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Je gegevens worden versleuteld verzonden
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Verwerken...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Bestelling plaatsen - €{totalPrice.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>✓ Gratis verzending vanaf €25</p>
                    <p>✓ 30 dagen retourrecht</p>
                    <p>✓ Veilig betalen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
