import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL: Required by Firebase skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export { onAuthStateChanged, type User };

// Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot (as required by Firestore guidelines)
export async function testConnection(): Promise<boolean> {
  const testPath = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Successfully verified connection to Firestore');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or Firestore config needs attention:', error.message);
    } else {
      console.log('[Firebase] Connection check completed:', error);
    }
    return false;
  }
}

// Subscribe to real-time celebration updates across all devices
export function subscribeCelebrationData(
  onData: (data: any, updatedAt: number) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'celebration/main';
  const unsubscribe = onSnapshot(
    doc(db, 'celebration', 'main'),
    (snapshot) => {
      if (snapshot.exists()) {
        const payload = snapshot.data();
        const updatedAt = Number(payload.updatedAt) || Date.now();
        onData(payload, updatedAt);
      }
    },
    (error) => {
      console.error('[Firebase] Snapshot error on celebration/main:', error);
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
  return unsubscribe;
}

// Save celebration data to Firestore (Real-time device sync)
export async function saveCelebrationData(data: any): Promise<number> {
  const path = 'celebration/main';
  const now = Date.now();
  const payloadToSave = {
    ...data,
    updatedAt: now,
    updatedBy: auth.currentUser?.email || 'admin'
  };

  try {
    await setDoc(doc(db, 'celebration', 'main'), payloadToSave);
    console.log('[Firebase] Successfully synchronized celebration data to Firestore at', new Date(now).toISOString());
    return now;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Google Sign-In via popup for admin authentication
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error) {
    console.error('[Firebase Auth] Google Sign-In error:', error);
    throw error;
  }
}

// Sign out from Firebase
export async function signOutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('[Firebase Auth] Sign out error:', error);
    throw error;
  }
}

// Run connection test once on module load
testConnection();
