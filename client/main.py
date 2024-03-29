import tkinter as tk
from date_time import ClockApp

from video_controller import VideoController
from play_list import PlayList

def main() -> None:
    playList = PlayList()

    if (playList.videos_exist()) :
        start_video_controller()
    else:
        start_clock()
    
    


def start_clock():
    root = tk.Tk()
    app = ClockApp(root)
    root.mainloop()

def start_video_controller():
    root = tk.Tk()
    app = VideoController(root)
    app.root.after(30000, create_video_window)
    root.mainloop()

def create_video_window():
    new_window = tk.Toplevel(root)
    new_window.geometry('500x500')

if __name__=='__main__':
    main()