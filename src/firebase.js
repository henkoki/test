import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyD0eOUNiXpYxdsqvgHVvudEWBYTHkSJxns",
   authDomain: "gymtraffic-82113.firebaseapp.com",
   projectId: "gymtraffic-82113",
   storageBucket: "gymtraffic-82113.appspot.com",
   messagingSenderId: "421416983993",
   appId: "1:421416983993:web:97699d66bc53f2c6d26a68",
   measurementId: "G-SL26NCMFM6"
};
   
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
   

  
  
  
  
  
