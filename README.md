# Schiedam.app

Dé complete app voor alle bedrijven, horeca, winkels, verenigingen en locaties in Schiedam. Eigenaren kunnen hun pagina claimen, een webshop toevoegen en hun bedrijfspagina aanpassen.

## 🚀 Features

### Kernfunctionaliteiten
- **Directory** - Zoeken en filteren van bedrijven en locaties
- **Claim Systeem** - Bedrijfseigenaren kunnen hun pagina claimen
- **Webshop** - Geïntegreerde webshop functionaliteit per bedrijf
- **Abonnementen** - Verschillende plannen (Free, Business, Pro, VIP)
- **Betalingen** - Stripe en Mollie integratie
- **PWA** - Progressive Web App functionaliteit
- **Responsive** - Werkt op alle devices

### Gebruikersrollen
- **Admin** - Volledige toegang tot alle functies
- **Eigenaar** - Beheer van eigen bedrijfspagina en webshop
- **Bezoeker** - Zoeken, winkelen en beoordelen

### Abonnementenstructuur
| Plan | Prijs/maand | Producten | Afbeeldingen | Video | Chat |
|------|-------------|-----------|-------------|-------|------|
| **Free** | €0 | 10 | 1 | ❌ | ❌ |
| **Business** | €1 | 50 | 5 | ❌ | ✅ |
| **Pro** | €2 | 100 | 10 | ✅ | ✅ |
| **VIP** | Op aanvraag | 250 | 24 | ✅ | ✅ |

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ met App Router en TypeScript
- **UI Framework**: Shadcn/ui met Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Betalingen**: Stripe en Mollie
- **Maps**: Google Maps Embed API
- **Chat**: WhatsApp/Messenger integratie
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm of yarn
- Supabase account
- Stripe account (optioneel)
- Mollie account (optioneel)
- Google Maps API key (optioneel)

## 🚀 Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd schiedam
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Kopieer `env.example` naar `.env.local` en vul de variabelen in:

```bash
cp env.example .env.local
```

```env
# Supabase (Verplicht)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (Optioneel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Mollie (Optioneel)
MOLLIE_API_KEY=your_mollie_api_key

# Google Maps (Optioneel)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@schiedam.app

# WhatsApp/Messenger (Optioneel)
WHATSAPP_API_KEY=your_whatsapp_api_key
MESSENGER_API_KEY=your_messenger_api_key
```

### 4. Supabase Setup

#### 4.1 Database Schema
Voer het volgende SQL script uit in je Supabase SQL Editor:

<details>
<summary>Klik hier voor het complete database schema</summary>

```sql
-- Maak eerst de benodigde extensies aan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles tabel gekoppeld aan auth.users
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role VARCHAR(20) CHECK (role IN ('admin', 'eigenaar', 'bezoeker')) NOT NULL DEFAULT 'bezoeker',
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    mollie_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorieën
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bedrijven/locaties
CREATE TABLE businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    address TEXT NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) DEFAULT 'Schiedam',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    owner_id UUID REFERENCES profiles(id),
    claimed BOOLEAN DEFAULT FALSE,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('free', 'business', 'pro', 'vip')) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [Rest van het schema - zie originele specificatie]
```

</details>

#### 4.2 Row Level Security (RLS)
De RLS policies zijn al gedefinieerd in het schema. Zorg ervoor dat RLS is ingeschakeld.

#### 4.3 Storage Buckets
Maak de volgende storage buckets aan in Supabase:
- `business-images` - Voor bedrijfsafbeeldingen
- `product-images` - Voor productafbeeldingen
- `avatars` - Voor profielafbeeldingen

### 5. Development Server
```bash
npm run dev
```

De app is nu beschikbaar op [http://localhost:3000](http://localhost:3000)

## 👤 Demo Accounts

Voor ontwikkeling en testen kunnen demo accounts worden aangemaakt via de admin interface of direct in de database.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── directory/         # Business directory
│   ├── business/          # Individual business pages
│   ├── dashboard/         # User dashboards
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🎨 Theme Customization

De app ondersteunt 10 vooraf gedefinieerde themakleuren plus custom kleuren:

```typescript
const THEME_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  // ... meer kleuren
]
```

## 🔧 Development

### Code Style
- TypeScript voor type safety
- ESLint en Prettier voor code formatting
- Tailwind CSS voor styling
- Shadcn/ui voor consistente UI components

### Testing
```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run test:e2e    # End-to-end tests
```

### Building
```bash
npm run build       # Production build
npm run start       # Start production server
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push naar GitHub repository
2. Connect je repository in Vercel
3. Voeg environment variables toe
4. Deploy!

### Environment Variables voor Production
Zorg ervoor dat alle environment variables zijn ingesteld in je productie omgeving.

## 📱 PWA Features

De app is gebouwd als Progressive Web App met:
- Offline functionaliteit
- Push notifications
- App-like ervaring op mobile
- Automatic caching

## 🔐 Security

- Row Level Security (RLS) in Supabase
- Input validation en sanitization
- HTTPS verplicht in productie
- Secure authentication met Supabase Auth

## 📊 Analytics & Monitoring

- Error tracking met Supabase
- Performance monitoring
- User analytics (GDPR compliant)

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 💬 Support

Voor vragen of support:
- Email: info@schiedam.app
- GitHub Issues: [Create an issue](../../issues)

## 🔄 Roadmap

- [ ] Multi-language support (NL/EN)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API voor third-party integraties
- [ ] Advanced SEO optimizations
- [ ] Real-time chat system

---

**Made with ❤️ for Schiedam**