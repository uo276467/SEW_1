function seleccionarArchivo(){
    const inputArchivos = document.querySelector("input")
    const archivos = Array.from(inputArchivos.files);
    archivos.forEach(archivo => {
        const extension = archivo.name.split('.').pop().toLowerCase()
        if (extension === 'xml') {
            leerArchivoXML(archivo)
        } else if (extension === 'kml') {
            leerArchivoKML(archivo)
        } else if (extension === 'svg') {
            leerArchivoSVG(archivo);
        }
    });  
}
function leerArchivoXML(archivo){
    const lector = new FileReader()

    lector.onload = function(e) {
        const contenidoXML = e.target.result

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(contenidoXML, 'text/xml')

        mostrarContenidoXML(xmlDoc)
    };

    lector.readAsText(archivo)
}

function mostrarContenidoXML(archivo){
    const htmlContent = recorrerNodos(archivo.documentElement)
    const article = document.createElement("article")
    $(article).append("<h3>Contenido XML</h3>")
    const ul = $("<ul>")
    ul.append(htmlContent)
    $(article).append(ul)
    $("section").append(article)
}

function recorrerNodos(nodo) {
    let html = "";
    if (nodo.nodeType === Node.ELEMENT_NODE) {
        html += "<li><strong>" + nodo.nodeName + "</strong>";

        if (nodo.nodeName.toLowerCase() === "referencia" && nodo.getAttribute("enlace")) {
            const enlace = nodo.getAttribute("enlace");
            html += "<ul><li><a href='" + enlace + "' style='color: blue;' target='_blank'>Enlace</a></li></ul>";
        }
        else if (nodo.nodeName.toLowerCase() === "foto" && nodo.getAttribute("enlace")) {
            const enlace = nodo.getAttribute("enlace");
            html += "<ul><li><img src='" + enlace + "' alt='Foto'></li></ul>";
        }
        else if (nodo.nodeName.toLowerCase() === "vídeo" && nodo.getAttribute("enlace")) {
            const enlace = nodo.getAttribute("enlace");
            html += "<ul><li><video controls=''><source src='" + enlace + "' type='video/mp4'></video></li></ul>";
        }
        else if (nodo.attributes && nodo.attributes.length > 0) {
            html += "<ul>";
            Array.from(nodo.attributes).forEach(attr => {
                html += "<li><strong>" + attr.name + ":</strong> " + attr.value + "</li>";
            });
            html += "</ul>";
        }

        // Procesar los nodos hijos
        if (nodo.childNodes && nodo.childNodes.length > 0) {
            html += "<ul>";
            Array.from(nodo.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() !== "") {
                    html += "<li>" + childNode.nodeValue.trim() + "</li>";
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    html += recorrerNodos(childNode);
                }
            });
            html += "</ul>";
        }

        html += "</li>";
    }
    return html;
}




function leerArchivoKML(archivo) {
    const reader = new FileReader()

    reader.onload = function(event) {
        const kml = event.target.result
        const parser = new DOMParser()
        const doc = parser.parseFromString(kml, 'text/xml')

        const coordenadas = doc.querySelectorAll('coordinates')
        let puntos = []

        coordenadas.forEach(coordenada => {
            const coords = coordenada.textContent.trim().split(' ')
            coords.forEach(coord => {
                const [lng, lat] = coord.split(',')
                puntos.push({ lat: parseFloat(lat), lng: parseFloat(lng) })
            });
        });

        agregarMarcadoresYLínea(puntos);
    };

    reader.readAsText(archivo);
}

function initMap(){
    const article = document.createElement("article")
    $(article).append("<h3>Mapa dinámico</h3>")
    const div = document.createElement("div")
    article.append(div)
    div.contentEditable = false
    $("section").append(article)
    
    map = new google.maps.Map(div, {
    center: { lat: 52.069219, lng: -1.022263 },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    })
}

function agregarMarcadoresYLínea(puntos) {
    const coordenadas = []

    initMap()
    
    //Añadir los marcadores en el mapa
    puntos.forEach(punto => {
        const marcador = new google.maps.Marker({
            position: punto,
            map: map
        });
        coordenadas.push(punto)
    });

    //Dibujar la línea que une los puntos
    const polyline = new google.maps.Polyline({
        path: coordenadas,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.setMap(map)
}

function leerArchivoSVG(archivo) {
    const article = document.createElement("article")
    $(article).append("<h3>Altimetría</h3>")
    $("section").append(article)

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const contenidoSVG = event.target.result;

        article.insertAdjacentHTML("beforeend", contenidoSVG)
    };

    reader.readAsText(archivo);
}
