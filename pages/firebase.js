import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';


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

if (typeof window !== 'undefined' && !firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

// Export the authentication module
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const FieldValue = firebase.firestore.FieldValue;

export const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Invalid credentials. Please check your email and password.');
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw new Error('Failed to sign out.');
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const createUserWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Failed to create a new account.');
  }
};