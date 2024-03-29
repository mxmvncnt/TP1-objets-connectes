class Video :
    def __init__(self, id, fichier, taille, md5, ordre):
        self.id = id
        self.fichier = fichier
        self.taille = taille,
        self.md5 = md5
        self.ordre = ordre 
    def __str__(self):
        return f'{self.fichier}'