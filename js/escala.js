import { auth, db, logout } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.logout = logout;

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
    carregarEscalas(user.uid);
  } else {
    document.getElementById("escalaMembro").style.display = "block";
    carregarEscalasMembro(user.uid);
  }
});

window.criarEscala = async function () {
  const data = document.getElementById("dataCulto").value;
  const hora = document.getElementById("horaCulto").value;
  const user = auth.currentUser;

  if (!data || !hora) {
    alert("Preencha data e hora.");
    return;
  }

  const novaRef = push(ref(db, "escalas"));
  await set(novaRef, {
    lider: user.uid,
    data,
    hora
  });

  alert("Escala criada!");
  carregarEscalas(user.uid);
};

async function carregarEscalas(uid) {
  const snap = await get(ref(db, "escalas"));
  const lista = document.getElementById("listaEscalas");
  lista.innerHTML = "";

  snap.forEach((child) => {
    const esc = child.val();
    if (esc.lider === uid) {
      const div = document.createElement("div");
      div.innerText = `Culto em ${esc.data} às ${esc.hora}`;
      lista.appendChild(div);
    }
  });
}

async function carregarEscalasMembro(uid) {
  const snap = await get(ref(db, "escalas"));
  const lista = document.getElementById("escalaMembroLista");
  lista.innerHTML = "";

  snap.forEach((child) => {
    const esc = child.val();
    const div = document.createElement("div");
    div.innerText = `Culto em ${esc.data} às ${esc.hora}`;
    lista.appendChild(div);
  });
}
