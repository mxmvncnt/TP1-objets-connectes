import json
import os

import settings as s

import requests

from client.video import Video

headers = {'Content-type': 'application/json'}


# get unsaved watch history
def get_local_watch_data():
    print("Getting local watch data...")
    unsaved_videos = requests.get(url=f"{os.getenv('API_URL')}/lecture/unsaved")
    unsaved_videos_json = json.loads(unsaved_videos.content)

    # lazy way to handle no data found in DB
    try:
        if unsaved_videos_json.get("message") == "Aucun r\u00e9sultat trouv\u00e9":
            unsaved_videos_json = []
            print("No local watch data found.")
    except:
        print("Unsaved data found.")

    return unsaved_videos_json


def save_local_watch_data(is_playing: bool, unsaved_videos_json):
    print("Sending unsaved videos...")
    save_request = requests.post(
        url=f"{os.getenv('SERVER_URL')}/devices/{s.DEVICE_ID}/status",
        data=json.dumps({"is_playing": is_playing, "videos": unsaved_videos_json}),
        headers=headers
    )

    # The history has been saved on the backend server, we delete it on the device.
    if save_request.status_code == 200:
        print("Save successful.")
        delete_local_watch_data()

    return json.loads(save_request.content)


def delete_local_watch_data():
    print("Deleting local history from device....")
    requests.delete(
        url=f"{os.getenv('API_URL')}/historique/purge",
    )


def download_video(video: Video):
    print(video)
    print(f"Downloading: {video.fichier}")

    missing_video = requests.get(
        url=f"{os.getenv('SERVER_URL')}/videos/{video.id}/download",
        headers=headers
    )

    filename = missing_video.headers.get("Content-Disposition").split("attachment; filename=")[1]
    missing_video = missing_video.content

    print(f"Writing to file: {video.fichier}")
    f = open(f"{os.path.dirname(os.path.realpath(__file__))}/videos/{filename}", "wb")
    f.write(missing_video)
    f.close()


def add_video_to_playlist(video: Video):
    print("Adding video to database.")
    requests.post(
        url=f"{os.getenv('API_URL')}/video/add",
        data={
            "fichier": video.fichier,
            "taille": video.taille,
            "md5": video.md5,
            "ordre": 1,
        },
    )


def remove_video_from_playlist(video: Video):
    print(f"Removing {video.fichier} from local database...")
    requests.delete(
        url=f"{os.getenv('API_URL')}/video/{video.id}/remove",
    )


# Get the videos that the local device is missing
def get_missing_videos(server_videos: list[Video], local_videos: list[Video]) -> list[Video]:
    missing_videos = []
    for server_video in server_videos:
        if server_video not in local_videos:
            missing_videos.append(server_video)

    return missing_videos


# Get the videos that are present on the device but not on the server
def get_incorrect_videos(server_videos: list[Video], local_videos: list[Video]) -> list[Video]:
    incorrect_videos = []
    for local_video in local_videos:
        if local_video not in server_videos:
            incorrect_videos.append(local_video)

    return incorrect_videos


def get_server_videos() -> list[Video]:
    print("Getting server videos...")
    server_videos = requests.get(
        url=f"{os.getenv('SERVER_URL')}/devices/{s.DEVICE_ID}/playlist",
        headers=headers
    )

    server_videos_json = json.loads(server_videos.content)
    return get_video_objects_from_server_json(server_videos_json)


def get_local_videos() -> list[Video]:
    videos_db_response = requests.get(f"{os.getenv('API_URL')}/video/list")
    videos_db_json = videos_db_response.json()

    if not isinstance(videos_db_json, list):
        return []

    return [Video(**data) for data in videos_db_json]


def add_missing_videos():
    print("Getting missing videos...")
    missing_videos = get_missing_videos(get_server_videos(), get_local_videos())

    for missing_video in missing_videos:
        download_video(missing_video)
        add_video_to_playlist(missing_video)
        print("Done.")


def get_video_objects_from_server_json(json_data) -> list[Video]:
    videos_objets = []

    for video in json_data:
        new_video = Video(
            id=video.get('id'),
            fichier=video.get('file'),
            taille=video.get('size'),
            ordre=1,
            md5=video.get('md5')
        )

        videos_objets.append(new_video)

    return videos_objets


def get_video_objects_from_local_json(json_data) -> list[Video]:
    videos_objets = []

    for video in json_data:
        new_video = Video(
            id=video.get('id'),
            fichier=video.get('fichier'),
            taille=video.get('tailler'),
            ordre=video.get('ordre'),
            md5=video.get('md5')
        )

        videos_objets.append(new_video)

    return videos_objets