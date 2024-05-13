import json
import os

import requests

from video import Video
from dotenv import load_dotenv

load_dotenv()


class PlayList:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._videos = []
            cls._instance._videos = cls._instance.fetch_videos()  # Charger les vidéos selon l'ordre
            cls._instance._current_video_index = 0
        return cls._instance

    @property
    def videos(self):
        return self._videos

    @property
    def current_video(self) -> Video:
        return self._videos[self._current_video_index]

    def videos_exist(self):
        return len(self._videos) > 0

    def fetch_videos(self):
        videos_db_response = requests.get(f"{os.getenv('API_URL')}/video/list")
        videos_db_json = videos_db_response.json()
        videos_db = [Video(**data) for data in videos_db_json]

        videos = []
        vids_folder = f"{os.path.dirname(os.path.realpath(__file__))}/videos"
        extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.mpeg', '.webm']
        for video in videos_db:
            file_path = f"{vids_folder}/{video.fichier}"
            if os.path.isfile(file_path):
                _, extension = os.path.splitext(video.fichier)
                if extension.lower() in extensions:
                    video.fichier = file_path
                    videos.append(video)
        return videos

    def fetch_videos_from_json(self, json_data):
        videos_objets = []

        for video in json_data:
            new_video = Video(
                id=video.get('id'),
                fichier=video.get('file'),
                taille=video.get('size'),
                ordre=1,
                md5=video.get('md5')
            )

            videos_objets.append(new_video)

        return videos_objets

    def next_video(self) -> Video:
        if self._current_video_index + 1 < len(self._videos):
            self._current_video_index += 1
        else:
            self._current_video_index = 0

        return self._videos[self._current_video_index]

    def __str__(self):
        return f'{self._videos}'
