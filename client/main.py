import threading
import tkinter as tk

from clock import ClockApp
from play_list import PlayList
from video_controller import VideoController

play_list = PlayList()


def start_clock():
    app = ClockApp(tk.Tk())


def start_video_controller():
    root = tk.Tk()
    VideoController(root, play_list)
    root.mainloop()


if __name__ == '__main__':
    th_video_controller = threading.Thread(target=start_video_controller, args=(), daemon=True)
    th_clock = threading.Thread(target=start_clock, args=(), daemon=True)

    if play_list.videos_exist():
        th_video_controller.start()
        th_video_controller.join()
    else:
        th_clock.start()
        th_clock.join()
