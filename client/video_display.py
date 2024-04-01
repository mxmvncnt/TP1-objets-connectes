from play_list import PlayList
import vlc

class VideoDisplay:
    _instance = None  # Variable de classe pour stocker l'instance unique de VideoDisplay

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.is_playing = False
            cls._instance.media_player = None  # Garder une r�f�rence au lecteur de m�dias pour pouvoir contr�ler la lecture
            cls._instance.play_list = PlayList()
        return cls._instance

    def play(self):
        videos = self.play_list.videos
        
        # Cr�ation d'un lecteur de liste de m�dias
        self.media_player = vlc.MediaListPlayer() 
        
        # Cr�ation d'une instance de classe
        self.player = vlc.Instance() 
        
        # Cr�ation d'une nouvelle liste de m�dias
        self.media_list = self.player.media_list_new()
        
        # Ajout de m�dias � la liste de m�dias
        for video in videos:
            self.media_list.add_media(self.player.media_new(video.fichier))

        # Configuration de la liste de m�dias sur le lecteur de m�dias
        self.media_player.set_media_list(self.media_list) 
        
        # Nouvelle instance de lecteur de m�dias
        new = self.player.media_player_new() 
        
        # Configuration du lecteur de m�dias
        self.media_player.set_media_player(new) 
        
        # D�marrage de la lecture
        self.media_player.play()

    def play_next_video(self):
        if self.media_player is not None:
            self.media_player.next()  # Passer � la vid�o suivante dans la liste
            self.play_list.next_video()

    def stop_playing(self):
        if self.media_player is not None:
            self.media_player.stop()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
