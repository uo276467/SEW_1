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
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?"
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=15"
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600"
        //Escala (opcional)
        //Formato (opcional): PNG,JPEG,GIF
        //Tipo de mapa (opcional)
        //Idioma (opcional)
        //region (opcional)
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey
        console.log(this.imagenMapa)
        var stringHtml = "<img src='"+this.imagenMapa+"' alt='mapa estático google' />"

        $("div:first-of-type").append(stringHtml)
    }
    getMapaDinamicoGoogle(){
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
          // Browser doesn't support Geolocation
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

function initMap() {
  const viajes = new Viajes();
  viajes.getMapaDinamicoGoogle()
}



/* CARRUSEL */

const slides = document.querySelectorAll("img");

// select next slide button
const nextSlide = document.querySelector("button:nth-of-type(1)");

// current slide counter
let curSlide = 3;
// maximum number of slides
let maxSlide = slides.length - 1;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function () {
  // check if current slide is the last and reset current slide
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //   move slide by -100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});

// select next slide button
const prevSlide = document.querySelector("button:nth-of-type(2)");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  //   move slide by 100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});