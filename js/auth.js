import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Alternar entre login e cadastro
window.toggleCadastro = function() {
  document.getElementById("loginDiv").style.display =
    document.getElementById("loginDiv").style.display === "none" ? "block" : "none";
  document.getElementById("cadastroDiv").style.display =
    document.getElementById("cadastroDiv").style.display === "none" ? "block" : "none";
};

// Cadastro
window.cadastro = async function() {
  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;
  const tipo = document.getElementById("tipoCadastro").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    await set(ref(db, "usuarios/" + user.uid), {
      nome: nome,
      email: email,
      tipo: tipo,
      ministerio: tipo === "lider" ? "Geral" : ""
    });

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "painel.html";
  } catch (error) {
    alert("Erro: " + error.message);
  }
};

// Login
window.login = async function() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "painel.html";
  } catch (error) {
    alert("Erro: " + error.message);
  }
};

// Logout
window.logout = async function() {
  await signOut(auth);
  window.location.href = "index.html";
};
