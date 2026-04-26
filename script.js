const PIN = "1234";
let adminActivo = false;

// Inicializamos la base de datos local si no existe
if (!localStorage.getItem("proyectos_upla")) {
    localStorage.setItem("proyectos_upla", JSON.stringify({}));
}

// LOGIN
function login(){
  const p = prompt("Ingrese PIN de administrador:");
  if(p === PIN){
    adminActivo = true;
    document.getElementById("admin").style.display = "block";
  } else {
    alert("PIN Incorrecto");
  }
}

function cerrar(){
  adminActivo = false;
  document.getElementById("admin").style.display = "none";
}

// GENERAR SELECTORES Y SEMANAS AL CARGAR
document.addEventListener("DOMContentLoaded", () => {
    const selSemana = document.getElementById("select-semana");
    const contenedor = document.getElementById("misProyectos");

    for (let i = 1; i <= 16; i++) {
        // Llenar el selector del panel
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerText = "Semana " + i;
        selSemana.appendChild(opt);
    }
    renderSemanas();
});

// GUARDAR DATOS
function guardar(){
  const semana = document.getElementById("select-semana").value;
  const tipo = document.getElementById("select-tarea").value;
  const titulo = document.getElementById("titulo").value;
  const desc = document.getElementById("desc").value;
  const link = document.getElementById("link").value;
  const archivoInput = document.getElementById("archivo");

  let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

  // Aseguramos que la semana exista en el objeto
  if (!bd[semana]) {
      bd[semana] = { info: "Escribe aquí la información teórica...", tareas: {} };
  }

  if (tipo === "0") {
      // Guardar información de la semana
      bd[semana].info = desc;
  } else {
      // Guardar tarea específica (1 al 5)
      bd[semana].tareas[tipo] = {
          titulo: titulo,
          enlace: link,
          archivo: archivoInput.files.length > 0 ? archivoInput.files[0].name : null
      };
  }

  localStorage.setItem("proyectos_upla", JSON.stringify(bd));
  alert("¡Cambios guardados con éxito!");
  
  limpiar();
  renderSemanas();
}

// DIBUJAR LAS SEMANAS EN LA PANTALLA
function renderSemanas() {
    const cont = document.getElementById("misProyectos");
    cont.innerHTML = "";
    let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

    for (let i = 1; i <= 16; i++) {
        const data = bd[i] || { info: "Semana sin información cargada.", tareas: {} };
        const divSemana = document.createElement("div");
        divSemana.style = "background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);";
        
        let tareasHTML = "";
        for (let j = 1; j <= 5; j++) {
            const t = data.tareas[j];
            tareasHTML += `
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <h5 style="color: #666; margin-bottom:5px;">Tarea ${j}</h5>
                    ${t ? `
                        <p style="font-size:11px; color:white; margin:0;">${t.titulo}</p>
                        ${t.enlace ? `<a href="${t.enlace}" target="_blank" style="color:#0056b3; font-size:10px; text-decoration:none;">🔗 Ver Link</a>` : ""}
                        ${t.archivo ? `<br><small style="color:gray; font-size:9px;">📁 ${t.archivo}</small>` : ""}
                    ` : `<small style="color:#333;">Vacío</small>`}
                </div>
            `;
        }

        divSemana.innerHTML = `
            <h4 style="color: #fff; border-bottom: 2px solid #0056b3; display: inline-block; margin-bottom:10px;">Semana ${i}</h4>
            <p style="color: #ccc; font-size:14px; margin-bottom:15px;">${data.info}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                ${tareasHTML}
            </div>
        `;
        cont.appendChild(divSemana);
    }
}

function limpiar(){
  document.getElementById("titulo").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("link").value = "";
  document.getElementById("archivo").value = "";
}
