import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_RTLr2GSwNscoYVZ-7v5Loh1zu84EB2Q",
  authDomain: "quoted-ffe2b.firebaseapp.com",
  projectId: "quoted-ffe2b",
  storageBucket: "quoted-ffe2b.appspot.com",
  messagingSenderId: "931666438733",
  appId: "1:931666438733:web:b25b873a56e908d5608a04",
  measurementId: "G-9X8DGEKEVC"
};

// Check if Firebase app is already initialized
if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

// Export the authentication module
export const auth = firebase.auth();
export const firestore = firebase.firestore(); 

