import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCilpo9Z76hJlKRrrcevlqjw-ht-xfewTE",
  authDomain: "campusmarket-cfdc3.firebaseapp.com",
  projectId: "campusmarket-cfdc3",
  storageBucket: "campusmarket-cfdc3.firebasestorage.app",
  messagingSenderId: "677193405585",
  appId: "1:677193405585:web:e9612da7719a39cbf7db30",
  measurementId: "G-7FN5LM6DY6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;