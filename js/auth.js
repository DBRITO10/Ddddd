import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.login = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => window.location.href = "painel.html")
    .catch(err => alert("Erro ao entrar: " + err.message));
};

window.cadastro = function () {
  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then(cred => {
      return set(ref(db, "usuarios/" + cred.user.uid), {
        nome, email, tipo: "pendente"
      });
    })
    .then(() => {
      alert("Cadastro enviado para aprovação do administrador.");
      window.location.href = "index.html";
    })
    .catch(err => alert("Erro ao cadastrar: " + err.message));
};

window.toggleCadastro = function () {
  document.getElementById("loginDiv").style.display =
    document.getElementById("loginDiv").style.display === "none" ? "block" : "none";
  document.getElementById("cadastroDiv").style.display =
    document.getElementById("cadastroDiv").style.display === "none" ? "block" : "none";
};
