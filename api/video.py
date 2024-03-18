from api.database.models import Video, to_json


def get_list():
    videos = Video.select()
    return to_json(videos)
