CREATE TABLE `registro` (
  `nombre` varchar(15) NOT NULL,
  `apellidos` varchar(30) NOT NULL,
  `nivel` decimal(2,1) NOT NULL,
  `tiempo` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;