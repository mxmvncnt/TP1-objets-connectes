from api.database import models
from api.database.models import Historique, to_json, Video
from datetime import datetime


def add_entry(video_id: int, duree_lecture: int):
    models.db.execute_sql(
        """
        INSERT INTO
        historique (date, video_id, lectures, total_duree)
        VALUES (%s, %s, lectures = lectures + 1, %s) ON DUPLICATE KEY UPDATE lectures = lectures + 1, total_duree = total_duree + %s""",
        [datetime.today(), int(video_id), int(duree_lecture), int(duree_lecture)])

    return "Ajoute une entree"


def get_count_today():
    return Historique.select().where(Historique.date == datetime.today()).count()


def delete_all():
    models.db.execute_sql("DELETE FROM lecture")
