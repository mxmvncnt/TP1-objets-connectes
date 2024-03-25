import PySide6.QtWidgets as QtWidgets
import vlc
import sys

Instance = vlc.Instance()
player = Instance.media_player_new()
Media = Instance.media_new("beach.mp4")
player.set_media(Media)

vlcApp = QtWidgets.QApplication([])
vlcWidget = QtWidgets.QFrame()
vlcWidget.resize(800,800)
vlcWidget.show()

player.set_nsobject(vlcWidget.winId())
    
player.play()

vlcApp.exec_()
