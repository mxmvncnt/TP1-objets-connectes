import tkinter as tk
import tkinter.font as tkFont

FONT_SIZE = 12


class VideoController:
    def __init__(self, root):
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
        label_video_en_cours["text"] = "Vidéo en cours :"
        label_video_en_cours.place(x=40, y=50, width=105, height=30)

        label_nombre_lectures = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_nombre_lectures["font"] = ft
        label_nombre_lectures["fg"] = "#333333"
        label_nombre_lectures["justify"] = "left"
        label_nombre_lectures["text"] = "Nombre joué aujourd'hui :"
        label_nombre_lectures.place(x=40, y=100, width=174, height=30)

        label_nombre_total_videos_jouees = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_nombre_total_videos_jouees["font"] = ft
        label_nombre_total_videos_jouees["fg"] = "#333333"
        label_nombre_total_videos_jouees["justify"] = "left"
        label_nombre_total_videos_jouees["text"] = "Nombre total des vidéos joués aujourd'hui :"
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
        bouton_video_suivante["command"] = self.bouton_video_suivante_command

        bouton_arreter_videos = tk.Button(root)
        bouton_arreter_videos["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_arreter_videos["font"] = ft
        bouton_arreter_videos["fg"] = "#000000"
        bouton_arreter_videos["justify"] = "center"
        bouton_arreter_videos["text"] = "Arrêter les vidéos"
        bouton_arreter_videos.place(x=40, y=310, width=133, height=39)
        bouton_arreter_videos["command"] = self.bouton_arreter_videos_command

        bouton_demarrer_videos = tk.Button(root)
        bouton_demarrer_videos["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times', size=10)
        bouton_demarrer_videos["font"] = ft
        bouton_demarrer_videos["fg"] = "#000000"
        bouton_demarrer_videos["justify"] = "center"
        bouton_demarrer_videos["text"] = "Démarrer les vidéos"
        bouton_demarrer_videos.place(x=190, y=310, width=168, height=38)
        bouton_demarrer_videos["command"] = self.bouton_demarrer_videos_command

        label_mouvement_detecte = tk.Label(root)
        ft = tkFont.Font(family='Times', size=FONT_SIZE)
        label_mouvement_detecte["font"] = ft
        label_mouvement_detecte["fg"] = "#333333"
        label_mouvement_detecte["justify"] = "left"
        label_mouvement_detecte["text"] = "Mouvement détecté :"
        label_mouvement_detecte.place(x=340, y=240, width=149, height=30)

    def bouton_localisation_arret_command(self):
        print("localisation/arret clicked")

    def bouton_video_suivante_command(self):
        print("video suivante clicked")

    def bouton_arreter_videos_command(self):
        print("arreter videos clicked")

    def bouton_demarrer_videos_command(self):
        print("demarrer videos clicked")
