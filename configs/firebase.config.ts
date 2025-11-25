import { firebase } from '@react-native-firebase/functions';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// // Install the Custom Provider
// initializeAppCheck(getApp(), {
//   provider: rnfbProvider,
//   isTokenAutoRefreshEnabled: true,
// });

if (__DEV__) {
  auth().useEmulator('http://192.168.50.81:9099');
  // storage().useEmulator('192.168.50.81', 9199);
  firebase.functions().useEmulator('192.168.50.81', 5002);
  // firestore().useEmulator('192.168.50.81', 8088);

}

export { auth, firebase, firestore };

