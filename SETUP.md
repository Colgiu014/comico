# 🎨 Comico Setup & Development Guide

Welcome to Comico! This guide will help you get up and running with the AI-powered comic book creator platform.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
```bash
# Copy example to .env.local
cp .env.example .env.local

# Edit .env.local and add your API keys:
# - Stripe publishable key
# - Stripe secret key  
# - OpenAI API key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📋 Detailed Setup Instructions

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step-by-Step Installation

#### 1. Clone or Navigate to Project
```bash
cd /home/cristi/dev/comico
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

This installs:
- Next.js 16.1
- React 19.2
- Framer Motion for animations
- Tailwind CSS for styling
- Zustand for state management
- Stripe SDK for payments
- OpenAI SDK for AI integration

#### 3. Configure Environment Variables

Create `.env.local` file in project root:
```env
# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx

# OpenAI API for Comic Generation
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting API Keys:**

**Stripe:**
1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Navigate to Dashboard > Developers > API Keys
4. Copy Publishable and Secret keys (use test keys for development)

**OpenAI:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or sign in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and paste into `.env.local`

#### 4. Start Development Server
```bash
npm run dev
```

Output:
```
> next dev
  ▲ Next.js 16.1.4
  - Local:        http://localhost:3000
  - Environment:  .env.local

Ready in 1.5s
```

#### 5. Access Application
Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🏠 Home Page Features

- **Hero Section**: Eye-catching intro with gradient text
- **Features Section**: 6-step workflow overview
- **Pricing Section**: Three plan options (Starter, Pro, Ultimate)
- **Testimonials Section**: Social proof from happy creators
- **Responsive Design**: Works on all device sizes

## 📸 Create Comic Workflow

### Step 1: Upload Photos
- Drag & drop up to 10 photos
- Supported formats: JPG, PNG, WebP, GIF
- Max file size: 10MB per image
- Real-time preview of selected images

### Step 2: Tell Your Story
- Write narrative descriptions
- Add character details and dialogue
- Scene-by-scene breakdown
- Live character count

### Step 3: Generate Comic
- AI analyzes photos and story
- Creates panel layouts
- Generates artwork
- Processing: 2-3 minutes

### Step 4: Review & Select Plan
- Preview generated comic
- Choose: Starter (20 pages) / Pro (32 pages) / Ultimate (48 pages)
- Customize if needed

### Step 5: Checkout
- Enter shipping address
- Add payment method
- Confirm order
- Receive confirmation email

---

## 🛠️ Project Structure

```
comico/
├── app/
│   ├── api/                          # Server-side routes
│   │   ├── generate-comic/route.ts   # AI generation endpoint
│   │   └── payment/route.ts          # Stripe payment endpoint
│   │
│   ├── components/                   # Reusable React components
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── HeroSection.tsx          # Home page hero
│   │   ├── FeaturesSection.tsx      # Feature showcase
│   │   ├── PricingSection.tsx       # Pricing cards
│   │   ├── TestimonialsSection.tsx  # User testimonials
│   │   ├── FileUpload.tsx           # Photo upload component
│   │   └── Footer.tsx               # Footer
│   │
│   ├── create/                       # Comic creation page
│   │   └── page.tsx                 # Main creation workflow
│   │
│   ├── checkout/                     # Payment page
│   │   └── page.tsx                 # Checkout & order form
│   │
│   ├── globals.css                   # Global styles & animations
│   ├── layout.tsx                    # Root layout wrapper
│   └── page.tsx                      # Home page
│
├── lib/
│   └── store.ts                      # Zustand state management
│
├── public/                           # Static assets
│   └── favicon.ico
│
├── .env.example                      # Environment variables template
├── .env.local                        # Actual env vars (create this)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
└── README.md                         # Documentation
```

---

## 💾 State Management

Using **Zustand** for simple, scalable state:

```typescript
// lib/store.ts
const { photos, story, selectedPlan } = useComicStore();
```

**Store State:**
- `photos[]` - Uploaded image files
- `story` - User-written narrative
- `selectedPlan` - Chosen pricing tier
- `generatedComic` - Generated comic data

---

## 🎨 Design System

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#06b6d4` (Cyan)
- **Dark BG**: `#0f172a` (Slate-900)

### Glass Morphism Classes
```css
.glass          /* White frosted glass */
.glass-dark     /* Dark frosted glass */
.glass-card     /* Premium glass card */
```

### Animation Classes
```css
.animate-fade-in-up     /* Fade + slide up */
.animate-slide-in       /* Slide from left */
.animate-pulse-glow     /* Glowing pulse */
.animate-float          /* Floating motion */
.animate-shimmer        /* Shimmer effect */
```

---

## 🔌 API Endpoints

### Generate Comic
**POST** `/api/generate-comic`

Request:
```json
{
  "photos": [File, File, ...],
  "story": "Your narrative here"
}
```

Response:
```json
{
  "id": "abc123",
  "panels": [...],
  "totalPages": 20,
  "createdAt": "2024-01-25T..."
}
```

### Process Payment
**POST** `/api/payment`

Request:
```json
{
  "email": "user@example.com",
  "plan": "Pro Comic",
  "amount": 49.99
}
```

Response:
```json
{
  "id": "payment_123",
  "status": "completed",
  "timestamp": "2024-01-25T..."
}
```

---

## 🚀 Building for Production

### Build Optimization
```bash
npm run build
```

This:
- Optimizes images
- Minifies code
- Creates static pages where possible
- Analyzes bundle size

### Production Deployment

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel deploy
```

**Docker:**
```bash
# Create Dockerfile (not included, but easy to add)
docker build -t comico .
docker run -p 3000:3000 comico
```

**Other Platforms:**
- AWS Amplify
- Netlify
- Railway
- Heroku

### Environment Variables for Production
Set these in your deployment platform:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx (LIVE KEY)
STRIPE_SECRET_KEY=sk_live_xxx (LIVE KEY)
OPENAI_API_KEY=sk-xxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'framer-motion'"
**Solution:**
```bash
npm install framer-motion
```

### Issue: Stripe keys not working
**Solution:**
- Verify keys are in `.env.local` (not `.env`)
- Check for typos in key names
- Make sure you're using test keys for development
- Restart dev server after changing env vars

### Issue: Photos not uploading
**Solution:**
- Check browser console for errors
- Verify file size < 10MB
- Confirm file format (JPG, PNG, WebP, GIF)
- Check file upload permissions

### Issue: Animations are choppy
**Solution:**
- Enable GPU acceleration in browser settings
- Close unnecessary browser tabs
- Update to latest browser version
- Check system resources (CPU/RAM)

---

## 📚 Learning Resources

### Framework Documentation
- [Next.js Official Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Styling & Animation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)

### External Services
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 💡 Tips & Best Practices

### Performance
- Use `next/image` for image optimization
- Lazy load components with `dynamic()` imports
- Optimize bundle size with code splitting

### Security
- Never commit `.env.local` to git
- Use environment variables for secrets
- Validate all user inputs
- Implement rate limiting for APIs

### Development
- Use TypeScript for type safety
- Follow component naming conventions
- Keep components small and focused
- Test on different devices/browsers

---

## 🤝 Contributing

To contribute improvements:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support & Questions

For issues or questions:
1. Check the troubleshooting section above
2. Review official documentation
3. Check GitHub issues
4. Contact support@comico.app

---

## ✅ Checklist Before Going Live

- [ ] Environment variables configured
- [ ] Stripe keys are LIVE keys (not test)
- [ ] OpenAI API key verified working
- [ ] Database setup (if needed)
- [ ] Email notifications configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Performance testing completed
- [ ] Security audit done
- [ ] Mobile responsiveness tested
- [ ] Browser compatibility verified
- [ ] Backup & disaster recovery plan
- [ ] SSL certificate installed

---

**Happy comic creating! 🎉**
