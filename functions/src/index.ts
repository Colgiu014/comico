import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

const db = admin.firestore();

// Generate Comic API - Deployed to Europe
export const generateComic = onRequest({
  cors: true,
  region: "europe-west1",
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {comicId} = req.body;
    // story and photos would be used in production for AI generation

    // Mock comic generation
    // In production, you would:
    // 1. Use OpenAI's API with vision capabilities
    // 2. Send images to Claude or GPT-4 Vision
    // 3. Generate comic panel descriptions
    // 4. Use Stable Diffusion or similar for artwork
    // 5. Compose panels into a comic layout

    const comicData = {
      id: comicId,
      panels: [
        {description: "Opening scene", status: "generated"},
        {description: "Rising action", status: "generated"},
        {description: "Climax", status: "generated"},
        {description: "Resolution", status: "generated"},
      ],
      totalPages: 20,
      createdAt: new Date().toISOString(),
    };

    // Update comic in Firestore
    if (comicId) {
      await db.collection("comics").doc(comicId).update({
        generatedComicData: JSON.stringify(comicData),
        status: "generated",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json(comicData);
  } catch (error) {
    logger.error("Comic generation error:", error);
    res.status(500).json({error: "Failed to generate comic"});
  }
});

// Payment API - Deployed to Europe
export const payment = onRequest({
  cors: true,
  region: "europe-west1",
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, comicId, email, plan, amount, shippingAddress} = req.body;

    // Mock payment processing
    // In production, you would:
    // 1. Initialize Stripe
    // 2. Create a Stripe payment intent
    // 3. Return client secret for frontend payment processing
    // 4. Handle webhook for payment confirmation

    const orderRef = db.collection("orders").doc();
    const now = admin.firestore.Timestamp.now();
    const estimatedDelivery = new admin.firestore.Timestamp(
      now.seconds + 7 * 24 * 60 * 60,
      0
    );

    const order = {
      id: orderRef.id,
      userId,
      comicId,
      plan,
      amount,
      shippingAddress,
      paymentStatus: "completed",
      createdAt: now,
      estimatedDelivery,
    };

    await orderRef.set(order);

    // Update comic status to ordered
    if (comicId) {
      await db.collection("comics").doc(comicId).update({
        status: "ordered",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const paymentData = {
      orderId: orderRef.id,
      email,
      plan,
      amount,
      status: "completed",
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(paymentData);
  } catch (error) {
    logger.error("Payment processing error:", error);
    res.status(500).json({error: "Failed to process payment"});
  }
});
