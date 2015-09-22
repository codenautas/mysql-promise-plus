BEGIN;

GRANT USAGE ON *.* TO 'node'@'localhost';
DROP USER 'node'@'localhost';
DROP DATABASE IF EXISTS `nodepru`;

CREATE DATABASE `nodepru` /*!40100 DEFAULT CHARACTER SET latin1 */;
use nodepru;

CREATE USER 'node'@'localhost' IDENTIFIED BY 'edon';
GRANT ALL PRIVILEGES ON `nodepru%` . * TO 'node'@'localhost' WITH GRANT OPTION ;

COMMIT;
