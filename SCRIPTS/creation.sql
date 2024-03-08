CREATE TABLE `video` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`fichier` VARCHAR(1000) NOT NULL COMMENT 'Nom du fichier',
	`taille` INT NOT NULL COMMENT 'taille de la video en KB',
	`md5` VARCHAR(32) NOT NULL,
	`ordre` INT COMMENT 'Ordre de lecture de la video',
	PRIMARY KEY (`id`)
);

CREATE TABLE `historique` (
	`id` INT(20) NOT NULL AUTO_INCREMENT,
	`video_id` INT(20) NOT NULL,
	`debut` DATETIME(20) NOT NULL COMMENT 'Quand la video a commence a etre lue',
	`fin` DATETIME(20) NOT NULL COMMENT 'Quand la video a fini de jouer',
	`duree_lecture` INT(20) NOT NULL COMMENT 'Duree ed la lecture en secondes (fin - debut)',
	PRIMARY KEY (`id`)
);
