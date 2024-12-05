<?php
class Moneda {
    private $monedaLocal;
    private $monedaCambio;

    public function __construct($monedaLocal, $monedaCambio){
        $this->monedaLocal = $monedaLocal;
        $this->monedaCambio = $monedaCambio;
    }

    public function obtenerCambio() {
        $url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
        $url.= $this->monedaCambio;
        $url.= ".json";

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);

        if($json==null) {
            echo "<h3>Error en el archivo JSON recibido</h3>";
        }

        $cambio = $json->{$this->monedaCambio}->{$this->monedaLocal};

        echo "<article>";
        echo "<h3>Cambio de moneda</h3>";
        echo "<p>1€ = ".$cambio."£ (libras)</p>";
        echo "</article>";
    }
}
class Carrusel {
    private $capital;
    private $pais;
    
    public function __construct($capital, $pais){
        $this->capital = $capital;
        $this->pais = $pais;
    }
    public function obtenerImagenes() {
        $api_key = 'e03f20e92c8ef863638cca31fca7a606';
        $tag = $this->capital . "," . str_replace(" ", "", $this->pais);
        $perPage = 10;
        $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
        $url.= '&api_key='.$api_key;
        $url.= '&tags='.$tag;
        $url.= '&per_page='.$perPage;
        $url.= '&format=json';
        $url.= '&nojsoncallback=1';

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);

        if($json==null) {
            echo "<h3>Error en el archivo JSON recibido</h3>";
        }

        echo "<article>";
        echo "<h3>Carrusel de imágenes</h3>";
        for($i=0;$i<$perPage;$i++) {
            $titulo = $json->items[$i]->title;
            $URLfoto = $json->items[$i]->media->m;       
            print "<img alt='".$titulo."' src='".$URLfoto."' />";
        }

        echo "<button> &gt; </button><button> &lt; </button>";
        echo "</article>";
    }
}
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop: viajes</title>

    <meta name="author" content="Daniel Suárez de la Roza"/>
    <meta name="description" content="Mapas y viajes"/>
    <meta name="keywords" content="F1, Fórmula 1, viaje, mapa"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />

    <!-- <script src="js/viajes.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/common.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/util.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/map.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/infowindow.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/onion.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/controls.js"></script>
    <script src="https://maps.googleapis.com/maps-api-v3/api/js/59/1/intl/es_ALL/marker.js"></script> -->
    <script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous">
    </script>

</head>

<body>
    <main>
        <header>
            <h1><a href="index.html">F1Desktop</a></h1>
            <nav>
                <a href="index.html">Inicio</a>
                <a href="piloto.html">Piloto</a>
                <a href="noticias.html">Noticias</a>
                <a href="calendario.html">Calendario</a>
                <a href="meteorología.html">Meteorología</a>
                <a href="circuito.html">Circuito</a>
                <a href="viajes.php" class="activo">Viajes</a>
                <a href="juegos.html">Juegos</a>
            </nav>
        </header>

        <p>Estás en: <a href="index.html">Inicio</a> >> Viajes</p>

        <section>
            <h2>Viajes</h2>
            <div>
                <h3>Mapa estático</h3>
            </div>
            <div>
                <h3>Mapa dinámico</h3>
            </div>
            <?php
            $carrusel = new Carrusel("Londres", "Reino Unido");
            $carrusel->obtenerImagenes();
            $moneda = new Moneda("gbp", "eur");
            $moneda->obtenerCambio();
            ?>
        </section>
        
    </main>
    
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDBAQHjy-15VCba2o5ZQ6nVJXD8iVdBQYs&callback=initMap"></script>

    <!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDBAQHjy-15VCba2o5ZQ6nVJXD8iVdBQYs&amp;callback=initMap"></script> -->
    <script src="js/viajes.js"></script>

</body>
</html>