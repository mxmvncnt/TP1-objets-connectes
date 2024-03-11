create table `video` (
  `id` INT not null AUTO_INCREMENT,
  `fichier` VARCHAR(1000) not null comment 'Nom du fichier',
  `taille` INT not null comment 'Taille du fichier en KB',
  `md5` varchar(32) not null,
  `ordre` INT null comment 'Position dans lordre de la lecture',
  primary key (`id`)
)

create table `lecture` (
  `id` INT not null AUTO_INCREMENT,
  `video_id` INT not null,
  `debut` DATETIME not null comment 'Quand la vidéo à commencé à être lue',
  `fin` DATETIME not null comment 'Quand la vidéo à fini dêtre lue',
  `temps_lecture` INT not null comment 'Durée totale de la lectuere en secondes',
  primary key (`id`),
  foreign key (`video_id`) references `video`(`id`)
);

create table `historique` (
  `id` INT not null AUTO_INCREMENT,
  `date` DATE not null,
  `video_id` INT not null,
  `lectures` INT not null,
  `total_duree` INT not null comment 'temps de lecture total en secondes',
  primary key (`id`),
  foreign key (`video_id`) references `video`(`id`)
);
