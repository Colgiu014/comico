# Firebase Integration Checklist

Complete these steps to enable Firebase data storage for your Comico application.

## ✅ Phase 1: Firebase Project Setup (5 min)

- [ ] **Create Firebase Project**
  - Go to https://console.firebase.google.com
  - Click "Create a project"
  - Name it "Comico" (or your preference)
  - Click "Create project"
  - Wait for it to complete

- [ ] **Create Firestore Database**
  - In Firebase Console → Firestore Database
  - Click "Create database"
  - Select "Start in test mode" (for development)
  - Select region: `us-east1` (or nearest to you)
  - Click "Create"

- [ ] **Create Storage Bucket**
  - In Firebase Console → Storage
  - Click "Get started"
  - Select "Start in test mode"
  - Use same region as Firestore
  - Click "Create"

## ✅ Phase 2: Get Firebase Configuration (5 min)

- [ ] **Create Web App**
  - In Firebase Console → Project Settings (⚙️)
  - Under "Your apps" section
  - Click "Add app" → Select "Web"
  - Enter app name: "Comico Web"
  - Click "Register app"

- [ ] **Copy Firebase Config**
  - Copy the complete firebaseConfig object:
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

## ✅ Phase 3: Configure Environment Variables (2 min)

- [ ] **Create .env.local File**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Add Firebase Config to .env.local**
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
  ```

- [ ] **Verify .env.local is NOT in git**
  - Check `.gitignore` includes `.env.local`
  - Run: `cat .gitignore | grep env`

## ✅ Phase 4: Update Security Rules (3 min)

### Firestore Rules

- [ ] **Set Firestore Rules**
  - Firebase Console → Firestore Database → Rules
  - Replace all content with:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```
  - Click "Publish"

### Storage Rules

- [ ] **Set Storage Rules**
  - Firebase Console → Storage → Rules
  - Replace all content with:
    ```javascript
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if true;
        }
      }
    }
    ```
  - Click "Publish"

**⚠️ Note:** These are test mode rules. For production, see `FIREBASE_SETUP.md` for secure rules.

## ✅ Phase 5: Test the Integration (5 min)

- [ ] **Restart Dev Server**
  ```bash
  npm run dev
  ```

- [ ] **Test Photo Upload**
  - Go to http://localhost:3000/create
  - Click "Upload Your Photos"
  - Select some images
  - Click "Continue →"

- [ ] **Test Comic Save**
  - Write a story in the textarea
  - Click "Continue →" again
  - Wait for generation to complete

- [ ] **Verify Firebase Storage**
  - Firebase Console → Storage
  - Look for folder: `comics/{userId}/`
  - Should see your uploaded image files

- [ ] **Verify Firestore**
  - Firebase Console → Firestore Database → Collections
  - Should see `comics` collection
  - Click on the comic document
  - Verify it has: story, photos (URLs), selectedPlan, status, timestamps

- [ ] **Test Order Creation**
  - From comic review page, click "Proceed to Checkout →"
  - Enter shipping details (any valid data)
  - Click "Complete Order"
  - Watch for success message

- [ ] **Verify Order in Firestore**
  - Firebase Console → Firestore → Collections → `orders`
  - Should see your new order with shipping address and payment status

## ✅ Phase 6: Verify All Systems (2 min)

- [ ] **Check for Errors**
  - Open browser developer tools (F12)
  - Check Console tab - should be no Firebase errors
  - Check Network tab - requests to Firestore/Storage succeed

- [ ] **Verify App Functionality**
  - Create new comic ✓
  - Upload photos ✓
  - Write story ✓
  - Generate comic ✓
  - Create order ✓

- [ ] **Check Files Exist**
  - All files in `lib/firebase.ts` ✓
  - All functions in `lib/firebaseService.ts` ✓
  - Updated `lib/store.ts` with Firebase methods ✓
  - Updated `app/create/page.tsx` with saveToFirebase() ✓
  - Updated `app/checkout/page.tsx` with order creation ✓

## ✅ Phase 7: (Optional) Update Security for Production

- [ ] **Read Production Security Guide**
  - See `FIREBASE_SETUP.md` - "Set Up Firestore Rules (Production)"
  - See `FIREBASE_QUICK_REFERENCE.md` - "Security Rules"

- [ ] **Implement User Authentication** (Recommended)
  - Firebase Console → Authentication → Enable "Email/Password"
  - Create `lib/useAuth.ts` with Firebase Auth hook
  - Replace mock user IDs with `user?.uid`

- [ ] **Update Firestore Rules** (Before deploying)
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

- [ ] **Update Storage Rules** (Before deploying)
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

## 🎉 Completion

Once all checkboxes are complete:

✅ Firebase is fully integrated
✅ Photos upload to Cloud Storage
✅ Comics save to Firestore
✅ Orders save to Firestore
✅ All data is persistent
✅ Ready for next features (Auth, Stripe, OpenAI)

## 📊 Current Limitations

These are expected with test mode / mock setup:

- ⚠️ Using mock user ID instead of real authentication
- ⚠️ Test mode security rules (unsafe for production)
- ⚠️ No email notifications (not implemented)
- ⚠️ Mock payment processing (Stripe not integrated)
- ⚠️ Mock comic generation (OpenAI not integrated)

## 🚀 Next Steps

1. Add real user authentication (Firebase Auth)
2. Implement Stripe for real payment processing
3. Integrate OpenAI for actual comic generation
4. Set up production security rules
5. Deploy to Firebase Hosting

## 📞 Need Help?

- **Setup issues?** → Read `FIREBASE_SETUP.md`
- **Code reference?** → Read `FIREBASE_QUICK_REFERENCE.md`
- **What changed?** → Read `FIREBASE_INTEGRATION_SUMMARY.md`
- **Integration details?** → Read `FIREBASE_INTEGRATION_COMPLETE.md`

---

**Estimated Total Time:** ~25 minutes

**Status:** Ready to begin! ✅
