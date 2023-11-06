import { SessionStorage } from '@shopify/shopify-app-session-storage';
import { Session, SessionParams } from '@shopify/shopify-api';
import { db } from "./firebase.server";

const session_collection = db.collection("session");

export class FirebaseSessionStorage implements SessionStorage {
    async storeSession(session: Session): Promise<boolean> {
        try {
            await session_collection.doc(session.id).set(session.toObject());
            return true;
        } catch (error) {
            // implement your own logger heres
            return false;
        }
    }
}

