import json
import os
import threading

from flask import Flask, request

from api import video, historique, lecture
from peewee import MySQLDatabase
from dotenv import load_dotenv

from api.database.models import Video

load_dotenv()

app = Flask(__name__)
app.config.from_object(__name__)


@app.route("/")
def error_404():
    return "<h1>Erreur 404</h1> <br> <p>Vous vous êtes perdu!</p>"


@app.get("/video/list")
def get_video_list():
    return video.get_list()


@app.get("/video/<video_id>")
def get_video(video_id):
    return video.get_by_id(video_id)


@app.get("/historique/today/count")
def get_count_today():
    return str(historique.get_count_today())


@app.post("/video/add")
def add_video():
    data = request.form
    return video.add_video(
        fichier=data.get("fichier"),
        taille=data.get("taille"),
        md5=data.get("md5"),
        ordre=data.get("ordre")
    )


@app.post("/video/replace")
def replace_videos():
    data = request.form
    return video.replace_all(data)


@app.delete("/video/<video_id>/remove")
def remove_video(video_id):
    return video.remove_video(video_id)


@app.post("/historique/add")
def add_historique():
    data = request.form

    return historique.add_entry(
        video_id=int(data.get("video_id")),
        duree_lecture=int(data.get("duree_lecture"))
    )


@app.post("/lecture/add")
def add_lecture():
    data = request.form

    print("===")
    print(data)
    print("===")

    return lecture.add_entry(
        video_id=int(data.get("video_id")),
        debut=int(data.get("debut")),
        fin=int(data.get("fin"))
    )


@app.get("/lecture/unsaved")
def get_lectures():
    return lecture.get_list()


@app.delete("/historique/purge")
def purge_history():
    lecture.delete_all()
    historique.delete_all()


if __name__ == '__main__':
    app.run()
