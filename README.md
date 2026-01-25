This is Comico - an AI-powered comic book creator platform built with Next.js 16, React 19, and modern web technologies.

## 🎨 Comico - Transform Photos & Stories into Comics

A beautiful, fully-featured web application for creating custom comic books using AI. Upload photos, write stories, generate comic layouts with AI, and order professional printed copies.

## ✨ Key Features

- 📸 **Photo Upload** - Drag & drop multiple photos with preview
- ✍️ **Story Creation** - Rich narrative and description input
- 🤖 **AI Comic Generation** - Transform photos/stories into comic panels (2-3 min processing)
- 🎨 **Beautiful UI** - iOS liquid glass design with smooth animations
- 💳 **Stripe Integration** - Secure payment processing
- 📦 **Print & Delivery** - Professional printing & worldwide shipping
- 📱 **Fully Responsive** - Mobile-first design
- 🎭 **Multiple Plans** - Starter (20pg), Pro (32pg), Ultimate (48pg)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Firebase configuration

# Set up Firebase (see FIREBASE_SETUP.md for detailed instructions)
# 1. Create a Firebase project at https://console.firebase.google.com
# 2. Add your Firebase config to .env.local
# 3. Create Firestore database and Storage bucket

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Note**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete Firebase configuration instructions.

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1 | React framework |
| React | 19.2 | UI library |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 11.x | Animations |
| Zustand | 4.4 | State management |
| TypeScript | 5.x | Type safety |
| Firebase | Latest | Database & Storage |
| Stripe | 14.11 | Payments |
| OpenAI | 4.28 | AI integration |

## 📁 Project Structure

```
app/
├── api/                  # API routes
│   ├── generate-comic/  # AI comic generation
│   └── payment/         # Stripe payment
├── components/          # Reusable components
│   ├── Navbar
│   ├── HeroSection
│   ├── FeaturesSection
│   ├── PricingSection
│   ├── Footer
│   └── FileUpload
├── create/             # Comic creation page
├── checkout/           # Payment page
└── globals.css         # Global styles
lib/
└── store.ts           # Zustand store
```

## 🎯 Workflow

1. **Upload** (10 min max per file) - Add photos
2. **Story** - Write narrative  
3. **Generate** (2-3 min) - AI creates comic
4. **Review** - Preview & select plan
5. **Checkout** - Enter shipping & pay

## 🎨 Design Features

### Glassmorphism
- Frosted glass cards with backdrop blur
- Semi-transparent components
- Gradient borders and accents

### Animations  
- Smooth page transitions
- Floating elements
- Glowing pulse effects
- Fade-in-up entrances
- Loading indicators

### Color Scheme
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Cyan (#06b6d4)
- Dark background gradient

## ⚙️ Configuration

### Environment Variables
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Pricing Plans
Edit in [app/components/PricingSection.tsx](app/components/PricingSection.tsx)

### Branding
Modify colors in [app/globals.css](app/globals.css)

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Docker
```bash
docker build -t comico .
docker run -p 3000:3000 comico
```

## 📚 API Endpoints

- `POST /api/generate-comic` - Generate comic from photos/story
- `POST /api/payment` - Process Stripe payment

## 🔐 Security

- PCI-DSS compliant via Stripe
- Secure environment variables
- Input validation
- HTTPS required in production
- CORS protection

## 🐛 Troubleshooting

**Photos not uploading?**
- Max file size: 10MB
- Supported: JPG, PNG, WebP, GIF

**Animations stuttering?**
- Enable GPU acceleration
- Update browser
- Check system resources

**Payment errors?**
- Verify Stripe keys
- Check webhook configuration
- Review Stripe dashboard

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Stripe API](https://stripe.com/docs/api)

## 📄 License

MIT License
