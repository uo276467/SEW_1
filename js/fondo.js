class Fondo{
    constructor(pais, capital, circuito){
        this.pais = pais
        this.capital = capital
        this.circuito = circuito
    }
    getImagen() {
        try {
            var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
            $.getJSON(flickrAPI, 
                {
                    tags: this.circuito,
                    tagmode: "any",
                    format: "json"
                })
            .done(function(data) {
                    if (data.items.length > 0) {
                        var imgUrl = data.items[0].media.m;
                        $("body").css("background-image", "url(" + imgUrl + ")");
                        $("body").css("background-size", "cover");
                    } else {
                        console.log("No se encontraron imágenes");
                    }
        });
        }catch(error){
            console.error("Error:", error.message)
        }
        
    }    
}

new Fondo("Reino Unido", "Londres", "Silverstone").getImagen();

    