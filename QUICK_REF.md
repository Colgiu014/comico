# 🚀 Comico - Developer Quick Reference

## Quick Commands

```bash
# Installation
npm install                 # Install all dependencies
npm run dev                # Start development server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint

# URLs
Local:       http://localhost:3000
Create Page: http://localhost:3000/create
Checkout:    http://localhost:3000/checkout
```

## Key Files

```
app/page.tsx                     # Home page
app/create/page.tsx              # Comic creation
app/checkout/page.tsx            # Payment checkout
app/globals.css                  # All styles & animations
lib/store.ts                     # State management
```

## Component Imports

```typescript
// Pages
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import PricingSection from './components/PricingSection'
import TestimonialsSection from './components/TestimonialsSection'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FileUpload from './components/FileUpload'

// State
import { useComicStore } from '@/lib/store'
```

## Common Patterns

### Using State
```typescript
const { photos, story, addPhotos, setStory } = useComicStore()
```

### Animations with Framer Motion
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Glass Morphism Classes
```tsx
<div className="glass">            {/* White glass */}
<div className="glass-dark">       {/* Dark glass */}
<div className="glass-card">       {/* Premium glass */}
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

## CSS Animations

```css
/* Global animations available */
.animate-fade-in-up      /* Fade + slide up */
.animate-slide-in        /* Slide from left */
.animate-pulse-glow      /* Glowing pulse */
.animate-float           /* Floating motion */
.animate-shimmer         /* Shimmer effect */
```

## Adding New Pages

```typescript
// app/yourpage/page.tsx
'use client'

export default function YourPage() {
  return (
    <main>
      <Navbar />
      {/* Your content */}
      <Footer />
    </main>
  )
}
```

## Adding New Components

```typescript
// app/components/YourComponent.tsx
'use client'

import { motion } from 'framer-motion'

export default function YourComponent() {
  return (
    <div className="glass-card p-8 rounded-2xl">
      Content
    </div>
  )
}
```

## API Routes

```typescript
// app/api/yourroute/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  return NextResponse.json(
    { success: true },
    { status: 200 }
  )
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tailwind Quick Classes

```
Colors: text-white, bg-indigo-500, border-white/20
Sizing: w-full, h-12, px-6, py-4
Layout: flex, grid, gap-4
Rounded: rounded-xl, rounded-full, rounded-2xl
Opacity: /10, /20, /50, /60, /70, /80
Responsive: sm:, md:, lg:, xl:
```

## Common Color Values

```
Indigo:  #6366f1 (Primary)
Pink:    #ec4899 (Secondary)
Cyan:    #06b6d4 (Accent)
Slate:   #0f172a (Dark BG)
White:   #ffffff (Light)
```

## Typography

```
Font: Poppins (sans-serif)
Heading: font-bold text-4xl md:text-5xl
Body: text-white/60 text-lg
Small: text-xs text-white/40
```

## Useful Hooks

```typescript
// State
const store = useComicStore()

// Built-in React
useState() setInterval() useCallback()
useEffect() useReducer() useContext()

// Framer Motion animations
animate() transition() whileHover() whileInView()
```

## Testing Components

```typescript
// Quick component test in browser console
const testComponent = () => {
  return <YourComponent />
}
```

## Debugging Tips

```javascript
// Console
console.log()
console.table()
console.time()

// React DevTools
Inspect components, props, state

// Network
Check API calls, responses, headers

// Performance
Check page speed, animations, loading
```

## Build Output Location

```
Production build: .next/
Static export: out/
```

## File Size Limits

- Individual images: 10MB
- Total upload: 100MB
- Page load: < 3 seconds target

## Browser Support

✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile browsers latest

## Common Issues & Fixes

### Pages not updating
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Styles not applying
```bash
# Rebuild Tailwind
npm run dev  # Auto-rebuild on file changes
```

### State not updating
```typescript
// Make sure using hook inside component
// Not in event handler scope
const Component = () => {
  const store = useComicStore()  // ✓ Correct
  
  return <div>{store.story}</div>
}
```

### Animations stuttering
```
# Performance tips:
- Use will-change: transform
- Limit simultaneous animations
- Use requestAnimationFrame
- Check GPU acceleration enabled
```

## Next Steps

1. **Customize colors** → `app/globals.css`
2. **Update copy** → Component files
3. **Add APIs** → `app/api/`
4. **Setup Stripe** → `.env.local`
5. **Deploy** → Vercel

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Need help? Check SETUP.md or FEATURES.md** 📚
