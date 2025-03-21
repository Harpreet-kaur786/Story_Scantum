// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9YXn7volalmmBKBwlWWOXy6XLSA6zGgs",
    authDomain: "bookborrowapp-90c10.firebaseapp.com",
    projectId: "bookborrowapp-90c10",
    storageBucket: "bookborrowapp-90c10.firebasestorage.app",
    messagingSenderId: "98742677624",
    appId: "1:98742677624:web:1076bfa19339effb7b3d8d"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
