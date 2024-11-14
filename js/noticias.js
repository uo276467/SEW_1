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
          var lector = new FileReader();
          lector.onload = function (evento) {
            //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
            //La propiedad "result" es donde se almacena el contenido del archivo
            //Esta propiedad solamente es válida cuando se termina la operación de lectura
            areaVisualizacion.innerText = lector.result;
            }      
          lector.readAsText(archivo);
          }
      else {
          errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
          }    
    }
    addNews(){
        var nuevaNoticia = document.querySelector("#nueva").textContent
        $("pre").append(nuevaNoticia);
    }
}
var noticias = new Noticias()

function seleccionarArchivo(){
    noticias.readInputFile()
}

function añadirNoticia(){
    noticias.addNews()
}