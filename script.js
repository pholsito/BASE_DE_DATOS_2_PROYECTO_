const PIN = "1234";
let editando = null;
let reposEditados = [];
let adminActivo = false;

// LOGIN
function login(){
  const p = prompt("Ingrese PIN:");
  if(p === PIN){
    adminActivo = true;
    document.getElementById("admin").classList.add("activo");
    mostrarAdmin();
    mostrarGithubAdmin();
    renderRepos();
    mostrar();
  }
}

function cerrar(){
  adminActivo = false;
  document.getElementById("admin").classList.remove("activo");
  renderRepos();
  mostrar();
}

// TABS
function mostrarTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
}

// ======================
// MIS PROYECTOS
// ======================

function guardar(){
  const titulo = document.getElementById("titulo").value;
  const desc = document.getElementById("desc").value;
  const link = document.getElementById("link").value;
  const archivoInput = document.getElementById("archivo");

  let data = JSON.parse(localStorage.getItem("proyectos")) || [];

  let archivoURL = "";
  if(archivoInput.files.length > 0){
    archivoURL = URL.createObjectURL(archivoInput.files[0]);
  }

  if(editando !== null){
    data[editando] = {titulo, desc, link, archivo: archivoURL};
    editando = null;
  } else {
    data.push({titulo, desc, link, archivo: archivoURL});
  }

  localStorage.setItem("proyectos", JSON.stringify(data));

  limpiar();
  mostrar();
  mostrarAdmin();
}

// MOSTRAR PUBLICO
function mostrar(){
  const cont = document.getElementById("misProyectos");
  cont.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("proyectos")) || [];

  data.forEach((p,i)=>{
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${p.titulo}</h3>
      <p>${p.desc}</p>

      ${p.link ? `<a href="${p.link}" target="_blank">🔗 Abrir enlace</a>` : ""}
      ${p.archivo ? renderArchivo(p.archivo) : ""}

      ${adminActivo ? `
        <br><br>
        <button onclick="editar(${i})">Editar</button>
        <button onclick="eliminar(${i})">Eliminar</button>
      ` : ""}
    `;

    cont.appendChild(div);
  });
}

// ARCHIVOS
function renderArchivo(url){
  if(url.endsWith(".pdf")){
    return `<br><a href="${url}" target="_blank">📄 Ver PDF</a>`;
  }
  if(url.match(/\.(jpg|jpeg|png|gif)$/)){
    return `<br><img src="${url}" style="width:100%; border-radius:10px; margin-top:10px;">`;
  }
  return `<br><a href="${url}" target="_blank">📁 Abrir archivo</a>`;
}

// ADMIN PANEL
function mostrarAdmin(){
  const cont = document.getElementById("listaAdmin");
  cont.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("proyectos")) || [];

  data.forEach((p,i)=>{
    const div = document.createElement("div");

    div.innerHTML = `
      <b>${p.titulo}</b><br>
      <button onclick="editar(${i})">Editar</button>
      <button onclick="eliminar(${i})">Eliminar</button>
    `;

    cont.appendChild(div);
  });
}

function editar(i){
  let data = JSON.parse(localStorage.getItem("proyectos"));

  document.getElementById("titulo").value = data[i].titulo;
  document.getElementById("desc").value = data[i].desc;
  document.getElementById("link").value = data[i].link;

  editando = i;
  mostrarTab('crear');
}

function eliminar(i){
  let data = JSON.parse(localStorage.getItem("proyectos"));
  data.splice(i,1);
  localStorage.setItem("proyectos", JSON.stringify(data));
  mostrar();
  mostrarAdmin();
}

function limpiar(){
  document.getElementById("titulo").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("link").value = "";
}

// ======================
// GITHUB
// ======================

fetch("https://api.github.com/users/octocat/repos")
.then(res=>res.json())
.then(data=>{
  reposEditados = data;
  renderRepos();
});

function renderRepos(){
  const cont = document.getElementById("repositorios");
  cont.innerHTML = "";

  reposEditados.forEach((repo,i)=>{
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || ""}</p>
      <a href="${repo.html_url}" target="_blank">🔗 Abrir</a>

      ${adminActivo ? `
        <br><br>
        <button onclick="editarRepo(${i})">Editar</button>
        <button onclick="eliminarRepo(${i})">Eliminar</button>
      ` : ""}
    `;

    cont.appendChild(div);
  });
}

// ADMIN GITHUB
function mostrarGithubAdmin(){
  const cont = document.getElementById("listaGithub");
  if(!cont) return;

  cont.innerHTML = "";

  reposEditados.forEach((repo,i)=>{
    const div = document.createElement("div");

    div.innerHTML = `
      <b>${repo.name}</b>
      <button onclick="editarRepo(${i})">Editar</button>
      <button onclick="eliminarRepo(${i})">Eliminar</button>
    `;

    cont.appendChild(div);
  });
}

function editarRepo(i){
  const nuevo = prompt("Nuevo nombre:", reposEditados[i].name);
  if(nuevo){
    reposEditados[i].name = nuevo;
    renderRepos();
    mostrarGithubAdmin();
  }
}

function eliminarRepo(i){
  reposEditados.splice(i,1);
  renderRepos();
  mostrarGithubAdmin();
}

// INICIO
mostrar();