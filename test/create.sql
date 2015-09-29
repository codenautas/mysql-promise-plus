BEGIN;

GRANT USAGE ON *.* TO 'test_user'@'localhost';
DROP USER 'test_user'@'localhost';

DROP DATABASE IF EXISTS `test_db`;

CREATE DATABASE `test_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
use test_db;

CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'test_pass';
GRANT ALL PRIVILEGES ON `test_db%` . * TO 'test_user'@'localhost' WITH GRANT OPTION ;

COMMIT;
