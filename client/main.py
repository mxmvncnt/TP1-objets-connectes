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
    if playList.videos_exist():
        th_video_controller.start()

    else:
        th_clock.start()
        th_clock.join()


def start_clock():
    app = ClockApp(tk.Tk())


def start_video_controller():
    app = VideoController(tk.Tk(), playList)


if __name__ == '__main__':
    th_video_controller = threading.Thread(target=start_video_controller, args=())
    th_clock = threading.Thread(target=start_clock, args=())
    main()
