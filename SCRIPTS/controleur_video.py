import tkinter as tk
import tkinter.font as tkFont

class App:
    def __init__(self, root):
        #setting title
        root.title("undefined")
        #setting window size
        width=598
        height=468
        screenwidth = root.winfo_screenwidth()
        screenheight = root.winfo_screenheight()
        alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth - width) / 2, (screenheight - height) / 2)
        root.geometry(alignstr)
        root.resizable(width=False, height=False)

        GLabel_868=tk.Label(root)
        ft = tkFont.Font(family='Times',size=16)
        GLabel_868["font"] = ft
        GLabel_868["fg"] = "#333333"
        GLabel_868["justify"] = "center"
        GLabel_868["text"] = "Contrôleur des vidéos"
        GLabel_868.place(x=220,y=10,width=186,height=30)

        GLabel_703=tk.Label(root)
        ft = tkFont.Font(family='Times',size=12)
        GLabel_703["font"] = ft
        GLabel_703["fg"] = "#333333"
        GLabel_703["justify"] = "left"
        GLabel_703["text"] = "Vidéo en cours :"
        GLabel_703.place(x=40,y=50,width=105,height=30)

        GLabel_684=tk.Label(root)
        ft = tkFont.Font(family='Times',size=12)
        GLabel_684["font"] = ft
        GLabel_684["fg"] = "#333333"
        GLabel_684["justify"] = "left"
        GLabel_684["text"] = "Nombre joué aujourd'hui :"
        GLabel_684.place(x=40,y=100,width=174,height=30)

        GLabel_132=tk.Label(root)
        ft = tkFont.Font(family='Times',size=12)
        GLabel_132["font"] = ft
        GLabel_132["fg"] = "#333333"
        GLabel_132["justify"] = "left"
        GLabel_132["text"] = "Nombre total des vidéos joués aujourd'hui :"
        GLabel_132.place(x=40,y=140,width=289,height=30)

        GLabel_685=tk.Label(root)
        ft = tkFont.Font(family='Times',size=12)
        GLabel_685["font"] = ft
        GLabel_685["fg"] = "#333333"
        GLabel_685["justify"] = "left"
        GLabel_685["text"] = "Temps joué aujourd'hui :"
        GLabel_685["relief"] = "ridge"
        GLabel_685.place(x=300,y=100,width=163,height=30)

        GButton_282=tk.Button(root)
        GButton_282["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times',size=10)
        GButton_282["font"] = ft
        GButton_282["fg"] = "#000000"
        GButton_282["justify"] = "center"
        GButton_282["text"] = "Localisation / Arrêt"
        GButton_282.place(x=130,y=190,width=129,height=36)
        GButton_282["command"] = self.GButton_282_command

        GButton_113=tk.Button(root)
        GButton_113["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times',size=10)
        GButton_113["font"] = ft
        GButton_113["fg"] = "#000000"
        GButton_113["justify"] = "center"
        GButton_113["text"] = "Passer à la vidéo suivante"
        GButton_113.place(x=110,y=250,width=173,height=37)
        GButton_113["command"] = self.GButton_113_command

        GButton_689=tk.Button(root)
        GButton_689["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times',size=10)
        GButton_689["font"] = ft
        GButton_689["fg"] = "#000000"
        GButton_689["justify"] = "center"
        GButton_689["text"] = "Arrêter les vidéos"
        GButton_689.place(x=40,y=310,width=133,height=39)
        GButton_689["command"] = self.GButton_689_command

        GButton_910=tk.Button(root)
        GButton_910["bg"] = "#c0c0c0"
        ft = tkFont.Font(family='Times',size=10)
        GButton_910["font"] = ft
        GButton_910["fg"] = "#000000"
        GButton_910["justify"] = "center"
        GButton_910["text"] = "Démarrer les vidéos"
        GButton_910.place(x=190,y=310,width=168,height=38)
        GButton_910["command"] = self.GButton_910_command

        GLabel_889=tk.Label(root)
        ft = tkFont.Font(family='Times',size=12)
        GLabel_889["font"] = ft
        GLabel_889["fg"] = "#333333"
        GLabel_889["justify"] = "left"
        GLabel_889["text"] = "Mouvement détecté :"
        GLabel_889.place(x=340,y=240,width=149,height=30)

    def GButton_282_command(self):
        print("command")


    def GButton_113_command(self):
        print("command")


    def GButton_689_command(self):
        print("command")


    def GButton_910_command(self):
        print("command")

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
