# Firebase Integration - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Get Firebase Config
```
Go to: https://console.firebase.google.com
1. Create new project
2. Go to Project Settings → Your apps → Add app (Web)
3. Copy the config object
```

### 2. Add to `.env.local`
```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### 3. Create Firestore Database
- Firebase Console → Firestore Database → Create database
- Select "Start in test mode"
- Choose region (e.g., `us-east1`)

### 4. Create Storage
- Firebase Console → Storage → Get started
- Select "Start in test mode"
- Use same region

### 5. Restart Dev Server
```bash
npm run dev
```

✅ Done! All data now saved to Firebase.

---

## 📁 File Reference

### Core Files
| File | Purpose | Status |
|------|---------|--------|
| `lib/firebase.ts` | Firebase initialization | ✅ NEW |
| `lib/firebaseService.ts` | CRUD operations | ✅ NEW |
| `lib/store.ts` | Zustand state | ✅ UPDATED |

### Component Files
| File | Changes | Status |
|------|---------|--------|
| `app/create/page.tsx` | saveToFirebase() | ✅ UPDATED |
| `app/checkout/page.tsx` | Firebase orders | ✅ UPDATED |

### API Routes
| Route | Function | Status |
|-------|----------|--------|
| `/api/generate-comic` | Update comic | ✅ UPDATED |
| `/api/payment` | Create order | ✅ UPDATED |

---

## 💾 Using Firebase Service Functions

### Save a Comic
```typescript
import { saveComic } from '@/lib/firebaseService';

const comicId = await saveComic(userId, {
  story: "My story",
  photos: ["url1", "url2"],
  selectedPlan: "Pro Comic",
  status: "draft",
  userId: "user-123"
});
```

### Upload Photos
```typescript
import { uploadMultipleImages } from '@/lib/firebaseService';

const photoUrls = await uploadMultipleImages(
  userId,
  fileArray,
  comicId
);
```

### Create an Order
```typescript
import { createOrder } from '@/lib/firebaseService';

const orderId = await createOrder(userId, {
  comicId: "comic-123",
  plan: "Pro Comic",
  amount: 49.99,
  shippingAddress: { /* ... */ },
  paymentStatus: "completed"
});
```

### Update Comic Status
```typescript
import { updateComic } from '@/lib/firebaseService';

await updateComic(comicId, {
  status: "ordered"
});
```

---

## 🎯 Using Zustand Store

### Save to Firebase
```typescript
import { useComicStore } from '@/lib/store';

export default function CreatePage() {
  const { saveToFirebase, loading, error } = useComicStore();

  const handleGenerate = async () => {
    try {
      const comicId = await saveToFirebase("user-123");
      // comicId is now available to pass to API
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };
}
```

### Store State
```typescript
const {
  photos,           // File[] - added photos
  story,            // string - written story
  selectedPlan,     // string - chosen plan
  comicId,          // string - saved comic ID
  loading,          // boolean - uploading?
  error,            // string | null - error message
} = useComicStore();
```

### Store Actions
```typescript
const {
  addPhotos,              // (files: File[]) => void
  removePhoto,            // (index: number) => void
  setStory,               // (story: string) => void
  setPlan,                // (plan: string) => void
  setGeneratedComic,      // (comic: string | null) => void
  saveToFirebase,         // (userId: string) => Promise<string>
  loadFromFirebase,       // (comicId: string) => Promise<void>
  reset,                  // () => void
} = useComicStore();
```

---

## 📊 Database Collections

### `/comics/{comicId}`
```typescript
{
  id: string;
  userId: string;
  story: string;
  photos: string[];  // URLs
  selectedPlan: string;
  status: "draft" | "generating" | "generated" | "ordered";
  generatedComicData?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `/orders/{orderId}`
```typescript
{
  id: string;
  userId: string;
  comicId: string;
  plan: string;
  amount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Timestamp;
  estimatedDelivery: Timestamp;
}
```

---

## 🔐 Security Rules

### Firestore (test mode - for development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // TEST MODE ONLY!
    }
  }
}
```

### Firestore (production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /comics/{comicId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage (test mode - for development)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // TEST MODE ONLY!
    }
  }
}
```

### Storage (production)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /comics/{userId}/{comicId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase not initialized"
**Cause:** Config variables not set or missing
**Solution:**
1. Check `.env.local` has all 6 Firebase variables
2. Variable names are case-sensitive: `NEXT_PUBLIC_FIREBASE_*`
3. Restart dev server: `npm run dev`

### Issue: "Permission denied" uploading
**Cause:** Storage rules too restrictive
**Solution:**
1. Check Storage Rules allow your request
2. Use test mode rules during development
3. Ensure userId matches the rules path

### Issue: "CORS error"
**Cause:** Firestore/Storage blocked by CORS
**Solution:**
1. This shouldn't happen with Firebase SDK
2. Check browser console for full error
3. Ensure Firebase config is correct

### Issue: Build fails with "Invalid API key"
**Cause:** `.env.local` not loaded during build
**Solution:**
1. Build uses `.env.local` - no changes needed
2. Make sure Firebase services init gracefully (they do)
3. See `firebase.ts` for null-safe initialization

---

## 🧪 Testing

### Test Photo Upload
```typescript
// In app/create/page.tsx
// Add photos → Click "Continue" → Check Firebase Storage
```

### Test Comic Save
```typescript
// In Firebase Console
// Go to Firestore → collections → comics
// Should see new comic with your story and photo URLs
```

### Test Order Creation
```typescript
// In checkout page
// Enter shipping info → Click "Complete Order"
// Check Firebase → orders collection for new order
```

---

## 🚀 Next Steps

1. ✅ Firebase configured
2. ⏳ Add real authentication (Firebase Auth)
   - Remove mock user IDs
   - Use `getAuth().currentUser?.uid`
3. ⏳ Implement Stripe payments
   - Real payment processing in `/api/payment`
4. ⏳ Integrate OpenAI
   - Real comic generation in `/api/generate-comic`

---

## 📚 Documentation Links

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Integration Summary](./FIREBASE_INTEGRATION_COMPLETE.md)
- [Full Changes List](./FIREBASE_INTEGRATION_SUMMARY.md)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 📞 Support

Check the detailed guides for more information:
- **Setup issues?** → `FIREBASE_SETUP.md`
- **Integration details?** → `FIREBASE_INTEGRATION_COMPLETE.md`
- **What changed?** → `FIREBASE_INTEGRATION_SUMMARY.md`
- **API reference?** → See file comments in `lib/firebaseService.ts`
