import { SessionStorage } from '@shopify/shopify-app-session-storage';
import { Session, SessionParams } from '@shopify/shopify-api';
import { db } from "./firebase.server";

const session_collection = db.collection("session");

/**
 * Implementation of the SessionStorage interface that stores sessions in Firebase.
 */
export class FirebaseSessionStorage implements SessionStorage {
    /**
     * Stores a session in Firebase.
     *
     * @param session - The session to be stored.
     * @returns A promise that resolves to true if the session is successfully stored, or false if an error occurs.
     */
    async storeSession(session: Session): Promise<boolean> {
        try {
            await session_collection.doc(session.id).set(session.toObject());
            return true;
        } catch (error) {
            // Implement your own logger here
            return false;
        }
    }
    
    /**
     * Loads a session from Firebase by its ID.
     *
     * @param id - The ID of the session to load.
     * @returns A promise that resolves to the loaded session or undefined if it doesn't exist or an error occurs.
     */
    async loadSession(id: string): Promise<Session | undefined> {
        try {
            const doc = await session_collection.doc(id).get();
            if (doc.exists) {
                const sessionP = doc.data() as SessionParams;
                return new Session(sessionP) as Session;
            } else {
                // Implement your own logger here
                return undefined;
            }
        } catch (error) {
            // Implement your own logger here
            return undefined;
        }
    }

    /**
     * Deletes a session from Firebase by its ID.
     *
     * @param id - The ID of the session to delete.
     * @returns A promise that resolves to true if the session is successfully deleted, or false if an error occurs.
     */
    async deleteSession(id: string): Promise<boolean> {
        try {
            await session_collection.doc(id).delete();
            return true;
        } catch (error) {
            // Implement your own logger here
            return false;
        }
    }

    /**
     * Deletes multiple sessions from Firebase by their IDs.
     *
     * @param ids - An array of IDs of sessions to delete.
     * @returns A promise that resolves to true if all sessions are successfully deleted, or false if an error occurs.
     */
    async deleteSessions(ids: string[]): Promise<boolean> {
        try {
            await Promise.all(ids.map(async (id) => {
                await session_collection.doc(id).delete();
            }));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Finds sessions in Firebase that match the given shop name.
     *
     * @param shop - The name of the shop to search for.
     * @returns A promise that resolves to an array of matching sessions or an empty array if none are found or an error occurs.
     */
    async findSessionsByShop(shop: string): Promise<Session[]> {
        try {
            const docs = await session_collection.where("shop", "==", shop).get();
            if (docs.empty) {
                return [];
            } else {
                return docs.docs.map((doc) => {
                    const sessionP = doc.data() as SessionParams;
                    return new Session(sessionP) as Session;
                });
            }
        } catch (error) {
            // Implement your own logger here
            return [];
        }
    }
}
