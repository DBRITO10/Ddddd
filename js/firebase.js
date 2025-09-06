import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq6C_QcSm3sNAEMglDsb48eZnIZSoj--M",
  authDomain: "igreja-79733.firebaseapp.com",
  databaseURL: "https://igreja-79733-default-rtdb.firebaseio.com",
  projectId: "igreja-79733",
  storageBucket: "igreja-79733.firebasestorage.app",
  messagingSenderId: "946557316628",
  appId: "1:946557316628:web:e9dc641e5ea6b5af600101"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Erro ao sair:", error);
    alert("Erro ao sair: " + error.message);
  });
}
