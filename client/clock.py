import tkinter as tk
import time
from datetime import date

class ClockApp:
    def __init__(self, master: tk.Tk):
        self.master = master
        self.master.title("Date et heure")

        # Plein écran
        self.master.attributes("-fullscreen", True)

        self.date_label = tk.Label(master, text="", font=("Helvetica", 40))
        self.date_label.pack(padx=20, pady=20)
        self.time_label = tk.Label(master, text="", font=("Helvetica", 38))
        self.time_label.pack(padx=20, pady=40)

        self.update_date_and_time()
        self.master.mainloop()

    def update_date_and_time(self):
        today = f'Date du jour : {date.today()}'
        self.date_label.config(text=today)

        current_time = time.strftime('%H:%M:%S')
        self.time_label.config(text=current_time)

        self.master.after(1000, self.update_date_and_time)  # Update every 1000 milliseconds (1 second)
