import os

from flask import Flask, request

from api import video
from peewee import MySQLDatabase
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(__name__)
db = MySQLDatabase(
    os.getenv("DB_NAME"),
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS")
)


@app.route("/")
def error_404():
    return "<h1>Erreur 404</h1> <br> <p>Vous vous êtes perdu!</p>"


@app.get("/video/list")
def get_video_list():
    return video.get_list()


@app.get("/video/<video_id>")
def get_video(video_id):
    return video.get_by_id(video_id)


@app.post("/video/add")
def add_video():
    data = request.form
    return video.add_video(
        fichier=data.get("fichier"),
        taille=data.get("taille"),
        md5=data.get("md5"),
        ordre=data.get("ordre")
    )


if __name__ == '__main__':
    app.run()
