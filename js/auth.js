import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.login = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      window.location.href = "painel.html";
    })
    .catch((err) => alert("Erro ao entrar: " + err.message));
};

window.cadastro = function () {
  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((cred) => {
      return set(ref(db, "usuarios/" + cred.user.uid), {
        nome,
        email,
        tipo: "membro"
      });
    })
    .then(() => {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "painel.html";
    })
    .catch((err) => alert("Erro ao cadastrar: " + err.message));
};

window.toggleCadastro = function () {
  const loginDiv = document.getElementById("loginDiv");
  const cadastroDiv = document.getElementById("cadastroDiv");
  loginDiv.style.display = loginDiv.style.display === "none" ? "block" : "none";
  cadastroDiv.style.display = cadastroDiv.style.display === "none" ? "block" : "none";
};
