<?php
class DataManager {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $conn;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "gestion";

        $this->conn = new mysqli($this->server, $this->user, $this->pass);

        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }

        $this->dropDatabase();
        $this->createDatabase();
        $this->createTables();

    }
    private function dropDatabase(){
        $query = "DROP DATABASE IF EXISTS $this->dbname";
        if ($this->conn->query($query) === TRUE) {
            echo "<p>Base de datos '$this->dbname' eliminada con éxito.</p>";
        } else {
            die("Error al eliminar la base de datos: " . $this->conn->error);
        }
    }
    private function createDatabase() {
        $query = "CREATE DATABASE IF NOT EXISTS $this->dbname COLLATE utf8_spanish_ci";
        if ($this->conn->query($query) === TRUE) {
            $this->conn->select_db($this->dbname);
        } else {
            die("Error al crear la base de datos: " . $this->conn->error);
        }
    }
    private function createTables() {
        $tables = [
            'equipos' => "
                CREATE TABLE IF NOT EXISTS equipos (
                    id INT NOT NULL AUTO_INCREMENT,
                    nombre VARCHAR(255) NOT NULL,
                    sede VARCHAR(255) NOT NULL,
                    PRIMARY KEY (id)
                ) 
            ",
            'pilotos' => "
                CREATE TABLE IF NOT EXISTS pilotos (
                    id INT NOT NULL AUTO_INCREMENT,
                    nombre VARCHAR(255) NOT NULL,
                    nacionalidad VARCHAR(255) NOT NULL,
                    edad INT NOT NULL,
                    idEquipo INT NOT NULL,
                    FOREIGN KEY (idEquipo) REFERENCES equipos(id),
                    PRIMARY KEY (id)
                )
            ",
            'circuitos' => "
                CREATE TABLE IF NOT EXISTS circuitos (
                    id INT NOT NULL AUTO_INCREMENT,
                    nombre VARCHAR(255) NOT NULL,
                    pais VARCHAR(255) NOT NULL,
                    longitud DECIMAL(10, 3) NOT NULL,
                    PRIMARY KEY (id)
                )
            ",
            'carreras' => "
                CREATE TABLE IF NOT EXISTS carreras (
                    id INT NOT NULL AUTO_INCREMENT,
                    nombre VARCHAR(50) NOT NULL,
                    fecha DATE NOT NULL,
                    idCircuito INT NOT NULL,
                    FOREIGN KEY (idCircuito) REFERENCES circuitos(id),
                    PRIMARY KEY (id)
                )
            ",
            'resultados' => "
                CREATE TABLE IF NOT EXISTS resultados (
                    id INT NOT NULL AUTO_INCREMENT,
                    idCarrera INT NOT NULL,
                    idPiloto INT NOT NULL,
                    posicion INT NOT NULL,
                    FOREIGN KEY (idCarrera) REFERENCES carreras(id),
                    FOREIGN KEY (idPiloto) REFERENCES pilotos(id),
                    PRIMARY KEY (id)
                )
            "
        ];

        foreach ($tables as $tableName => $query) {
            if ($this->conn->query($query) === TRUE) {
                echo "<p>Tabla '$tableName' creada con éxito.</p>";
            } else {
                echo "<p>Error al crear la tabla '$tableName': " . $this->conn->error . "</p>";
            }
        }
    }
    public function importCSV($filePath) {
        try {
            $file = fopen($filePath, 'r');
            if (!$file) throw new Exception("No se pudo abrir el archivo CSV.");

            while ($row = fgetcsv($file, 1000, ",")) {
                $tipo = strtolower($row[0]);
                switch ($tipo) {
                    case 'equipos':
                        $query = "INSERT INTO equipos (nombre, sede) 
                                  VALUES ('$row[1]', '$row[2]')";
                        break;
                    case 'pilotos':
                        $query = "INSERT INTO pilotos (nombre, nacionalidad, edad, idEquipo) 
                                  VALUES ('$row[1]', '$row[2]', '$row[3]', '$row[4]')";
                        break;
                    case 'circuitos':
                        $query = "INSERT INTO circuitos (nombre, pais, longitud) 
                                  VALUES ('$row[1]', '$row[2]', '$row[3]')";
                        break;
                    case 'carreras':
                        $query = "INSERT INTO carreras (nombre, fecha, idCircuito) 
                                  VALUES ('$row[1]', '$row[2]', '$row[3]')";
                        break;
                    case 'resultados':
                        $query = "INSERT INTO resultados (idCarrera, idPiloto, posicion) 
                                  VALUES ('$row[1]', '$row[2]', '$row[3]')";
                        break;
                    default:
                        throw new Exception("Tipo de registro desconocido: $tipo");
                }
                $this->conn->query($query);
            }
            fclose($file);
            return "Importación completa";
        } catch (Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }

    public function exportCSV() {
        ob_clean();
    
        $tables = ['equipos', 'pilotos', 'circuitos', 'carreras', 'resultados'];
        $filename = 'f1_datos.csv';
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
    
        $file = fopen('php://output', 'w');
    
        foreach ($tables as $table) {
            $query = "SELECT * FROM $table";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    if (isset($row['id'])) {
                        unset($row['id']); // Elimina la columna id
                    }
    
                    $recordType = $table;
                    $rowData = array_merge([$recordType], array_values($row));
    
                    $cleanedRow = array_map(function($value) {
                        $value = str_replace('""', ' ', $value);
                        return $value;
                    }, $rowData);
    
                    $line = implode(',', $cleanedRow) . "\n";
                    fwrite($file, $line);
                }
            }
        }
    
        fclose($file);
        exit();
    }
    
}
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop: gestión</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico">

    <meta name="author" content="Daniel Suárez de la Roza"/>
    <meta name="description" content="Aplicación de gestión de pilotos"/>
    <meta name="keywords" content="F1, Fórmula 1, gestión"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />

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
        >> Gestión</p>

        <nav>
            <a href="memoria.html">Memoria</a>
            <a href="semaforo.php">Semáforo</a>
            <a href="api.html">Api</a>
            <a href="gestion.php">Gestión</a>
        </nav>

        <section>
            <h3>Gestión</h3>
                <form action=# method="post">
                    <label for="import">Seleccionar archivo CSV:</label>
                    <input type="file" id="import" name="importCSV" accept=".csv" required>
                    <button type="submit">Importar CSV</button>
                </form>
                <form action=# method="post">
                    <button type="submit" name="exportCSV">Exportar CSV</button>
                </form>
                <?php
                $manager = new DataManager();
                ?>
        </section>
    </main>
</body>
</html>

<?php
if (count ($_POST) > 0){
    if(isset($_POST["importCSV"])){
        try{
            $manager->importCSV(filePath: $_POST["importCSV"]);
            echo "<p style='color:green;'>Los datos se han importado correctamente desde el archivo CSV.</p>";
        } catch (Exception $e) {
            echo "<p style='color:red;'>Error al importar los datos: " . $e->getMessage() . "</p>";
        }   
    }
    if (isset($_POST['exportCSV'])) {
        try {
            $manager->exportCSV();

        } catch (Exception $e) {
            echo "<p style='color:red;'>Error al exportar los datos: " . $e->getMessage() . "</p>";
        }
    }    
}
?>