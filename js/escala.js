import { auth, db, logout } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.logout = logout;

let usuarios = {}; // cache de usuários para montar selects

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await get(ref(db, "usuarios/" + user.uid));
  if (!snap.exists()) return;
  const dados = snap.val();

  const snapUsers = await get(ref(db, "usuarios"));
  usuarios = {};
  snapUsers.forEach((child) => {
    const u = child.val();
    if (u.tipo === "membro" || u.tipo === "lider") {
      usuarios[child.key] = u.nome;
    }
  });

  if (dados.tipo === "lider") {
    document.getElementById("escalaLider").style.display = "block";
    preencherSelects();
    carregarEscalas(user.uid);
  } else if (dados.tipo === "membro") {
    document.getElementById("escalaMembro").style.display = "block";
    carregarEscalasMembro(user.uid);
  } else {
    alert("Somente líderes ou membros têm acesso a escalas.");
    logout();
  }
});

// ---------------- Criar escala ----------------
window.criarEscala = async function () {
  const data = document.getElementById("dataCulto").value;
  const hora = document.getElementById("horaCulto").value;

  const pregador = document.getElementById("pregador").value;
  const louvor = document.getElementById("louvor").value;
  const recepcao = document.getElementById("recepcao").value;
  const som = document.getElementById("som").value;

  if (!data || !hora) {
    alert("Preencha data e hora.");
    return;
  }

  const novaRef = push(ref(db, "escalas"));
  await set(novaRef, {
    data, hora,
    funcoes: { Pregador: pregador, Louvor: louvor, Recepção: recepcao, Som: som }
  });

  // Notificações
  [pregador, louvor, recepcao, som].forEach(uid => {
    if (uid) {
      const notifRef = push(ref(db, "notificacoes/" + uid));
      set(notifRef, {
        texto: `Você foi escalado para o culto em ${data} às ${hora}.`,
        lida: false
      });
    }
  });

  alert("Escala criada!");
  carregarEscalas(auth.currentUser.uid);
};

// ---------------- Preencher selects ----------------
function preencherSelects() {
  ["pregador", "louvor", "recepcao", "som"].forEach((id) => {
    const sel = document.getElementById(id);
    sel.innerHTML = "<option value=''>-- Selecione --</option>";
    Object.keys(usuarios).forEach(uid => {
      const opt = document.createElement("option");
      opt.value = uid;
      opt.textContent = usuarios[uid];
      sel.appendChild(opt);
    });
  });
}

// ---------------- Escalas do líder ----------------
async function carregarEscalas(uid) {
  const snap = await get(ref(db, "escalas"));
  const lista = document.getElementById("listaEscalas");
  lista.innerHTML = "";
  snap.forEach((child) => {
    const esc = child.val();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${esc.data} ${esc.hora}</strong><br>
      Pregador: ${usuarios[esc.funcoes.Pregador] || "-"}<br>
      Louvor: ${usuarios[esc.funcoes.Louvor] || "-"}<br>
      Recepção: ${usuarios[esc.funcoes.Recepção] || "-"}<br>
      Som: ${usuarios[esc.funcoes.Som] || "-"}<br><br>`;
    lista.appendChild(div);
  });
}

// ---------------- Escalas do membro ----------------
async function carregarEscalasMembro(uid) {
  const snap = await get(ref(db, "escalas"));
  const lista = document.getElementById("escalaMembroLista");
  lista.innerHTML = "";
  snap.forEach((child) => {
    const esc = child.val();
    let escalado = Object.values(esc.funcoes).includes(uid);
    if (escalado) {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${esc.data} ${esc.hora}</strong><br>
        Funções: ${Object.entries(esc.funcoes)
          .filter(([_, val]) => val === uid)
          .map(([k]) => k)
          .join(", ")}`;
      lista.appendChild(div);
    }
  });
}
