""" import os

from video import Video

class PlayList :
    def __init__(self):
        self.videos = [] 
        self.videos = self.fetch_videos()

    def videos_exist(self) -> bool:
        return len(self.videos) != 0

    def fetch_videos(self) -> list:
        videos = []
        vids_folder = f"{os.path.dirname(os.path.realpath(__file__))}/videos"
        extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.mpeg', '.webm']
        for file in os.listdir(vids_folder):
            file_path = os.path.join(vids_folder, file)
            if os.path.isfile(file_path):
                _, extension = os.path.splitext(file)
                if extension.lower() in extensions:
                    videos.append(self.__build_video(file_path))
        return videos
    
    def __build_video(self, vid_path) -> Video:
        id = len(self.videos) + 1
        fichier = vid_path
        taille = os.stat(vid_path).st_size / 1024 # en KB
        md5 = 'none'
        ordre = 1
        return Video(id, fichier, taille, md5, ordre)

    def __str__(self):
        return f'{self.videos}'

playList = PlayList()
print(playList.__str__())
 """

import os

from video import Video


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
        videos = []
        vids_folder = f"{os.path.dirname(os.path.realpath(__file__))}/videos"
        extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.mpeg', '.webm']
        for file in os.listdir(vids_folder):
            file_path = os.path.join(vids_folder, file)
            if os.path.isfile(file_path):
                _, extension = os.path.splitext(file)
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
