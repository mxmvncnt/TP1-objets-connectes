import os
import threading
import time
import tkinter as tk
import tkinter.font as tkFont

import requests

import settings as s
from video import Video
from play_list import PlayList
from video_display import VideoDisplay

try:
    from sensor import Sensor
    sensor_found: bool = True
except (RuntimeError, ModuleNotFoundError) as e:
    print("Could not load Sensor module because the device does not support GPIO.")
    sensor_found: bool = False
finally:
    pass
   

FONT_SIZE = 12


class VideoController:
    def __init__(self, root: tk.Tk, play_list: PlayList):
        self.video_display = None

        self.led_blinking = False
        if sensor_found:
            self.sensor = Sensor(on_motion_callback=self.handle_motion_detection)
            self.led_thread = None

        self.play_list = play_list
        self.current_video: Video = self.play_list.current_video

        # Thread Affichage Video
        self.th_video_display = threading.Thread(target=self.play, args=(True, self.current_video,), daemon=True)
        self.th_video_display.start()

        # Thread GUI
        self.th_gui = threading.Thread(target=self.create_gui, args=(root,), daemon=True)
        self.th_gui.start()

        # Thread GPIO
        self.th_gpio = threading.Thread(target=self.start_gpio, daemon=True)
        self.th_gpio.start()

        self.titre_video_gui = tk.StringVar()
        self.count_today = tk.StringVar()
        self.duree_today = tk.StringVar()
        self.text_detection_motion = tk.StringVar()
        self.text_detection_motion.set("Non")

    def create_gui(self, root):
        self.root = root
        # setting title
        root.title("Lecteur de vidéos")
        # setting window size
        width = 598
        height = 468
        screenwidth = root.winfo_screenwidth()
        screenheight = root.winfo_screenheight()
        alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth - width) / 2, (screenheight - height) / 2)
        root.geometry(alignstr)
        root.resizable(width=False, height=False)

        label_titre = tk.Label(root)
        ft = tkFont.Font(family='Times', size=16)
        label_titre["font"] = ft
        label_titre["fg"] = "#333333"
        label_titre["justify"] = "center"
        label_titre["text"] = "Contrôleur des vidéos"
        label_titre.place(x=220, y=10, width=186, height=30)

        label_video_en_cours = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_video_en_cours["font"] = ft
        label_video_en_cours["fg"] = "#333333"
        label_video_en_cours["justify"] = "left"
        label_video_en_cours["text"] = "Vidéo en cours: "
        label_video_en_cours.place(x=40, y=50, width=105, height=30)

        label_nom_video_en_cours = tk.Label(root, textvariable=self.titre_video_gui)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_nom_video_en_cours["font"] = ft
        label_nom_video_en_cours["fg"] = "#333333"
        label_nom_video_en_cours["justify"] = "left"
        label_nom_video_en_cours.place(x=150, y=50, width=150, height=30)

        label_nombre_lectures = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_nombre_lectures["font"] = ft
        label_nombre_lectures["fg"] = "#333333"
        label_nombre_lectures["justify"] = "left"
        label_nombre_lectures["text"] = "Nombre joué aujourd'hui :"
        label_nombre_lectures.place(x=40, y=100, width=174, height=30)

        label_nombre_total_videos_jouees = tk.Label(root, textvariable=self.count_today)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_nombre_total_videos_jouees["font"] = ft
        label_nombre_total_videos_jouees["fg"] = "#333333"
        label_nombre_total_videos_jouees["justify"] = "left"
        label_nombre_total_videos_jouees.place(x=40, y=140, width=289, height=30)

        label_temps_joue = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_temps_joue["font"] = ft
        label_temps_joue["fg"] = "#333333"
        label_temps_joue["justify"] = "left"
        label_temps_joue["text"] = "Temps joué aujourd'hui :"
        label_temps_joue["relief"] = "ridge"
        label_temps_joue.place(x=300, y=100, width=163, height=30)

        bouton_localisation_arret = tk.Button(root)
        bouton_localisation_arret["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_localisation_arret["font"] = ft
        bouton_localisation_arret["fg"] = "#000000"
        bouton_localisation_arret["justify"] = "center"
        bouton_localisation_arret["text"] = "Localisation / Arrêt"
        bouton_localisation_arret.place(x=130, y=190, width=129, height=36)
        bouton_localisation_arret["command"] = self.bouton_localisation_arret_command

        bouton_video_suivante = tk.Button(root)
        bouton_video_suivante["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_video_suivante["font"] = ft
        bouton_video_suivante["fg"] = "#000000"
        bouton_video_suivante["justify"] = "center"
        bouton_video_suivante["text"] = "Passer à la vidéo suivante"
        bouton_video_suivante.place(x=110, y=250, width=173, height=37)
        bouton_video_suivante["command"] = self.skip

        bouton_arreter_videos = tk.Button(root)
        bouton_arreter_videos["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_arreter_videos["font"] = ft
        bouton_arreter_videos["fg"] = "#000000"
        bouton_arreter_videos["justify"] = "center"
        bouton_arreter_videos["text"] = "Arrêter les vidéos"
        bouton_arreter_videos.place(x=40, y=310, width=133, height=39)
        bouton_arreter_videos["command"] = self.stop

        bouton_demarrer_videos = tk.Button(root)
        bouton_demarrer_videos["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_demarrer_videos["font"] = ft
        bouton_demarrer_videos["fg"] = "#000000"
        bouton_demarrer_videos["justify"] = "center"
        bouton_demarrer_videos["text"] = "Démarrer les vidéos"
        bouton_demarrer_videos.place(x=190, y=310, width=168, height=38)
        bouton_demarrer_videos["command"] = self.bouton_play

        label_mouvement_detecte = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_mouvement_detecte["font"] = ft
        label_mouvement_detecte["fg"] = "#333333"
        label_mouvement_detecte["justify"] = "left"
        label_mouvement_detecte["text"] = "Mouvement détecté : "
        label_mouvement_detecte.place(x=340, y=240, width=149, height=30)

        label_txt_mouvement_detecte = tk.Label(root, textvariable=self.text_detection_motion)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_txt_mouvement_detecte["font"] = ft
        label_txt_mouvement_detecte["fg"] = "#333333"
        label_txt_mouvement_detecte["justify"] = "left"
        label_txt_mouvement_detecte.place(x=480, y=240, width=50, height=30)

    def bouton_localisation_arret_command(self):
        print("localisation/arret clicked")
        if self.video_display is not None:
            if not self.led_blinking:
                self.start_led_blinking_thread()
            else:
                self.stop_led_blinking_thread()

    def play_next_video(self):
        if self.video_display is not None:
            self.video_display.stop_playing()
            self.video_display = None

        self.current_video = self.play_list.next_video()
        self.play(False, self.current_video)

    def skip(self):
        if self.video_display is not None:
            print(f"skipping to video: {self.play_list.current_video.fichier}")

            self.stop()
            self.current_video = self.play_list.next_video()
            self.play(False, self.current_video)
        else:
            self.play(False, self.play_list.current_video)

    def stop(self):
        if self.video_display is not None:
            self.send_watch_data()

            self.video_display.stop_playing()
            self.video_display = None
            self.titre_video_gui.set("")

            if sensor_found:
                if self.led_blinking:
                    self.stop_led_blinking_thread()

    def play(self, wait: bool, video: Video):
        if wait:
            print("waiting for delay...")
            time.sleep(s.WAIT_FOR_VIDEO_PLAYER)

        if self.video_display is None:
            print(f"playing video: {video.fichier}")
            self.video_display = VideoDisplay(video, self.skip)
            self.current_video = video
            self.titre_video_gui.set(
                self.current_video.fichier.split(f"{os.path.dirname(os.path.realpath(__file__))}/videos/")[1])

    def bouton_play(self):
        if self.video_display is None:
            self.play(False, self.current_video)

    def start_gpio(self):
        if sensor_found:
            self.sensor.loop()

    def start_led_blinking_thread(self):
        self.led_blinking = True
        if sensor_found:
            self.led_thread = threading.Thread(target=self.led_blink, daemon=True)
            self.led_thread.start()

    def stop_led_blinking_thread(self):
        self.led_blinking = False
        if sensor_found:
            if self.led_thread is not None:
                self.led_thread.join()
                self.led_thread = None

    def led_blink(self):
        if sensor_found:
            while self.led_blinking:
                self.sensor.turn_on_led()
                time.sleep(0.5)
                self.sensor.turn_off_led()
                time.sleep(0.5)

    def handle_motion_detection(self):
        self.text_detection_motion.set("Oui")
        self.skip()
        self.text_detection_motion.set("Non")

    def send_watch_data(self):
        fin = int(time.time())
        duree_lecture = int(fin - self.video_display.get_start_time())

        requests.post(
            url=f"{os.getenv('API_URL')}/historique/add",
            data={"video_id": self.current_video.id, "duree_lecture": duree_lecture}
        )

        requests.post(
            url=f"{os.getenv('API_URL')}/lecture/add",
            data={"video_id": self.current_video.id, "debut": self.video_display.get_start_time(), "fin": fin}
        )

        count = requests.get(url=f"{os.getenv('API_URL')}/historique/today/count")
        self.count_today = f"Nombre total des vidéos joués aujourd'hui: {count}"
