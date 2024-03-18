import os

from flask import Flask

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
def hello_world():
    return video.get_list()


if __name__ == '__main__':
    app.run()
