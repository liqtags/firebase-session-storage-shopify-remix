import admin from "firebase-admin"

const serviceAccount = require("./serviceAccountKey.json")

if (!serviceAccount) {
  throw new Error("Missing serviceAccountKey.json file")
}

// Check if there are no existing Firebase apps initialized, and if so, initialize one.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

export const db = admin.firestore();

/**
 * Retrieves Shopify shop data from Firestore.
 *
 * @param shop - The name of the shop for which to retrieve data.
 * @returns A promise that resolves to the retrieved data or null if the data doesn't exist or an error occurs.
 */
export const getShopifyShopData = async (shop: string) => {
    try {
        const doc = await db.collection("shops").doc(shop).get();
        if (doc.exists) {
            return doc.data();
        } else {
            // Implement your own logger here
            return null;
        }
    } catch (error) {
        // Implement your own logger here
        return null;
    }
}

/**
 * Sets Shopify shop data in Firestore.
 *
 * @param shop - The name of the shop for which to set the data.
 * @param data - The data to set for the shop.
 */
export const setShopifyShopData = async (shop: string, data: any) => {
    try {
        await db.collection("shops").doc(shop).set(data);
        return true;
    } catch (error) {
        // Implement your own logger here
        return false;
    }
}