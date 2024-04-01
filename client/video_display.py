from play_list import PlayList

# importing vlc module 
import vlc 
  
# importing time module 
import time 

class VideoDisplay:
    def __init__(self):
        self.is_playing = False

    def play(self):

        play_list = PlayList()
        videos = play_list.videos
        
        # creating a media player object 
        media_player = vlc.MediaListPlayer() 
        
        # creating Instance class object 
        player = vlc.Instance() 
        
        # creating a new media list 
        media_list = player.media_list_new()
        
        # adding media to media list 
        for video in videos:
            media_list.add_media(player.media_new(video.fichier))

        
        # setting media list to the media player 
        media_player.set_media_list(media_list) 
        
        # new media player instance 
        new = player.media_player_new() 
        
        # setting media player to it 
        media_player.set_media_player(new) 
        
        # start playing video 
        media_player.play() 

        while True:
            if media_player.is_playing():
                print('Playing')

""" class VideoDisplay:
    def __init__(self):
        self.current_video_name = ""  # Variable pour stocker le nom de la vid�o en cours de lecture

    def play(self):
        play_list = PlayList()
        videos = play_list.videos
        
        # Cr�ez une instance de MediaListPlayer
        media_player = vlc.MediaListPlayer() 
        
        # Cr�ez une instance de Instance
        player = vlc.Instance() 
        
        # Cr�ez une nouvelle liste de m�dias
        media_list = player.media_list_new()
        
        # Ajoutez les m�dias � la liste de m�dias
        for video in videos:
            media = player.media_new(video.fichier)
            media_list.add_media(media)
        
        # Configurez la liste de m�dias pour le lecteur de m�dias
        media_player.set_media_list(media_list) 
        
        # Cr�ez une nouvelle instance de lecteur de m�dias
        new_media_player = player.media_player_new() 
        
        # Configurez le lecteur de m�dias pour la liste de m�dias
        media_player.set_media_player(new_media_player) 
        
        # Commencez � lire les m�dias
        media_player.play() 

        # Mettez � jour le nom de la vid�o en cours de lecture
        self.current_video_name = videos[0].fichier  # Supposons que la premi�re vid�o dans la liste est celle qui est jou�e

        while True:
            # Mettez � jour le nom de la vid�o en cours de lecture
            if media_player.get_state() == vlc.State.Playing:
                self.current_video_name = media_list.current_media().get_mrl().split("/")[-1]
            time.sleep(1)  # Attendre un peu avant de v�rifier � nouveau l'�tat du lecteur de m�dias
    
     """