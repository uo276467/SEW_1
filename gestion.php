<?php
ob_start();
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

        $this->createDatabase();
    }
    public function dropDatabase(){
        $query = "DROP DATABASE IF EXISTS $this->dbname";
        if ($this->conn->query($query) === TRUE) {
            echo "<p>Base de datos '$this->dbname' eliminada con éxito.</p>";
        } else {
            die("Error al eliminar la base de datos: " . $this->conn->error);
        }
    }
    public function createDatabase() {
        $query = "CREATE DATABASE IF NOT EXISTS $this->dbname COLLATE utf8_spanish_ci";
        if ($this->conn->query($query) === TRUE) {
            $this->conn->select_db($this->dbname);
            $this->createTables();
        } else {
            die("Error al crear la base de datos: " . $this->conn->error);
        }
    }
    public function createTables() {
        $sqlFilePath = 'gestion.sql';
        
        $sqlContent = file_get_contents($sqlFilePath);
        
        $queries = array_filter(array_map('trim', explode(';', $sqlContent)));
        
        foreach ($queries as $query) {
            if (!empty($query)) {
                if ($this->conn->query($query) !== TRUE) {
                    echo "<p>Error al ejecutar la consulta: " . $this->conn->error . "</p>";
                }
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
    
        echo "\xEF\xBB\xBF"; //BOM utf-8

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
    public function insertData($table, $data) {
        try {
            $columns = implode(", ", array_keys($data));
            $values = implode(", ", array_map(function($value) {
                return "'" . $this->conn->real_escape_string($value) . "'";
            }, array_values($data)));
    
            $query = "INSERT INTO $table ($columns) VALUES ($values)";
    
            if ($this->conn->query($query) === TRUE) {
                echo "<p>Datos insertados con éxito en la tabla $table.</p>";
            }
        } catch (Exception $e) {
            echo "<p>Error al insertar los datos.</p>";
        }
    }
    public function __destruct() {
        $this->conn->close();
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
                <a href="meteorologia.html">Meteorología</a>
                <a href="circuito.html">Circuito</a>
                <a href="viajes.php">Viajes</a>
                <a href="juegos.html" class="activo">Juegos</a>
            </nav>
        </header>

        <p>Estás en: <a href="index.html">Inicio</a> >> <a href="juegos.html">Juegos </a>
        >> Gestión</p>

        <h2>Juegos</h2>
        <nav>
            <a href="memoria.html">Memoria</a>
            <a href="semaforo.php">Semáforo</a>
            <a href="api.html">Api</a>
            <a href="gestion.php">Gestión</a>
        </nav>

        <section>
            <h3>Gestión</h3>
            <form action=# method="post">
                <button type="submit" name="restart">Reinciar Base de Datos</button>
            </form>
            <form action=# method="post">
                <label for="import">Seleccionar archivo CSV:</label>
                <input type="file" id="import" name="importCSV" accept=".csv" required>
                <button type="submit">Importar CSV</button>
            </form>
            <form action=# method="post">
                <button type="submit" name="exportCSV">Exportar CSV</button>
            </form>

            <article>
                <h4>Insertar en Equipos</h4>
                <form method="post">
                    <label>Nombre: <input type="text" name="nombre" required></label>
                    <label>Sede: <input type="text" name="sede" required></label>
                    <button type="submit" name="insert_equipos">Insertar Equipo</button>
                </form>
            </article>
                
            <article>
                <h4>Insertar en Pilotos</h4>
                <form method="post">
                    <label>Nombre: <input type="text" name="nombre" required></label>
                    <label>Nacionalidad: <input type="text" name="nacionalidad" required></label>
                    <label>Edad: <input type="number" name="edad" required></label>
                    <label>ID Equipo: <input type="number" name="idEquipo" required></label>
                    <button type="submit" name="insert_pilotos">Insertar Piloto</button>
                </form>
            </article>
                
            <article>
                <h4>Insertar en Circuitos</h4>
                <form method="post">
                    <label>Nombre: <input type="text" name="nombre" required></label>
                    <label>País: <input type="text" name="pais" required></label>
                    <label>Longitud: <input type="number" step="0.001" name="longitud" required></label>
                    <button type="submit" name="insert_circuitos">Insertar Circuito</button>
                </form>
            </article>

            <article>
                <h4>Insertar en Carreras</h4>
                <form method="post">
                    <label>Nombre: <input type="text" name="nombre" required></label>
                    <label>Fecha: <input type="date" name="fecha" required></label>
                    <label>ID Circuito: <input type="number" name="idCircuito" required></label>
                    <button type="submit" name="insert_carreras">Insertar Carrera</button>
                </form>
            </article>
                
            <article>
                <h4>Insertar en Resultados</h4>
                <form method="post">
                    <label>ID Carrera: <input type="number" name="idCarrera" required></label>
                    <label>ID Piloto: <input type="number" name="idPiloto" required></label>
                    <label>Posición: <input type="number" name="posicion" required></label>
                    <button type="submit" name="insert_resultados">Insertar Resultado</button>
                </form>
            </article>
        </section>
    </main>
</body>
</html>

<?php
$manager = new DataManager();
if (count ($_POST) > 0){
    if (isset($_POST['restart'])) {
        $manager->dropDatabase();
        $manager->createDatabase();
    }
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
    if (isset($_POST['insert_equipos'])) {
        $manager->insertData('equipos', ['nombre' => $_POST['nombre'], 'sede' => $_POST['sede']]);
    }
    if (isset($_POST['insert_pilotos'])) {
        $manager->insertData('pilotos', [
            'nombre' => $_POST['nombre'], 
            'nacionalidad' => $_POST['nacionalidad'], 
            'edad' => $_POST['edad'], 
            'idEquipo' => $_POST['idEquipo']
        ]);
    }
    if (isset($_POST['insert_circuitos'])) {
        $manager->insertData('circuitos', [
            'nombre' => $_POST['nombre'], 
            'pais' => $_POST['pais'], 
            'longitud' => $_POST['longitud']
        ]);
    }
    if (isset($_POST['insert_carreras'])) {
        $manager->insertData('carreras', [
            'nombre' => $_POST['nombre'], 
            'fecha' => $_POST['fecha'], 
            'idCircuito' => $_POST['idCircuito']
        ]);
    }
    if (isset($_POST['insert_resultados'])) {
        $manager->insertData('resultados', [
            'idCarrera' => $_POST['idCarrera'], 
            'idPiloto' => $_POST['idPiloto'], 
            'posicion' => $_POST['posicion']
        ]);
    }    
}
?>