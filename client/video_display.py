from play_list import PlayList

# importing vlc module 
import vlc 
  
# importing time module 
import time 

class VideoDisplay:
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
            print()