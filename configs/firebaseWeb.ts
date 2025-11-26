import Constants from 'expo-constants';
import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions, type Functions } from 'firebase/functions';

type RequiredOptionKey = 'apiKey' | 'authDomain' | 'projectId' | 'appId';

// Get environment variables from Expo config or process.env
function getEnvVar(key: string): string | undefined {
  const fromConstants = Constants.expoConfig?.extra?.[key];
  const fromProcess = process.env[key];
  const value = fromConstants || fromProcess;
  
  if (__DEV__ && !value && key.startsWith('EXPO_PUBLIC_')) {
    console.warn(`[firebaseWeb] Environment variable ${key} is not set`);
  }
  
  return value;
}

const firebaseWebConfig: FirebaseOptions = {
  apiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  appId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
  storageBucket: getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  measurementId: getEnvVar('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

const requiredKeys: RequiredOptionKey[] = ['apiKey', 'authDomain', 'projectId', 'appId'];

function ensureFirebaseWebConfig(): FirebaseOptions {
  const missingKeys = requiredKeys.filter(key => !firebaseWebConfig[key]);

  if (missingKeys.length > 0) {
    console.error('[firebaseWeb] Missing config keys:', missingKeys);
    console.error('[firebaseWeb] Available keys:', Object.keys(firebaseWebConfig));
    console.error('[firebaseWeb] Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
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
    
    // Log config for debugging (without sensitive data)
    console.log('[firebaseWeb] Initializing with config:', {
      projectId: config.projectId,
      authDomain: config.authDomain,
      hasApiKey: !!config.apiKey,
      hasAppId: !!config.appId,
    });
    
    // Check if app already exists, otherwise initialize
    const existingApps = getApps();
    if (existingApps.length > 0) {
      try {
        firebaseApp = getApp();
        console.log('[firebaseWeb] Using existing Firebase app:', firebaseApp.name);
      } catch (error) {
        console.warn('[firebaseWeb] Failed to get existing app, initializing new one:', error);
        // Try without explicit name first
        try {
          firebaseApp = initializeApp(config);
        } catch (initError) {
          // If that fails, try with explicit name
          firebaseApp = initializeApp(config, '[DEFAULT]');
        }
        console.log('[firebaseWeb] Initialized new Firebase app with projectId:', config.projectId);
      }
    } else {
      // Try without explicit name first
      try {
        firebaseApp = initializeApp(config);
      } catch (initError) {
        // If that fails, try with explicit name
        firebaseApp = initializeApp(config, '[DEFAULT]');
      }
      console.log('[firebaseWeb] Initialized new Firebase app with projectId:', config.projectId);
    }
    
    // Verify app is valid
    if (!firebaseApp || !firebaseApp.name) {
      throw new Error('Firebase app initialization failed - app is invalid');
    }
  }

  return firebaseApp;
}

export async function getFirebaseWebFunctions(): Promise<Functions> {
  if (!functionsInstance) {
    // Ensure app is initialized first
    const app = getFirebaseWebApp();
    
    // Verify app is valid
    if (!app) {
      throw new Error('Firebase app was not initialized properly');
    }
    
    console.log('[firebaseWeb] Getting Functions for app:', app.name);

    // Dynamically import Functions module to ensure service is registered

    const region = getEnvVar('EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION') || undefined;
    
    // Use getApp() to ensure we have the default app instance
    // This is important because getFunctions needs the exact app instance
    try {
      const defaultApp = getApp();
      console.log('[firebaseWeb] Using default app:', defaultApp.name);
      
      // Try to get functions - start without region to see if that works
      try {
        if (region) {
          console.log('[firebaseWeb] Attempting to get Functions with region:', region);
          functionsInstance = getFunctions(defaultApp, region);
          console.log('[firebaseWeb] Successfully got Functions instance with region');
        } else {
          console.log('[firebaseWeb] Attempting to get Functions without region');
          functionsInstance = getFunctions(defaultApp);
          console.log('[firebaseWeb] Successfully got Functions instance without region');
        }
      } catch (functionsError) {
        console.error('[firebaseWeb] Failed to get Functions:', functionsError);
        // If region was specified, try without it
        if (region) {
          console.log('[firebaseWeb] Retrying without region...');
          functionsInstance = getFunctions(defaultApp);
          console.log('[firebaseWeb] Successfully got Functions instance without region (fallback)');
        } else {
          throw functionsError;
        }
      }
      
      // Connect to emulator if in dev mode
      if (__DEV__) {
        const emulatorHost = getEnvVar('EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST');
        const emulatorPort = getEnvVar('EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT');

        if (emulatorHost && emulatorPort) {
          try {
            connectFunctionsEmulator(functionsInstance, emulatorHost, Number(emulatorPort));
            console.log(`[firebaseWeb] Connected to Functions emulator at ${emulatorHost}:${emulatorPort}`);
          } catch (error) {
            console.warn('[firebaseWeb] Failed to connect to Functions emulator:', error);
          }
        }
      }
    } catch (error) {
      console.error('[firebaseWeb] Failed to get Functions instance:', error);
      console.error('[firebaseWeb] App state:', {
        name: app.name,
        options: app.options,
        apps: getApps().map(a => ({ name: a.name, projectId: a.options?.projectId })),
      });
      throw new Error(
        `Failed to initialize Firebase Functions: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        'Make sure Firebase App is properly initialized before calling getFunctions.'
      );
    }
  }

  return functionsInstance;
}

