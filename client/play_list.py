import os

from video import Video

class PlayList :
    def __init__(self):
        self.videos = [] 
        self.videos = self.fetch_videos()

    def videos_exist(self) -> bool:
        return len(self.videos) != 0

    def fetch_videos(self) -> list:
        videos = []
        vids_folder = './client/videos'
        extensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.mpeg']
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

