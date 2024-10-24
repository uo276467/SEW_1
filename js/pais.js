class Pais{
    constructor(nombrePais, nombreCapital, nPoblacion){
        this.nombrePais = nombrePais
        this.nombreCapital = nombreCapital
        this.nPoblacion = nPoblacion    
    }
    setValores(nombreCircuito, tipoGobierno, latMeta, longMeta, religionMayoritaria){
        this.nombreCircuito = nombreCircuito
        this.tipoGobierno = tipoGobierno
        this.latMeta = latMeta
        this.longMeta = longMeta
        this.religionMayoritaria = religionMayoritaria
    }
    getNombrePais(){
        return this.nombrePais
    }
    getNombreCapital(){
        return this.nombreCapital
    }
    getNombreCircuito(){
        return this.nombreCircuito
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
        return "<ul><li>Circuito: " + this.nombreCircuito + 
        "</li><li>Población: " + this.nPoblacion +
        "</li><li>Forma de gobierno: " + this.tipoGobierno +
        "</li><li>Religión mayoritaria: " + this.religionMayoritaria +
         "</li></ul>"
    }
    writeCoords(){
        document.write("<p>Latitud meta: " + this.getLatMeta() + "</p>" +
                        "<p>Longitud meta: " + this.getLongMeta() + "</p>")
    }
}
var pais = new Pais("Gran Bretaña", "Londres", 67736800)
pais.setValores("Silverstone", "Democracia parlamentaria", 
    52.067497, -1.024290, "Cristianismo")
document.write("<section>")
document.write("<p>País: " + pais.getNombrePais() + "</p>")    
document.write("<p>Capital: " + pais.getNombreCapital() + "</p>")
document.write(pais.getInfo())
pais.writeCoords() 
document.write("</section>")