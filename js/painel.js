import { auth, db, logout } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.logout = logout;

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

async function carregarUsuarios() {
  const listaDiv = document.getElementById("listaUsuarios");
  const snap = await get(ref(db, "usuarios"));
  listaDiv.innerHTML = "";

  snap.forEach((child) => {
    const u = child.val();
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${u.nome}</strong> - ${u.email} - [${u.tipo}]
      <select onchange="alterarTipo('${child.key}', this.value)">
        <option value="membro" ${u.tipo === "membro" ? "selected" : ""}>Membro</option>
        <option value="lider" ${u.tipo === "lider" ? "selected" : ""}>Líder</option>
        <option value="admin" ${u.tipo === "admin" ? "selected" : ""}>Administrador</option>
      </select>
    `;
    listaDiv.appendChild(div);
  });
}

window.alterarTipo = function (uid, tipo) {
  update(ref(db, "usuarios/" + uid), { tipo });
};
