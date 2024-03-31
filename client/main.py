import tkinter as tk
import threading

from date_time import ClockApp
from video_controller import VideoController
from play_list import PlayList

playList = PlayList()

def main() -> None:
    th_video_controller = threading.Thread(target=start_video_controller, args=())
    th_clock = threading.Thread(target=start_clock, args=())

    if (playList.videos_exist()) :
        th_video_controller.start()
    else:
        th_clock.start()
        th_clock.join()

def start_clock():
    root = tk.Tk()
    app = ClockApp(root)
    root.mainloop()

def start_video_controller():
    root = tk.Tk()
    app = VideoController(root, playList)
    root.mainloop()

def create_video_window(root: tk.Tk):
    new_window = tk.Toplevel(root)
    new_window.geometry('500x500')

if __name__=='__main__':
    main()