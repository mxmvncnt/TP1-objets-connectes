from api.database.models import Video, to_json


def get_list():
    videos = Video.select()
    return to_json(videos)


def get_by_id(video_id):
    video = Video.select().where(Video.id == video_id).first()
    return to_json(video)


def add_video(fichier, taille, md5, ordre):
    video = Video(ficher=fichier, taille=taille, md5=md5, ordre=ordre)
    video.save()
    return f"Video ajoutée avec le ID {video.id}"
