document.addEventListener("DOMContentLoaded", function () {
  const presentacion = document.querySelector(".presentacion");
  const login = document.getElementById("login");
  const botonMostrarLogin = document.querySelector("button[onclick='mostrarLogin()']");
  const botonIniciarSesion = document.querySelector("button[onclick='iniciarSesion()']");

  // Mostrar formulario de login
  botonMostrarLogin.addEventListener("click", function () {
    presentacion.classList.add("oculto");
    login.classList.remove("oculto");
  });

  // Redirigir según rol
  botonIniciarSesion.addEventListener("click", function () {
    const rol = document.getElementById("rol").value;
    if (rol === "admin") {
      window.location.href = "admin.html";
    } else if (rol === "docente") {
      window.location.href = "docente.html";
    } else if (rol === "regencia") {
      window.location.href = "regencia.html";
    }
  });
});

let netbookActual = null;

function seleccionarNetbook(elemento) {
  const id = elemento.dataset.id;
  netbookActual = elemento;
  document.getElementById("modal-id").textContent = "#" + id;

  const estadoGuardado = localStorage.getItem(`netbook-${id}-estado`) || "disponible";
  const observacionGuardada = localStorage.getItem(`netbook-${id}-obs`) || "";

  document.getElementById("estado").value = estadoGuardado;
  document.getElementById("observacion").value = observacionGuardada;

  document.getElementById("modal").classList.remove("oculto");
}

function guardarCambios() {
  const id = netbookActual.dataset.id;
  const estado = document.getElementById("estado").value;
  const observacion = document.getElementById("observacion").value;

  // Guardar en localStorage
  localStorage.setItem(`netbook-${id}-estado`, estado);
  localStorage.setItem(`netbook-${id}-obs`, observacion);

  // Actualizar clases visuales
  netbookActual.classList.remove("pedida", "daniada");
  if (estado === "pedida") {
    netbookActual.classList.add("pedida");
  } else if (estado === "daniada") {
    netbookActual.classList.add("daniada");
  }

  cerrarModal();
  actualizarContadores();
}

function cerrarModal() {
  document.getElementById("modal").classList.add("oculto");
}

// Restaurar estados al cargar
document.addEventListener("DOMContentLoaded", function () {
  for (let i = 1; i <= 30; i++) {
    const estado = localStorage.getItem(`netbook-${i}-estado`);
    const el = document.querySelector(`.netbook[data-id='${i}']`);
    if (estado && el) {
      el.classList.add(estado);
    }
  }
  actualizarContadores();
});

// Contador de estados
function actualizarContadores() {
  const netbooks = document.querySelectorAll(".netbook");
  let pedidas = 0, daniadas = 0, disponibles = 0;

  netbooks.forEach(n => {
    if (n.classList.contains("pedida")) pedidas++;
    else if (n.classList.contains("daniada")) daniadas++;
    else disponibles++;
  });

  console.log(`📦 Disponibles: ${disponibles}, 📦 Pedidas: ${pedidas}, ❌ Dañadas: ${daniadas}`);
}

let netbooksSeleccionadas = [];

function seleccionarNetbookDocente(elemento) {
  const id = elemento.dataset.id;
  const estado = localStorage.getItem(`netbook-${id}-estado`);
  const observacion = localStorage.getItem(`netbook-${id}-obs`) || "Sin observación";

  if (estado === "disponible") {
    if (elemento.classList.contains("seleccionada")) {
      elemento.classList.remove("seleccionada");
      netbooksSeleccionadas = netbooksSeleccionadas.filter(n => n !== id);
    } else {
      elemento.classList.add("seleccionada");
      netbooksSeleccionadas.push(id);
    }
  } else {
    alert(`Netbook no disponible (${estado})\n📝 Observación: ${observacion}`);
  }
}

function abrirModalPedido() {
  if (netbooksSeleccionadas.length === 0) {
    alert("No seleccionaste ninguna netbook.");
    return;
  }

  document.getElementById("modalPedido").classList.remove("oculto");
}

function cerrarModalPedido() {
  document.getElementById("modalPedido").classList.add("oculto");
}

function confirmarPedido() {
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const persona = document.getElementById("persona").value;

  if (!fecha || !hora || !persona) {
    alert("Por favor completá todos los campos.");
    return;
  }

  const datosPedido = {
    fecha,
    hora,
    persona,
    netbooks: netbooksSeleccionadas
  };

  localStorage.setItem("pedido-docente", JSON.stringify(datosPedido));

  alert("✅ Pedido confirmado. Enviado a Regencia.");
  cerrarModalPedido();
}


function enviarPedido() {
  if (netbooksSeleccionadas.length === 0) {
    alert("No seleccionaste ninguna netbook.");
    return;
  }

  localStorage.setItem("pedido-docente", JSON.stringify(netbooksSeleccionadas));
  alert(`✅ Pedido enviado:\nNetbooks: ${netbooksSeleccionadas.join(", ")}`);
}


document.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i <= 30; i++) {
    const estado = localStorage.getItem(`netbook-${i}-estado`);
    const el = document.querySelector(`.netbook[data-id='${i}']`);
    if (estado && el) {
      el.classList.add(estado);
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const pedido = JSON.parse(localStorage.getItem("pedido-docente")) || [];
  const lista = document.getElementById("lista-pedido");

  if (pedido.length > 0) {
    lista.innerHTML = pedido.map(id => `<li>Netbook #${id}</li>`).join("");
  } else {
    lista.innerHTML = "<li>No hay pedidos pendientes.</li>";
  }

  // Mostrar estado visual de cada netbook
  for (let i = 1; i <= 30; i++) {
    const estado = localStorage.getItem(`netbook-${i}-estado`);
    const el = document.querySelector(`.netbook[data-id='${i}']`);
    if (estado && el) {
      el.classList.add(estado);
    }
  }
});
