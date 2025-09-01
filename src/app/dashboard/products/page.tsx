'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Euro, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  Search
} from 'lucide-react'
import { useAuth, useRole } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { db } from '@/lib/supabase'
import { Product, SUBSCRIPTION_PLANS } from '@/types/database'
import { toast } from 'sonner'
import Image from 'next/image'
import { getProductPlaceholderImage } from '@/lib/utils'

export default function ProductsPage() {
  const { profile } = useAuth()
  const { isOwner } = useRole()
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    active: true
  })

  useEffect(() => {
    if (!isOwner) {
      router.push('/dashboard')
      return
    }
    loadBusinessAndProducts()
  }, [profile?.id, isOwner])

  const loadBusinessAndProducts = async () => {
    if (!profile?.id) return

    try {
      setLoading(true)
      // Get business
      const { data: businesses } = await db.getBusinesses({ limit: 100 })
      const ownedBusiness = (businesses as any[])?.find((b: any) => b.owner_id === profile.id)
      
      if (!ownedBusiness) {
        toast.error('Je hebt nog geen bedrijf geclaimd')
        router.push('/claim')
        return
      }

      setBusiness(ownedBusiness)

      // Get products
      const { data: productsData } = await db.getProducts(ownedBusiness.id)
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Fout bij laden van gegevens')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!business || !productData.name || !productData.price) {
      toast.error('Vul alle verplichte velden in')
      return
    }

    try {
      const { error } = await db.createProduct({
        business_id: business.id,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        image_url: productData.image_url,
        active: productData.active
      })

      if (error) throw error

      toast.success('Product succesvol toegevoegd!')
      setShowAddDialog(false)
      resetProductData()
      loadBusinessAndProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Fout bij toevoegen van product')
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct || !productData.name || !productData.price) {
      toast.error('Vul alle verplichte velden in')
      return
    }

    try {
      const { error } = await db.updateProduct(editingProduct.id, {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        image_url: productData.image_url,
        active: productData.active,
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      toast.success('Product succesvol bijgewerkt!')
      setEditingProduct(null)
      resetProductData()
      loadBusinessAndProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Fout bij bijwerken van product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return

    try {
      const { error } = await db.deleteProduct(productId)
      if (error) throw error

      toast.success('Product succesvol verwijderd!')
      loadBusinessAndProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Fout bij verwijderen van product')
    }
  }

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await db.updateProduct(product.id, {
        active: !product.active,
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      toast.success(`Product ${product.active ? 'gedeactiveerd' : 'geactiveerd'}!`)
      loadBusinessAndProducts()
    } catch (error) {
      console.error('Error toggling product status:', error)
      toast.error('Fout bij wijzigen productstatus')
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setProductData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
      active: product.active
    })
  }

  const resetProductData = () => {
    setProductData({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
      active: true
    })
  }

  const updateProductData = (field: string, value: string | boolean) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const planLimits = business ? SUBSCRIPTION_PLANS[business.subscription_plan as keyof typeof SUBSCRIPTION_PLANS] : SUBSCRIPTION_PLANS.free
  const canAddProduct = products.length < planLimits.maxProducts

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="p-6">
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            Je hebt nog geen bedrijf geclaimd. Claim eerst een bedrijf om producten te kunnen beheren.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Productbeheer
          </h1>
          <p className="text-gray-600">
            Beheer de producten in je webshop voor {business.name}
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button disabled={!canAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Product Toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nieuw Product Toevoegen</DialogTitle>
              <DialogDescription>
                Voeg een nieuw product toe aan je webshop
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              data={productData}
              onChange={updateProductData}
              onSubmit={handleAddProduct}
              onCancel={() => {
                setShowAddDialog(false)
                resetProductData()
              }}
              submitText="Product Toevoegen"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Productlimiet</h3>
              <p className="text-sm text-gray-600">
                {business.subscription_plan.toUpperCase()} plan
              </p>
            </div>
            <Badge variant={canAddProduct ? 'default' : 'destructive'}>
              {products.length} / {planLimits.maxProducts}
            </Badge>
          </div>
          <Progress value={(products.length / planLimits.maxProducts) * 100} className="mb-2" />
          {!canAddProduct && (
            <p className="text-sm text-orange-600">
              Je hebt je productlimiet bereikt. Upgrade je abonnement om meer producten toe te voegen.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Zoek producten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Producten ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Voorraad</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image_url || getProductPlaceholderImage(product.name, 'small')}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{product.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'Actief' : 'Inactief'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProductStatus(product)}
                        >
                          {product.active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Product Bewerken</DialogTitle>
                              <DialogDescription>
                                Bewerk de gegevens van {product.name}
                              </DialogDescription>
                            </DialogHeader>
                            <ProductForm
                              data={productData}
                              onChange={updateProductData}
                              onSubmit={handleEditProduct}
                              onCancel={() => {
                                setEditingProduct(null)
                                resetProductData()
                              }}
                              submitText="Product Bijwerken"
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nog geen producten
              </h3>
              <p className="text-gray-600 mb-4">
                Voeg je eerste product toe om te beginnen met verkopen.
              </p>
              {canAddProduct && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Eerste Product Toevoegen
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Product Form Component
function ProductForm({ 
  data, 
  onChange, 
  onSubmit, 
  onCancel, 
  submitText 
}: {
  data: any
  onChange: (field: string, value: string | boolean) => void
  onSubmit: () => void
  onCancel: () => void
  submitText: string
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Productnaam *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Naam van het product"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Prijs (€) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={data.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Beschrijf je product..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Voorraad</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={data.stock}
            onChange={(e) => onChange('stock', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="image_url">Afbeelding URL</Label>
          <Input
            id="image_url"
            value={data.image_url}
            onChange={(e) => onChange('image_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="active"
          checked={data.active}
          onChange={(e) => onChange('active', e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="active">Product is actief</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSubmit} className="flex-1">
          {submitText}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
      </div>
    </div>
  )
}
