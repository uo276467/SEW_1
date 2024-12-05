<?php
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $conn;
    
    public function __construct(){
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";

        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }
    }
    public function guardarRecord($nombre, $apellidos, $nivel, $tiempo) {
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $nivel = floatval($nivel);
        $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);

        if ($stmt->execute()) {
            echo "<p>Registro guardado correctamente.</p>";
        } else {
            echo "<p>Error al guardar el registro: " . $stmt->error . "</p>";
        }

        $stmt->close();
    }
    public function getTop10Records($nivel) {
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        $stmt->bind_param("d", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();

        $top10 = [];
        while ($row = $result->fetch_assoc()) {
            $top10[] = $row;
        }
        return $top10;
    }
    public function __destruct() {
        $this->conn->close();
    }
}

function verTop10($top10) {
    $html = '<ol>';
    foreach ($top10 as $record) {
        $html .= '<li>' . $record['nombre'] . ' ' . $record['apellidos'] . ': ' . $record['tiempo'] . ' segundos</li>';
    }
    $html .= '</ol>';
    return $html;
}


?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop: juego semáforo</title>

    <meta name="author" content="Daniel Suárez de la Roza"/>
    <meta name="description" content="Juego de reacción con semáforo"/>
    <meta name="keywords" content="F1, Fórmula 1, juego, semáforo, reacción"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />

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
                <a href="viajes.php">Viajes</a>
                <a href="juegos.html" class="activo">Juegos</a>
            </nav>
        </header>

        <p>Estás en: <a href="index.html">Inicio</a> >> <a href="juegos.html">Juegos </a>
        >> Semáforo</p>

        <nav>
            <a href="memoria.html">Memoria</a>
            <a href="semaforo.php">Semáforo</a>
            <a href="api.html">Api</a>
        </nav>

        <aside>
        <?php
            if (count ($_POST) > 0){
                $record = new Record();
                $nombre = $_POST['nombre'];
                $apellidos = $_POST['apellidos'];
                $nivel = $_POST['nivel'];
                $tiempo = $_POST['tiempoReaccion'];
                
                
                $record->guardarRecord($nombre, $apellidos, floatval($nivel), floatval($tiempo));
            
                $top10 = $record->getTop10Records($nivel);
                $listaTop10 = verTop10($top10);
            
                echo '<h4>Top 10 para el nivel ' . $nivel . '</h4>';
                echo $listaTop10;
            }
            ?>
        </aside>
    
    </main>
    <script src="js/semaforo.js"></script>
</body>
</html>