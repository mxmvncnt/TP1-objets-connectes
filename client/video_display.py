import vlc
import threading


class VideoDisplay:
    def __init__(self, video, on_end_callback=None):
        self.video = video
        self.vlc = vlc.Instance()
        self.player = vlc.MediaPlayer()

        media = self.vlc.media_new(self.video.fichier)
        self.player.set_media(media)
        self.player.play()
        self.player.set_fullscreen(True)

        self.player.event_manager().event_attach(vlc.EventType.MediaPlayerEndReached, self.on_end_reached)
        self.on_end_callback = on_end_callback

    def stop_playing(self):
        self.player.stop()
        self.vlc.release()

    def on_end_reached(self, event):
        threading.Thread(target=self.handle_end_event).start()

    def handle_end_event(self):
        if self.on_end_callback:
            self.on_end_callback()
