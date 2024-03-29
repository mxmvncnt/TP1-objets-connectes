import vlc
from play_list import PlayList

play_list = PlayList()
videos = play_list.videos

Instance = vlc.Instance()
player = Instance.media_player_new()

Media = Instance.media_new(videos[0].fichier)
player.set_media(Media)
player.play()

while True:
    print(videos[0].fichier)
