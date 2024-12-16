/*
Esta aplicación lee archivos de texto plano y los transforma en notas.
El archivo ubicado util/notas.txt sirve de ejemplo para probar esta aplicación.
*/
function seleccionarArchivo(){
    const inputFile = document.querySelector("input")
    var archivo = inputFile.files[0];
    var tipoTexto = /text.*/;
    if (archivo.type.match(tipoTexto)) {
        añadirNotas(archivo)
    }
    inputFile.value = "";
}

function añadirNotas(archivo) {
    const article = document.querySelector("article")

    var lector = new FileReader()
    lector.readAsText(archivo)
    lector.onload = function (archivo) {
        var notas = lector.result.split("\n")

        notas.forEach(nota => {
            var lineas = nota.split("_")

            const aside = document.createElement("aside")
            aside.draggable = true

            const h4 = document.createElement("h5")
            h4.textContent = lineas[0]
            const p = document.createElement("p")
            p.textContent = lineas[1]

            aside.appendChild(h4)
            aside.appendChild(p)

            article.appendChild(aside)

            agregarDragAndDrop(aside)
        });
    } 
}

function agregarDragAndDrop(aside) {
    aside.addEventListener("dragstart", empezarDrag)
}

function empezarDrag(e){
    e.dataTransfer.setData("text/plain", "");

    const rect = e.target.getBoundingClientRect();
    e.dataTransfer.setData("offsetX", e.clientX - rect.left);
    e.dataTransfer.setData("offsetY", e.clientY - rect.top);

    e.dataTransfer.effectAllowed = "move";
}

function soltarNota(e){
    e.preventDefault();
    const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));
    const aside = document.querySelector('[draggable="true"]:hover');

    if (aside) {
        const rect = article.getBoundingClientRect();
        aside.style.position = "absolute";
        aside.style.left = e.clientX - rect.left - offsetX + "px";
        aside.style.top = e.clientY - rect.top - offsetY + "px";
    }
}

function añadirListeners(aside) {
    let isDragging = false
    let offsetX, offsetY

    aside.addEventListener("mousedown", (e) => {
        isDragging = true
        offsetX = e.clientX - aside.getBoundingClientRect().left
        offsetY = e.clientY - aside.getBoundingClientRect().top
        aside.style.cursor = "grabbing"
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        aside.style.left = e.clientX - offsetX + "px"
        aside.style.top = e.clientY - offsetY + "px"
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            aside.style.cursor = "grab";
        }
    });
}

function alternarFullscreen() {
    const section = document.querySelector("section");
    const button = document.querySelector("button");

    if (!document.fullscreenElement) {
        if (section.requestFullscreen) {
            section.requestFullscreen();
        } else if (section.webkitRequestFullscreen) {
            section.webkitRequestFullscreen();
        } else if (section.msRequestFullscreen) {
            section.msRequestFullscreen();
        }
        button.textContent = "Salir de Pantalla Completa";
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        button.textContent = "Pantalla Completa";
    }
}

const article = document.querySelector("article")
article.addEventListener("drop", soltarNota)
article.addEventListener("dragover", (e) => {
    e.preventDefault()
});
