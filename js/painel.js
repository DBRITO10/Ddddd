import { auth, db, logout } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
    carregarDashboard();
    carregarPendentes();
    carregarUsuarios();
  } else if (dados.tipo === "lider") {
    document.getElementById("painelLider").style.display = "block";
  } else if (dados.tipo === "membro") {
    document.getElementById("painelMembro").style.display = "block";
    carregarNotificacoes(user.uid);
  } else {
    alert("Sua conta ainda está pendente de aprovação pelo administrador.");
    logout();
  }
});

// ---------------- Admin Dashboard ----------------
async function carregarDashboard() {
  const snap = await get(ref(db, "usuarios"));
  let totalMembros = 0, totalLideres = 0, totalAdmins = 0, totalPendentes = 0;

  snap.forEach((child) => {
    const u = child.val();
    if (u.tipo === "membro") totalMembros++;
    else if (u.tipo === "lider") totalLideres++;
    else if (u.tipo === "admin") totalAdmins++;
    else if (u.tipo === "pendente") totalPendentes++;
  });

  const snapEscalas = await get(ref(db, "escalas"));
  const totalEscalas = snapEscalas.exists() ? snapEscalas.size : 0;

  document.getElementById("dashboard").innerHTML = `
    <p>Membros: ${totalMembros}</p>
    <p>Líderes: ${totalLideres}</p>
    <p>Admins: ${totalAdmins}</p>
    <p>Pendentes: ${totalPendentes}</p>
    <p>Total de Cultos Escalados: ${totalEscalas}</p>
  `;
}

// ---------------- Pendentes ----------------
async function carregarPendentes() {
  const listaDiv = document.getElementById("usuariosPendentes");
  listaDiv.innerHTML = "";
  const snap = await get(ref(db, "usuarios"));
  snap.forEach((child) => {
    const u = child.val();
    if (u.tipo === "pendente") {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${u.nome}</strong> - ${u.email}
        <button onclick="aprovarUsuario('${child.key}', 'membro')">Aprovar como Membro</button>
        <button onclick="aprovarUsuario('${child.key}', 'lider')">Aprovar como Líder</button>
        <button onclick="aprovarUsuario('${child.key}', 'admin')">Aprovar como Admin</button>
        <button onclick="removerUsuario('${child.key}')">Recusar</button>
      `;
      listaDiv.appendChild(div);
    }
  });
}

window.aprovarUsuario = function (uid, tipo) {
  update(ref(db, "usuarios/" + uid), { tipo }).then(() => {
    carregarPendentes();
    carregarUsuarios();
    carregarDashboard();
  });
};

window.removerUsuario = function (uid) {
  remove(ref(db, "usuarios/" + uid)).then(() => {
    carregarPendentes();
    carregarDashboard();
  });
};

// ---------------- Todos usuários ----------------
async function carregarUsuarios() {
  const listaDiv = document.getElementById("listaUsuarios");
  listaDiv.innerHTML = "";
  const snap = await get(ref(db, "usuarios"));
  snap.forEach((child) => {
    const u = child.val();
    if (u.tipo !== "pendente") {
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
    }
  });
}

window.alterarTipo = function (uid, tipo) {
  update(ref(db, "usuarios/" + uid), { tipo }).then(() => {
    carregarUsuarios();
    carregarDashboard();
  });
};

// ---------------- Notificações (membro) ----------------
async function carregarNotificacoes(uid) {
  const listaDiv = document.getElementById("notificacoes");
  listaDiv.innerHTML = "";
  const snap = await get(ref(db, "notificacoes/" + uid));
  if (!snap.exists()) {
    listaDiv.innerHTML = "<p>Sem notificações.</p>";
    return;
  }
  snap.forEach((child) => {
    const n = child.val();
    const div = document.createElement("div");
    div.innerHTML = `${n.texto} ${n.lida ? "(lida)" : ""}`;
    listaDiv.appendChild(div);
  });
}
