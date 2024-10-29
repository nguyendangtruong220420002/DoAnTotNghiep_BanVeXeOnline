// import { initializeApp } from "@react-native-firebase/app";
// import { firebase, getAuth } from "@react-native-firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// // Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyDnzMB5GEZmPJOxTZkci_HyoB26Wzba3-E",
    authDomain: "vexeonline-66348.firebaseapp.com",
    projectId: "vexeonline-66348",
    storageBucket: "vexeonline-66348.appspot.com",
    messagingSenderId: "1031025673750",
    appId: "1:1031025673750:web:3bf34f3fad26c83a941737",
    measurementId: "G-504BCBV4NN"
};

if (!firebase.apps.length) {
    app = initializeApp(firebaseConfig);
}
// Initialize Firebase
export const auth = getAuth(app);
