// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Configuração
const firebaseConfig = {
  apiKey: "AIzaSyCq6C_QcSm3sNAEMglDsb48eZnIZSoj--M",
  authDomain: "igreja-79733.firebaseapp.com",
  projectId: "igreja-79733",
  storageBucket: "igreja-79733.firebasestorage.app",
  messagingSenderId: "946557316628",
  appId: "1:946557316628:web:e9dc641e5ea6b5af600101",
  databaseURL: "https://igreja-79733-default-rtdb.firebaseio.com/"
};

// Inicializar
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
