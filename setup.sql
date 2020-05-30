/* SETUP für To-do Liste */
/* © 2020 by Benjamin Grau */

/* Datenbank erstellen */
DROP DATABASE IF EXISTS `to-do`;
CREATE DATABASE `to-do` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/* Befehle in der Datenbank `to-do` ausführen */
USE `to-do`;

/* Tabelle für die Nutzer erstellen */
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `username` varchar(20) NOT NULL,
    `password` varchar(70) NOT NULL,
    `admin` tinyint(1) NOT NULL DEFAULT '0'
);

/* Aufgabentabelle erstellen */
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
    `title` varchar(250) NOT NULL,
    `status` tinyint(1) NOT NULL,
    `id` int(8) NOT NULL AUTO_INCREMENT,
    `user` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
);


/* 
ADMIN Nutzer hinzufügen
    USER: admin
    PW : admin
*/
INSERT INTO `users` (
    `username`,
    `password`,
    `admin`
) VALUES (
    'admin',
    '$2y$10$C4TKqXwWIyhmGqkMfNTQPuc.PUNCs7lWtM5BN863fN7hxZj2NMANC',
    '1'
);

COMMIT;