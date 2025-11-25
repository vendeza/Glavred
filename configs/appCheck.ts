import { ReactNativeFirebaseAppCheckProvider } from '@react-native-firebase/app-check';

// Configure a Custom Provider
export const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
rnfbProvider.configure({
  android: {
    provider: __DEV__ ? 'debug' : 'playIntegrity',
    debugToken: 'ВАШ_ТОКЕН_ИЗ_FIREBASE_CONSOLE',
  },
  apple: {
    provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    debugToken: '68A07535-77E1-4D13-9819-500A1F02F8AA',
  },
  web: {
    provider: 'reCaptchaV3',
    siteKey: 'unknown',
  },
});
