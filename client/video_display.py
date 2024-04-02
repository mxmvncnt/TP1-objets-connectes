from play_list import PlayList
import vlc


class VideoDisplay:
    _instance = None  # Variable de classe pour stocker l'instance unique de VideoDisplay

    def __init__(self):
        self.is_playing = None
        self.media_list = None
        self.player = None
        self.media_player = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.is_playing = False
            cls._instance.media_player = None  # Garder une référence au lecteur de médias pour pouvoir contréler la lecture
            cls._instance.play_list = PlayList()
        return cls._instance

    def play(self):
        videos = self.play_list.videos

        # Création d'un lecteur de liste de médias
        self.media_player = vlc.MediaListPlayer()

        # Création d'une instance de classe
        self.player = vlc.Instance()

        # Création d'une nouvelle liste de médias
        self.media_list = self.player.media_list_new()

        # Ajout de médias é la liste de médias
        for video in videos:
            self.media_list.add_media(self.player.media_new(video.fichier))

        # Configuration de la liste de médias sur le lecteur de médias
        self.media_player.set_media_list(self.media_list)

        # Nouvelle instance de lecteur de médias
        new = self.player.media_player_new()

        # Configuration du lecteur de médias
        self.media_player.set_media_player(new)

        self.media_player.get_media_player().set_fullscreen(True)

        # Démarrage de la lecture
        self.media_player.play()

        self.is_playing = True

    def play_next_video(self):
        self.is_playing = True
        if self.media_player is not None:
            self.media_player.next()  # Passer é la vidéo suivante dans la liste
            self.play_list.next_video()
        else:
            self.play()

    def stop_playing(self):
        if self.media_player is not None:
            self.is_playing = False
            self.media_player.stop()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
