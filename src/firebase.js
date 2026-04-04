import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUfRr-dTZ5sy5Jfub20TS8WDlLdXvdDgw",
  authDomain: "shoe-shop-1fc86.firebaseapp.com",
  projectId: "shoe-shop-1fc86",
  storageBucket: "shoe-shop-1fc86.firebasestorage.app",
  messagingSenderId: "758147705832",
  appId: "1:758147705832:web:b2dcffe9e66d2f0045925d",
  measurementId: "G-4MKWMMPFY7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
