CREATE TABLE IF NOT EXISTS equipos (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    sede VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pilotos (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    nacionalidad VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    idEquipo INT NOT NULL,
    FOREIGN KEY (idEquipo) REFERENCES equipos(id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS circuitos (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    pais VARCHAR(255) NOT NULL,
    longitud DECIMAL(10, 3) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS carreras (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    idCircuito INT NOT NULL,
    FOREIGN KEY (idCircuito) REFERENCES circuitos(id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS resultados (
    id INT NOT NULL AUTO_INCREMENT,
    idCarrera INT NOT NULL,
    idPiloto INT NOT NULL,
    posicion INT NOT NULL,
    FOREIGN KEY (idCarrera) REFERENCES carreras(id),
    FOREIGN KEY (idPiloto) REFERENCES pilotos(id),
    PRIMARY KEY (id)
);
