import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await get(ref(db, "usuarios/" + user.uid));
  if (!snap.exists()) return;

  const dados = snap.val();

  if (dados.tipo === "admin") {
    document.getElementById("painelAdmin").style.display = "block";
    carregarUsuarios();
  } else if (dados.tipo === "lider") {
    document.getElementById("painelLider").style.display = "block";
  } else {
    document.getElementById("painelMembro").style.display = "block";
  }
});

// Lista de usuários (somente admin)
async function carregarUsuarios() {
  const snap = await get(ref(db, "usuarios"));
  if (!snap.exists()) return;

  let html = "<ul>";
  snap.forEach((child) => {
    const u = child.val();
    html += `<li>${u.nome} - ${u.tipo}</li>`;
  });
  html += "</ul>";

  document.getElementById("listaUsuarios").innerHTML = html;
}
