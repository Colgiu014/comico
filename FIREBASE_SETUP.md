# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Comico project. Firebase is used for:
- **Firestore**: Storing comic and order data
- **Storage**: Storing uploaded photos and generated comic images
- **Authentication**: Managing user sessions (optional)

## Prerequisites

- A Google account
- Node.js and npm installed
- The Comico project running locally

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter a project name (e.g., "Comico")
4. Optionally enable Google Analytics
5. Click "Create project"
6. Wait for the project to be created

## Step 2: Create a Firestore Database

1. In the Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (for development)
   - **Warning**: Test mode allows anyone with your database URL to read/write. Switch to production rules before deploying.
4. Select a region (e.g., `us-east1`)
5. Click "Create"

## Step 3: Create a Storage Bucket

1. In the Firebase Console, go to **Storage**
2. Click "Get started"
3. Select "Start in test mode"
4. Select the same region as your Firestore database
5. Click "Create"

## Step 4: Create a Web App

1. In the Firebase Console, go to **Project settings** (gear icon)
2. Under "Your apps", click "Add app"
3. Select "Web"
4. Enter an app name (e.g., "Comico Web")
5. Check "Also set up Firebase Hosting"
6. Click "Register app"

## Step 5: Get Your Firebase Config

1. After registering the app, you'll see the Firebase config
2. Copy the configuration object

Example format:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 6: Add Firebase Config to Your Project

1. Create a `.env.local` file in the root of the Comico project:

```bash
cp .env.example .env.local
```

2. Fill in your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

3. Save the file

## Step 7: Set Up Firestore Rules (Production)

For production, update your Firestore rules for security:

1. In Firebase Console, go to **Firestore Database**
2. Click "Rules"
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Comics collection - users can read/write their own
    match /comics/{comicId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Orders collection - users can read/write their own
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 8: Set Up Storage Rules

1. In Firebase Console, go to **Storage**
2. Click "Rules"
3. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated users can read/write their own files
    match /comics/{userId}/{comicId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Restart the Development Server

After adding the Firebase configuration:

```bash
npm run dev
```

## Database Schema

### Comics Collection (`/comics/{comicId}`)

```typescript
{
  id: string;              // Document ID (auto-generated)
  userId: string;          // User who created the comic
  story: string;           // The story/narrative
  photos: string[];        // Array of photo URLs in Storage
  selectedPlan: string;    // 'Starter Comic', 'Pro Comic', 'Ultimate Comic'
  status: string;          // 'draft' | 'generated' | 'ordered' | 'printed'
  generatedComicData: string;  // JSON string of generated comic data
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

### Orders Collection (`/orders/{orderId}`)

```typescript
{
  id: string;              // Document ID (auto-generated)
  userId: string;          // User who placed the order
  comicId: string;         // Reference to the comic
  plan: string;            // The selected plan
  amount: number;          // Order amount in dollars
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentStatus: string;   // 'pending' | 'completed' | 'failed'
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

## Troubleshooting

### Issue: "Firebase app not initialized"
- Check that `.env.local` has all Firebase config variables
- Verify the variable names match exactly (case-sensitive)
- Restart the development server

### Issue: "Permission denied" when uploading photos
- Check that Storage rules are updated
- Verify you're authenticated (currently using mock user ID)
- Check that the storage bucket path matches the rules

### Issue: "Failed to save to Firestore"
- Check that Firestore database is created
- Verify the collection paths match (`comics` and `orders`)
- Check Firestore rules allow the operation

## Authentication (Optional)

The current implementation uses a mock user ID. To add real authentication:

1. Enable Firebase Authentication in the Console
2. Add "Email/Password" as a sign-in provider
3. Create a `lib/useAuth.ts` hook for auth context
4. Update components to use real user IDs from auth

Example:
```typescript
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

## Next Steps

1. Test the upload functionality in the Create page
2. Verify comics are saved to Firestore
3. Verify photos are uploaded to Storage
4. Test the checkout flow with Firebase orders
5. Implement real Stripe payment processing
6. Integrate OpenAI for comic generation

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security/start)
- [Next.js Firebase Integration](https://github.com/vercel/next.js/tree/canary/examples/with-firebase)
