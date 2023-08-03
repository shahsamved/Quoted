import React from 'react';
import App from 'next/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  // Your Firebase project configuration here
  apiKey: "AIzaSyC_RTLr2GSwNscoYVZ-7v5Loh1zu84EB2Q",
  authDomain: "quoted-ffe2b.firebaseapp.com",
  projectId: "quoted-ffe2b",
  storageBucket: "quoted-ffe2b.appspot.com",
  messagingSenderId: "931666438733",
  appId: "1:931666438733:web:b25b873a56e908d5608a04",
  measurementId: "G-9X8DGEKEVC"
};

if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
