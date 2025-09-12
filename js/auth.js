import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => window.location.href = "painel.html")
    .catch(err => alert("Erro ao entrar: " + err.message));
};
