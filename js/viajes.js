"use strict";
class Viajes {
    constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }
    getPosicion(posicion){
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;  

       this.getMapaEstaticoGoogle()
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }
    getMapaEstaticoGoogle(){
        var apiKey = "&key=AIzaSyDBAQHjy-15VCba2o5ZQ6nVJXD8iVdBQYs"
        var url = "https://maps.googleapis.com/maps/api/staticmap?"
        //Parámetros
        var centro = "center=" + this.latitud + "," + this.longitud
        var zoom ="&zoom=15"
        var tamaño= "&size=800x600"
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud
        var sensor = "&sensor=false"
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey
        var stringHtml = "<img src='"+this.imagenMapa+"' alt='mapa estático google' />"

        const div = document.createElement("div")
        const h3 = document.querySelector("h3:first-of-type")
        h3.after(div)
        $("div:first-of-type").append(stringHtml)
    }
    getMapaDinamicoGoogle(){
      const div = document.createElement("div")
      div.contentEditable = false
      const h3 = document.querySelector("h3:last-of-type")
      h3.after(div)
      
      var mapaGeoposicionado = new google.maps.Map(document.querySelector("div:last-of-type"),{
          zoom: 15,
          center: { lat: this.latitud, lng: this.longitud },
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    
      const infoWindow = new google.maps.InfoWindow
    
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
    
              infoWindow.setPosition(pos);
              infoWindow.setContent('Localización encontrada');
              infoWindow.open(mapaGeoposicionado);
              mapaGeoposicionado.setCenter(pos);

          }, function() {
              this.handleLocationError(true, infoWindow, mapaGeoposicionado.getCenter());
          });
      } else {
          this.handleLocationError(false, infoWindow, mapaGeoposicionado.getCenter());
      }
    }
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: Ha fallado la geolocalización' :
                            'Error: Su navegador no soporta geolocalización');
      infoWindow.open();
    }
}

const viajes = new Viajes();
function initMap() {
  viajes.getMapaDinamicoGoogle()
}

/* CARRUSEL */

const slides = document.querySelectorAll("img");

const nextSlide = document.querySelector("button:nth-of-type(1)");

let curSlide = 3;
let maxSlide = slides.length - 1;

nextSlide.addEventListener("click", function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});

const prevSlide = document.querySelector("button:nth-of-type(2)");

prevSlide.addEventListener("click", function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});