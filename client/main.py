import tkinter as tk
import threading
import time
import settings as s

from video_display import VideoDisplay
from video_controller import VideoController
from clock import ClockApp
from play_list import PlayList

playList = PlayList()

def main() -> None:

    #th_even_handler.start()

    if (playList.videos_exist()) :
        th_video_controller.start()
        th_video_player.start()

    else:
        th_clock.start()
        th_clock.join()

""" def handle_events():
    while th_video_controller.is_alive or th_video_player.is_alive:
        pass """

def start_clock():
    app = ClockApp(tk.Tk())

def start_video_controller():
    app = VideoController(tk.Tk(), playList)

""" def start_video_controller(video_display_instance):
    app = VideoController(tk.Tk(), video_display_instance) """

def startVideoPlayer():
    wait_for_seconds()
    print('VideoPlay starting')
    videoDisplay = VideoDisplay()
    videoDisplay.play()

def wait_for_seconds():
     print('Start waiting')
     time.sleep(s.WAIT_FOR_VIDEO_PLAYER)
     

if __name__=='__main__':
    # Threads
    th_video_controller = threading.Thread(target=start_video_controller, args=())
    th_clock = threading.Thread(target=start_clock, args=())
    th_video_player = threading.Thread(target=startVideoPlayer, args=())
    #th_even_handler = threading.Thread(target=handle_events, args=())
    main()