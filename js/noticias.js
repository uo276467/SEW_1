class Noticias{
    constructor(){
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            console.log("Este navegador soporta el API File")
        }else{
            console.log("¡¡¡Este navegador NO soporta el API File!!!");
        }
    }
    readInputFile(){
        var archivo = document.querySelector("input").files[0];
        var areaVisualizacion = document.querySelector("pre");
        var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
        {
            this.showInputFile(archivo)
        }
      else {
          errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
          }    
    }
    showInputFile(archivo){
        var lector = new FileReader();
        lector.readAsText(archivo)
        lector.onload = function (archivo) {
            var parrafos = lector.result.split("_")
            const noticias = parrafos.reduce((result, current, index) => {
                // Identificar a qué grupo pertenece el string actual
                const groupIndex = Math.floor(index / 3);
              
                // Si el grupo no existe, inicializarlo
                if (!result[groupIndex]) {
                  result[groupIndex] = '';
                }
              
                // Añadir el string actual al grupo correspondiente, separados por "@"
                result[groupIndex] += (result[groupIndex] ? '@' : '') + current;
              
                return result;
            }, []);  

            console.log(noticias)

            noticias.forEach(noticia => {
                var lineas = noticia.split("@")
                var stringHtml = "<article>"
                stringHtml += "<h3>" + lineas[0] + "</h3>"
                stringHtml += "<p>" + lineas[1] + "</p>"
                stringHtml += "<p>" + lineas[2] + "</p></article>"

                $("section").append(stringHtml);
            });
        }    
    }
    addNews(){
        var nuevaNoticia = document.querySelector("section input[type='text']").value
        var areaVisualizacion = document.querySelector("pre");
        areaVisualizacion.innerText += nuevaNoticia + "\n"
    }
}
var noticias = new Noticias()

function seleccionarArchivo(){
    noticias.readInputFile()
}

function añadirNoticia(){
    noticias.addNews()
}