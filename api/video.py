from typing import List
from api.database import models

from api.database.models import Video, to_json


def get_list():
    videos = Video.select().order_by(Video.ordre.asc())
    return to_json(videos)


def get_by_id(video_id):
    video = Video.select().where(Video.id == video_id).first()
    return to_json([video])


def add_video(fichier, taille, md5, ordre):
    models.db.execute_sql(
        """
        INSERT INTO
        video (fichier, taille, md5, ordre)
        VALUES (%s, %s, %s, %s)""",
        [fichier, int(taille), md5, int(ordre)])

    return "Ajoute une entree"


def remove_all():
    Video.delete()


def remove_video(video_id):
    return models.db.execute_sql("DELETE FROM video WHERE id = %s", video_id)


def replace_all(videos_json: List[Video]):
    videos = [Video(**data) for data in videos_json]
    for video in videos:
        add_video(video.fichier, video.taille, video.md5, video.ordre)
