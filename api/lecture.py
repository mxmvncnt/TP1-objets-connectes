from datetime import datetime

from api.database import models


def add_entry(video_id: int, debut: int, fin: int):

    datetime_debut = datetime.fromtimestamp(debut).strftime('%Y-%m-%d %H:%M:%S.%f')
    datetime_fin = datetime.fromtimestamp(fin).strftime('%Y-%m-%d %H:%M:%S.%f')

    models.db.execute_sql(
        """
        INSERT INTO
        lecture (video_id, debut, fin, temps_lecture)
        VALUES (%s, %s, %s, %s)""",
        [video_id, datetime_debut, datetime_fin, fin - debut])

    return "Ajoute une entree"
