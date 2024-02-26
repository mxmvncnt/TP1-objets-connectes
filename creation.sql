CREATE TABLE `video` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`fichier` VARCHAR(1000) NOT NULL COMMENT 'Nom du fichier',
	`taille` INT NOT NULL COMMENT 'taille de la video en KB',
	`md5` VARCHAR(32) NOT NULL,
	`ordre` INT COMMENT 'Ordre de lecture de la video',
	PRIMARY KEY (`id`)
);
