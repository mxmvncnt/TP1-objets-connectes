import tkinter as tk
from video_controller import VideoController

def main() -> None:
    start_video_controller()
    



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