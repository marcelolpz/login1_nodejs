CREATE DATABASE heu_suport_his;

USE heu_suport_his;

SET FOREIGN_KEY_CHECKS=0;
CREATE TABLE `administrador` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `identidad_admin` char(20) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_completo` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_admin` char(20) COLLATE utf8_unicode_ci NOT NULL,
  `departamento_admin` int(8) NOT NULL,
  `profesion_admin` int(11) NOT NULL,
  `medico_admin` int(11) DEFAULT NULL,
  `password_admin` text COLLATE utf8_unicode_ci NOT NULL,
  `vencimiento_admin` date NOT NULL,
  `email_admin` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `nempleado_admin` char(8) COLLATE utf8_unicode_ci NOT NULL,
  `telefono_admin` char(8) COLLATE utf8_unicode_ci NOT NULL,
  `nivel_admin` int(2) NOT NULL,
  `estado` int(1) NOT NULL,
  PRIMARY KEY (`id_admin`) USING BTREE,
  UNIQUE KEY `nombre_admin_2` (`nombre_admin`),
  KEY `id_deptofk` (`departamento_admin`),
  KEY `nombre_admin` (`nombre_admin`),
  KEY `profesionadminfk` (`profesion_admin`),
  KEY `FKmedicoadmin` (`medico_admin`),
  KEY `FKidnivel` (`nivel_admin`),
  CONSTRAINT `FKidnivel` FOREIGN KEY (`nivel_admin`) REFERENCES `tabla_nivelesacceso` (`id_nivelacceso`),
  CONSTRAINT `FKmedicoadmin` FOREIGN KEY (`medico_admin`) REFERENCES `medicos` (`id`),
  CONSTRAINT `id_deptofk` FOREIGN KEY (`departamento_admin`) REFERENCES `tabla_salas` (`id_sala`),
  CONSTRAINT `profesionadminfk` FOREIGN KEY (`profesion_admin`) REFERENCES `especialidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of administrador
-- ----------------------------
INSERT INTO `administrador` VALUES ('1', '0801199110304', 'WALTER RODRIGUEZ', 'walterfer66', '1070', '71', '12', '95f031180e81c857987a615b59f76a62', '2028-12-06', 'walter.rodriguez@hospitalescuela.edu.hn', '1111', '94359222', '0', '0');

CREATE VIEW administrativo_usuarios AS SELECT * FROM administrador;