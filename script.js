const PIN = "1234";
let adminActivo = false;

// Inicializamos la base de datos local
if (!localStorage.getItem("proyectos_upla")) {
    localStorage.setItem("proyectos_upla", JSON.stringify({}));
}

function login() {
    const p = prompt("🔐 Ingrese PIN de administrador:");
    if (p === PIN) {
        adminActivo = true;
        document.getElementById("admin").style.display = "block";
    } else if (p !== null) {
        alert("❌ PIN Incorrecto");
    }
}

function cerrar() {
    document.getElementById("admin").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const selSemana = document.getElementById("select-semana");
    
    // Generar opciones de semana 1 a 16
    for (let i = 1; i <= 16; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerText = "Semana " + i;
        selSemana.appendChild(opt);
    }
    renderSemanas();
});

function guardar() {
    const semana = document.getElementById("select-semana").value;
    const tipo = document.getElementById("select-tarea").value;
    const titulo = document.getElementById("titulo").value;
    const desc = document.getElementById("desc").value;
    const link = document.getElementById("link").value;
    const archivoInput = document.getElementById("archivo");

    let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

    if (!bd[semana]) {
        bd[semana] = { info: "Escribe aquí la teoría de esta semana...", tareas: {} };
    }

    if (tipo === "0") {
        bd[semana].info = desc;
    } else {
        bd[semana].tareas[tipo] = {
            titulo: titulo || "Sin título",
            enlace: link,
            archivo: archivoInput.files.length > 0 ? archivoInput.files[0].name : null
        };
    }

    localStorage.setItem("proyectos_upla", JSON.stringify(bd));
    alert("✅ ¡Datos actualizados!");
    limpiarForm();
    renderSemanas();
    cerrar();
}

function renderSemanas() {
    const cont = document.getElementById("misProyectos");
    cont.innerHTML = "";
    let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

    for (let i = 1; i <= 16; i++) {
        const data = bd[i] || { info: "Semana sin información cargada.", tareas: {} };
        const divSemana = document.createElement("div");
        divSemana.className = "semana-card";
        
        let tareasHTML = "";
        for (let j = 1; j <= 3; j++) {
            const t = data.tareas[j];
            tareasHTML += `
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #0ea5e9; font-size: 10px; font-weight: bold; text-transform: uppercase;">Tarea ${j}</span>
                    ${t ? `
                        <p style="font-size:13px; margin: 5px 0;">${t.titulo}</p>
                        ${t.enlace ? `<a href="${t.enlace}" target="_blank" style="color:#38bdf8; font-size:11px; text-decoration:none;">🔗 Ver Recurso</a>` : ""}
                    ` : `<p style="color:#444; font-size:12px; margin:0;">Pendiente</p>`}
                </div>
            `;
        }

        divSemana.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 250px;">
                    <h4 style="color: #fff; margin-bottom: 8px; font-size: 1.4rem;">Semana ${i}</h4>
                    <p style="color: #94a3b8; font-size: 0.95rem;">${data.info}</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex: 1; min-width: 300px;">
                    ${tareasHTML}
                </div>
            </div>
        `;
        cont.appendChild(divSemana);
    }
}

function limpiarForm() {
    document.getElementById("titulo").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("link").value = "";
    document.getElementById("archivo").value = "";
}
