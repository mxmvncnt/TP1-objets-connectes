create table video
(
    id      int auto_increment
        primary key,
    fichier varchar(1000) not null comment 'Nom du fichier',
    taille  int           not null comment 'Taille du fichier en KB',
    md5     varchar(32)   not null,
    ordre   int           null comment 'Position dans lordre de la lecture'
);

create table historique
(
    id          int auto_increment
        primary key,
    date        date not null,
    video_id    int  not null,
    lectures    int  not null,
    total_duree int  not null comment 'temps de lecture total en secondes',
    constraint historique_ibfk_1
        foreign key (video_id) references video (id)
            on delete cascade
);

create table lecture
(
    id            int auto_increment
        primary key,
    video_id      int      not null,
    debut         datetime not null comment 'Quand la vidéo à commencé à être lue',
    fin           datetime not null comment 'Quand la vidéo à fini dêtre lue',
    temps_lecture int      not null comment 'Durée totale de la lectuere en secondes',
    constraint lecture_ibfk_1
        foreign key (video_id) references video (id)
            on delete cascade
);

