import json
import os
import requests
import settings as s

from video import Video
from dotenv import load_dotenv

load_dotenv()


class PlayList:
    _instance = None
    headers = {'Content-type': 'application/json'}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._videos = []
            cls._instance._current_video_index = 0

            cls._instance._videos = cls._instance.fetch_videos()  # Charger les vidéos selon l'ordre
            if len(cls._instance._videos) == 0:
                cls._instance._videos = cls._instance.download_videos_from_backend(cls._instance.get_playlist_from_backend())
        return cls._instance

    @property
    def videos(self):
        return self._videos

    @property
    def current_video(self) -> Video:
        return self._videos[self._current_video_index]

    def videos_exist(self):
        return len(self._videos) != 0 or len(self.download_videos_from_backend(self.get_playlist_from_backend())) != 0

    def fetch_videos(self):
        videos_db_response = requests.get(f"{os.getenv('API_URL')}/video/list")
        videos_db_json = videos_db_response.json()

        if videos_db_json.get("message") == 'Aucun résultat trouvé':
            return []

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

    def get_playlist_from_backend(self):
        unsaved_videos = requests.get(url=f"{os.getenv('API_URL')}/lecture/unsaved")

        save_request = requests.post(
            url=f"{os.getenv('SERVER_URL')}/devices/{s.DEVICE_ID}/status",
            data=json.dumps(
                {"is_playing": self.current_video is not None, "videos": json.loads(unsaved_videos.content)}),
            headers=self.headers
        )

        # The history has been saved on the backend server, we delete it on the device.
        if save_request.status_code == 200:
            print("save successful: removing history from device")
            requests.delete(
                url=f"{os.getenv('API_URL')}/historique/purge",
                headers=self.headers
            )

        return json.loads(save_request.content)

    def download_videos_from_backend(self, received_videos):
        received_videos_object = self.fetch_videos_from_json(received_videos)
        videos_on_device = self.fetch_videos()

        # download missing videos
        for received_video in received_videos_object:
            if received_video not in videos_on_device:
                print(f"downloading: {received_video.fichier}")

                missing_video = requests.get(
                    url=f"{os.getenv('SERVER_URL')}/videos/{received_video.id}/download",
                    headers=self.headers
                )

                filename = missing_video.headers.get("Content-Disposition").split("attachment; filename=")[1]
                missing_video = missing_video.content

                f = open(f"{os.path.dirname(os.path.realpath(__file__))}/videos/{filename}", "wb")
                f.write(missing_video)
                f.close()

                videos_on_device.append(received_video)

            # replace database table with incoming videos
            requests.post(
                url=f"{os.getenv('API_URL')}/video/replace",
                data={"videos": [received_videos_object]},
                headers=self.headers
            )

        return videos_on_device

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
