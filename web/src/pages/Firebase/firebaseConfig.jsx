// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnzMB5GEZmPJOxTZkci_HyoB26Wzba3-E",
  authDomain: "vexeonline-66348.firebaseapp.com",
  projectId: "vexeonline-66348",
  storageBucket: "vexeonline-66348.appspot.com",
  messagingSenderId: "1031025673750",
  appId: "1:1031025673750:web:3bf34f3fad26c83a941737",
  measurementId: "G-504BCBV4NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);