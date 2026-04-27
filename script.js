const PIN = "1234";

// Iniciar Base de Datos Local
if (!localStorage.getItem("proyectos_upla")) {
    localStorage.setItem("proyectos_upla", JSON.stringify({}));
}

document.addEventListener("DOMContentLoaded", () => {
    const selSemana = document.getElementById("select-semana");
    // Generar opciones 1 a 16
    for (let i = 1; i <= 16; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerText = "Semana " + i;
        selSemana.appendChild(opt);
    }
    renderSemanas();
});

function login() {
    const p = prompt("Ingrese PIN de acceso:");
    if (p === PIN) {
        document.getElementById("admin").style.display = "block";
    } else {
        alert("PIN incorrecto.");
    }
}

function cerrar() {
    document.getElementById("admin").style.display = "none";
}

function guardar() {
    const sem = document.getElementById("select-semana").value;
    const tipo = document.getElementById("select-tarea").value;
    const tit = document.getElementById("titulo").value;
    const des = document.getElementById("desc").value;
    const lin = document.getElementById("link").value;
    const arch = document.getElementById("archivo");

    let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

    // Crear semana si no existe
    if (!bd[sem]) {
        bd[sem] = { info: "Semana sin descripción teórica.", tareas: {} };
    }

    if (tipo === "0") {
        bd[sem].info = des; // Guarda el texto general de la semana
    } else {
        // Guarda una de las 5 tareas
        bd[sem].tareas[tipo] = {
            titulo: tit,
            enlace: lin,
            archivo: arch.files.length > 0 ? arch.files[0].name : null
        };
    }

    localStorage.setItem("proyectos_upla", JSON.stringify(bd));
    alert("¡Guardado exitosamente!");
    
    limpiar();
    renderSemanas();
    cerrar();
}

function renderSemanas() {
    const cont = document.getElementById("misProyectos");
    cont.innerHTML = "";
    let bd = JSON.parse(localStorage.getItem("proyectos_upla"));

    for (let i = 1; i <= 16; i++) {
        const data = bd[i] || { info: "Semana sin contenido.", tareas: {} };
        const divSemana = document.createElement("div");
        divSemana.className = "card-semana";

        let tareasHTML = "";
        for (let j = 1; j <= 5; j++) {
            const t = data.tareas[j];
            tareasHTML += `
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(56,189,248,0.1);">
                    <h5 style="color: #38bdf8; font-size: 10px; margin-bottom: 5px;">TAREA ${j}</h5>
                    ${t ? `
                        <p style="font-size:11px; margin:0; color:white;">${t.titulo}</p>
                        ${t.enlace ? `<a href="${t.enlace}" target="_blank" style="color:#0ea5e9; font-size:10px; text-decoration:none;">🔗 Ver</a>` : ""}
                    ` : `<small style="color:#444;">Pendiente</small>`}
                </div>`;
        }

        divSemana.innerHTML = `
            <h4 style="color: #38bdf8; border-bottom: 2px solid #38bdf8; display: inline-block; margin-bottom: 10px;">Semana ${i}</h4>
            <p style="color: #ccc; font-size: 14px; margin-bottom: 15px;">${data.info}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px;">
                ${tareasHTML}
            </div>`;
        cont.appendChild(divSemana);
    }
}

function limpiar() {
    document.getElementById("titulo").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("link").value = "";
    document.getElementById("archivo").value = "";
}
