import json
import os

import requests

from client.video_utils import *
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
        if len(self._videos) == 0:
            if len(get_server_videos()) > 0:
                add_missing_videos()
                self.videos.extend(self.fetch_videos())

        return len(self._videos) > 0

    def refresh_videos(self):
        videos_count_before = len(self._videos)
        videos = self.fetch_videos()
        videos_count_after = len(videos)

        self.videos.clear()
        self.videos.extend(videos)

        # prevent index out of bounds when deleting a video
        if videos_count_after < videos_count_before and self._current_video_index >= videos_count_after:
            difference = videos_count_after - videos_count_before
            self._current_video_index -= difference - 1

    def fetch_videos(self):
        videos_db_response = requests.get(f"{os.getenv('API_URL')}/video/list")
        videos_db_json = videos_db_response.json()

        if not isinstance(videos_db_json, list):
            return []

        videos_db = get_video_objects_from_local_json(videos_db_json)

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

    def next_video(self) -> Video:
        if self._current_video_index + 1 < len(self._videos):
            self._current_video_index += 1
        else:
            self._current_video_index = 0

        return self._videos[self._current_video_index]

    def __str__(self):
        return f'{self._videos}'
