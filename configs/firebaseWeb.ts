import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { Functions, connectFunctionsEmulator, getFunctions } from 'firebase/functions';

type RequiredOptionKey = 'apiKey' | 'authDomain' | 'projectId' | 'appId';

const firebaseWebConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys: RequiredOptionKey[] = ['apiKey', 'authDomain', 'projectId', 'appId'];

function ensureFirebaseWebConfig(): FirebaseOptions {
  const missingKeys = requiredKeys.filter(key => !firebaseWebConfig[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase web config is missing required values: ${missingKeys.join(', ')}. ` +
        'Please provide EXPO_PUBLIC_FIREBASE_* environment variables in app.config/app.json.',
    );
  }

  return firebaseWebConfig;
}

let firebaseApp: FirebaseApp | null = null;
let functionsInstance: Functions | null = null;

export function getFirebaseWebApp(): FirebaseApp {
  if (!firebaseApp) {
    const config = ensureFirebaseWebConfig();
    firebaseApp = getApps().length ? getApp() : initializeApp(config);
  }

  return firebaseApp;
}

export function getFirebaseWebFunctions(): Functions {
  if (!functionsInstance) {
    const app = getFirebaseWebApp();
    const region = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION || undefined;
    functionsInstance = getFunctions(app, region);

    if (__DEV__) {
      const emulatorHost = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST;
      const emulatorPort = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT;

      if (emulatorHost && emulatorPort) {
        connectFunctionsEmulator(functionsInstance, emulatorHost, Number(emulatorPort));
      }
    }
  }

  return functionsInstance;
}

