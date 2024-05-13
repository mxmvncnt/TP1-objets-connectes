create table device
(
    id       int auto_increment
        primary key,
    name     varchar(255)         not null,
    location varchar(255)         not null,
    is_lost  tinyint(1) default 0 not null comment 'si l''objet est en mode "localisation"'
)
    comment 'les appareils (le T de IoT)';

create table video
(
    id   int auto_increment
        primary key,
    file varchar(255) not null,
    size int          not null comment 'size in KB',
    md5  varchar(32)  not null comment 'MD5 sum of the video file'
);

create table history
(
    id       int auto_increment
        primary key,
    video_id int      not null,
    start    datetime not null comment 'when the video started playing',
    end      datetime not null comment 'when the video stopped playing',
    constraint history_video_id_fk
        foreign key (video_id) references video (id)
            on delete cascade
);

create table playlist
(
    id        int auto_increment
        primary key,
    device_id int not null,
    video_id  int not null comment 'ID of the video',
    position  int not null comment 'position of the video in the playlist',
    constraint playlist_device_id_fk
        foreign key (device_id) references device (id)
            on delete cascade,
    constraint playlist_video_id_fk
        foreign key (video_id) references video (id)
            on delete cascade
);

