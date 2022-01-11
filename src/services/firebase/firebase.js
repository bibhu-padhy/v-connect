import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyBOtICfPc-TOL_YGdyOpH3ZuLDE_hxWGq0",
  authDomain: "v-connect-58e0d.firebaseapp.com",
  projectId: "v-connect-58e0d",
  storageBucket: "v-connect-58e0d.appspot.com",
  messagingSenderId: "182567770896",
  appId: "1:182567770896:web:9661905c529f13017ea395",
  measurementId: "G-JEBS2XCZGK",
});

export const firestore = app.firestore();
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
