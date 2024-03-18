import os

from flask import jsonify
from peewee import *
from dotenv import load_dotenv

load_dotenv()

db = MySQLDatabase(
    database=os.getenv("DB_NAME"),
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS")
)


class BaseModel(Model):
    class Meta:
        database = db

    def json(self):
        """Converts model instance to a dictionary."""
        return self.__dict__['__data__']


class Video(BaseModel):
    id = AutoField()
    fichier = CharField(max_length=1000, null=False, verbose_name='Nom du fichier')
    taille = IntegerField(null=False, verbose_name='Taille du fichier en KB')
    md5 = CharField(max_length=32, null=False)
    ordre = IntegerField(null=True, verbose_name='Position dans l\'ordre de la lecture')


class Lecture(BaseModel):
    id = AutoField()
    video_id = ForeignKeyField(Video, on_delete='CASCADE', null=False)
    debut = DateTimeField(null=False, verbose_name='Quand la vidéo a commencé à être lue')
    fin = DateTimeField(null=False, verbose_name='Quand la vidéo a fini dêtre lue')
    temps_lecture = IntegerField(null=False, verbose_name='Durée totale de la lecture en secondes')


class Historique(BaseModel):
    id = AutoField()
    date = DateField(null=False)
    video_id = ForeignKeyField(Video, on_delete='CASCADE', null=False)
    lectures = IntegerField(null=False)
    total_duree = IntegerField(null=False, verbose_name='temps de lecture total en secondes')


def to_json(query_result):
    result = [model_instance.json() for model_instance in query_result]
    return jsonify(result)
