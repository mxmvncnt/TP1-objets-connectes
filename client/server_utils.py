import json
import os
from typing import List

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
def get_missing_videos(server_videos: list[Video], local_videos: list[Video]):
    missing_videos = []
    for server_video in server_videos:
        if server_video not in local_videos:
            missing_videos.append(server_video)

    return missing_videos


# Get the videos that are present on the device but not on the server
def get_incorrect_videos(server_videos: list[Video], local_videos: list[Video]):
    incorrect_videos = []
    for local_video in local_videos:
        if local_video not in server_videos:
            incorrect_videos.append(local_video)

    return incorrect_videos
