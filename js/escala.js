import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { ref, set, push, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await get(ref(db, "usuarios/" + user.uid));
  if (!snap.exists()) return;

  const dados = snap.val();

  if (dados.tipo === "lider") {
    document.getElementById("escalaLider").style.display = "block";
    carregarEscalas(dados.ministerio, user.uid);
  } else {
    document.getElementById("escalaMembro").style.display = "block";
    carregarEscalasMembro(user.uid);
  }
});

// Criar escala (líder)
window.criarEscala = async function() {
  const data = document.getElementById("dataCulto").value;
  const hora = document.getElementById("horaCulto").value;

  if (!data || !hora) {
    alert("Preencha data e hora!");
    return;
  }

  const user = auth.currentUser;
  const snap = await get(ref(db, "usuarios/" + user.uid));
  if (!snap.exists()) return;

  const dados = snap.val();
  const novaRef = push(ref(db, "cultos"));

  await set(novaRef, {
    data: data,
    hora: hora,
    ministerio: dados.ministerio,
    criador: user.uid,
    escalados: [user.uid] // líder entra automaticamente
  });

  alert("Escala criada!");
  carregarEscalas(dados.ministerio, user.uid);
};

// Carregar escalas do líder
async function carregarEscalas(ministerio, uid) {
  const snap = await get(ref(db, "cultos"));
  if (!snap.exists()) return;

  let html = "<ul>";
  snap.forEach((child) => {
    const c = child.val();
    if (c.ministerio === ministerio && c.criador === uid) {
      html += `<li>${c.data} - ${c.hora} (${c.ministerio})</li>`;
    }
  });
  html += "</ul>";

  document.getElementById("listaEscalas").innerHTML = html;
}

// Carregar escalas do membro
async function carregarEscalasMembro(uid) {
  const snap = await get(ref(db, "cultos"));
  if (!snap.exists()) return;

  let html = "<ul>";
  snap.forEach((child) => {
    const c = child.val();
    if (c.escalados && c.escalados.includes(uid)) {
      html += `<li>${c.data} - ${c.hora} (${c.ministerio})</li>`;
    }
  });
  html += "</ul>";

  document.getElementById("escalaMembroLista").innerHTML = html;
}
