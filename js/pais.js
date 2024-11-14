class Pais{
    constructor(pais, capital, nPoblacion){
        this.pais = pais
        this.capital = capital
        this.nPoblacion = nPoblacion    
    }
    setValores(circuito, tipoGobierno, latMeta, longMeta, religionMayoritaria){
        this.circuito = circuito
        this.tipoGobierno = tipoGobierno
        this.latMeta = latMeta
        this.longMeta = longMeta
        this.religionMayoritaria = religionMayoritaria
    }
    getNombrePais(){
        return this.pais
    }
    getNombreCapital(){
        return this.capital
    }
    getNombreCircuito(){
        return this.circuito
    }
    getNPoblacion(){
        return this.nPoblacion
    }
    getTipoGobierno(){
        return this.tipoGobierno
    }
    getLatMeta(){
        return this.latMeta
    }
    getLongMeta(){
        return this.longMeta
    }
    getReligionMayoritaria(){
        return this.religionMayoritaria
    }
    getInfo(){
        return "<ul><li>Circuito: " + this.circuito + 
        "</li><li>Población: " + this.nPoblacion +
        "</li><li>Forma de gobierno: " + this.tipoGobierno +
        "</li><li>Religión mayoritaria: " + this.religionMayoritaria +
         "</li></ul>"
    }
    writeCoords(){
        document.write("<p>Latitud meta: " + this.getLatMeta() + "</p>" +
                        "<p>Longitud meta: " + this.getLongMeta() + "</p>")
    }
    cargarDatos(){
        //https://api.openweathermap.org/data/2.5/forecast?lat=52.069219&lon=-1.022263&mode=xml&lang=es&units=metric&appid=686c49bde4022f2cb7a92b100abb7c6b
        const tipo = "&mode=xml"
        const unidades = "&units=metric"
        const idioma = "&lang=es"
        const apikey = "686c49bde4022f2cb7a92b100abb7c6b"
        const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + this.latMeta + 
                    "&lon=" + this.longMeta + tipo + idioma + unidades + "&appid=" + apikey
        const iconoUrl = "https://openweathermap.org/img/wn/"
        const iconoFormat = "@2x.png"
        $.ajax({
            dataType: "xml",
            url: url,
            method: 'GET',
            success: function(datos){
                
                    //Presentación del archivo XML en modo texto
                    //$("h5").text((new XMLSerializer()).serializeToString(datos));

                    // Filtrar las etiquetas <time> cuyo atributo "from" contiene "T12:00:00"
                    var timesAtNoon = [];
                    $('time', datos).each(function() {
                        if ($(this).attr('from').includes("T12:00:00")) {
                            timesAtNoon.push(this); // Añadir el elemento a la lista
                        }
                    });

                    var count = 1
                    timesAtNoon.forEach((time) => {
                        var temperaturaMin        = $('temperature',time).attr("min")
                        var temperaturaMax        = $('temperature',time).attr("max")
                        var temperaturaUnit       = $('temperature',time).attr("unit")
                        var humedad               = $('humidity',time).attr("value")
                        var humedadUnit           = $('humidity',time).attr("unit")
                        var precipitacionValue    = $('precipitation',time).attr("value")
                        var precipitacionUnit     = $('precipitation',time).attr("unit")
                        var iconoNombre           = $('symbol',time).attr("name")
                        var iconoCode             = $('symbol',time).attr("var")
                        
                        var stringDatos =  "<article><h3>Predicción día " + count +"</h3>"
                            stringDatos += "<table>"
                            stringDatos += "<tr><th scope='col' id='min'>Temperatura mínima</th>"
                            stringDatos += "<th scope='col' id='max'>Temperatura máxima</th>" 
                            stringDatos += "<th socpe='col' id='humedad'>Humedad</th>"
                            stringDatos += "<th scope='col' id='precipitacion'>Precipitación</th></tr>"

                            stringDatos += "<tr><td headers='min'>" + temperaturaMin + " grados " + temperaturaUnit + "</td>"
                            stringDatos += "<td headers='max'>" + temperaturaMax + " grados " + temperaturaUnit + "</td>"
                            stringDatos += "<td headers='humedad'>" + humedad + " " + humedadUnit + "</td>"
                            if (precipitacionValue === undefined) {
                                stringDatos += "<td>No disponible</td></tr>"
                            } else {
                                stringDatos += "<td>" + precipitacionValue + " " + precipitacionUnit + "</td></tr>"
                            }
                            stringDatos += "</table>"
                            
                            stringDatos += "<figure>"
                            stringDatos += "<img src='" + iconoUrl + iconoCode + iconoFormat + "' alt='" + iconoNombre + "' width='10%' height='auto'>"
                            stringDatos += "<figcaption>" + iconoNombre + "</figcaption>"
                            stringDatos += "</figure>"
                            
                            stringDatos += "</article>"; 

                        $("section").append(stringDatos);
                        count++
                    })
                            
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>");
                }
        });
    }
}
var pais = new Pais("Gran Bretaña", "Londres", 67736800)
pais.setValores("Silverstone", "Democracia parlamentaria", 
    52.069219, -1.022263, "Cristianismo")
document.write("<article>")
document.write("<p>País: " + pais.getNombrePais() + "</p>")    
document.write("<p>Capital: " + pais.getNombreCapital() + "</p>")
document.write(pais.getInfo())
pais.writeCoords() 
document.write("</article>")

pais.cargarDatos()

