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
        return len(self._videos) != 0

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
                    videos.append(self.__build_video(file_path))
        return videos

    def __build_video(self, vid_path):
        id = len(self._videos) + 1
        fichier = vid_path
        taille = os.stat(vid_path).st_size / 1024  # en KB
        md5 = 'none'
        ordre = 1
        return Video(id, fichier, taille, md5, ordre)

    def next_video(self) -> Video:
        if self._current_video_index + 1 < len(self._videos):
            self._current_video_index += 1
        else:
            self._current_video_index = 0

        return self._videos[self._current_video_index]

    def __str__(self):
        return f'{self._videos}'
