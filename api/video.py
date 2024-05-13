from typing import List

from api.database.models import Video, to_json


def get_list():
    videos = Video.select().order_by(Video.ordre.asc())
    return to_json(videos)


def get_by_id(video_id):
    video = Video.select().where(Video.id == video_id).first()
    return to_json(video)


def add_video(fichier, taille, md5, ordre):
    video = Video(ficher=fichier, taille=taille, md5=md5, ordre=ordre)
    video.save()
    return f"Video ajoutée avec le ID {video.id}"


def remove_all():
    Video.delete()


def remove_video(video_id):
    video = Video.select().where(Video.id == video_id)


def replace_all(videos_json: List[Video]):
    print(videos_json)
    videos = [Video(**data) for data in videos_json]
    for video in videos:
        new_video = Video(ficher=video.fichier, taille=video.taille, md5=video.md5, ordre=video.ordre)
        new_video.save()
