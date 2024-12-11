class Fondo{
    constructor(pais, capital, circuito){
        this.pais = pais
        this.capital = capital
        this.circuito = circuito
    }
    async getImagen() {
        try {
            var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
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

    // async getImagen() {
    //     try {
    //         const response = await fetch("https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=" + this.circuito);
    //         const data = await response.json();
    //         if (data.items.length > 0) {
    //             let imgUrl = data.items[0].media.m.replace("http://", "https://");
    //             document.body.style.backgroundImage = `url(${imgUrl})`;
    //             document.body.style.backgroundSize = "cover";
    //         } else {
    //             console.log("No se encontraron imágenes");
    //         }
    //     } catch (error) {
    //         console.error("Error:", error.message);
    //     }
    // }    