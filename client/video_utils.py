import hashlib
import json
import os
from datetime import datetime
from typing import List, Dict, Any

import settings as s

import requests

from client.history_entry import HistoryEntry
from client.video import Video

headers = {'Content-type': 'application/json'}


# get unsaved watch history
def get_local_watch_data() -> list[HistoryEntry]:
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

    return get_history_objects_from_local_json(unsaved_videos_json)


def save_local_watch_data(is_playing: bool, unsaved_history):
    print("Sending unsaved videos...")
    save_request = requests.post(
        url=f"{os.getenv('SERVER_URL')}/devices/{s.DEVICE_ID}/status",
        data=json.dumps({"is_playing": is_playing, "videos": unsaved_history}),
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


def download_video(video: Video) -> bool:
    print(f"Downloading: {video.fichier}")

    missing_video = requests.get(
        url=f"{os.getenv('SERVER_URL')}/videos/{video.id}/download",
        headers=headers
    )

    filename = missing_video.headers.get("Content-Disposition").split("attachment; filename=")[1]
    missing_video = missing_video.content

    hash_md5 = hashlib.md5()

    print(f"Writing to file: {video.fichier}")
    path = f"{os.path.dirname(os.path.realpath(__file__))}/videos/{filename}"
    with open(path, "wb") as f:
        f.write(missing_video)
        print("Calculating MD5...")
        hash_md5.update(missing_video)

    md5_hash = hash_md5.hexdigest()

    if md5_hash != video.md5:
        print("The MD5 does not match. Deleting file...")
        os.remove(path)
        return False

    return True


def add_video_to_playlist(video: Video):
    print("Adding video to database.")
    requests.post(
        url=f"{os.getenv('API_URL')}/video/add",
        data={
            "fichier": video.fichier,
            "taille": video.taille,
            "md5": video.md5,
            "ordre": video.ordre,
        },
    )


def remove_video_from_playlist(video: Video):
    print(f"Removing {video.fichier} (id: {video.id}) from local database...")
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
    print("Getting incorrect videos...")
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

    return get_video_objects_from_local_json(videos_db_json)


def add_missing_videos():
    print("Getting missing videos...")
    server_videos = get_server_videos()
    local_videos = get_local_videos()
    missing_videos = get_missing_videos(server_videos, local_videos)

    for missing_video in missing_videos:
        download_success = download_video(missing_video)
        if download_success:
            add_video_to_playlist(missing_video)
            print("Done.")


def remove_incorrect_videos():
    server_videos = get_server_videos()
    local_videos = get_local_videos()
    incorrect_videos = get_incorrect_videos(server_videos, local_videos)

    print("Removing incorrect videos...")
    for incorrect_video in incorrect_videos:
        remove_video_from_playlist(incorrect_video)
        print("Done.")


def get_video_objects_from_server_json(json_data) -> list[Video]:
    videos_objets = []

    for video in json_data:
        new_video = Video(
            id=video.get('id'),
            fichier=video.get('file'),
            taille=video.get('size'),
            ordre=video.get('position'),
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


def get_history_objects_from_local_json(json_data) -> list[HistoryEntry]:
    history_objects = []

    for history in json_data:
        video: Video = get_video_from_id(history.get('video_id'))
        new_video = HistoryEntry(
            id=history.get('id'),
            video=video,
            start=history.get('debut'),
            end=history.get('fin')
        )

        history_objects.append(new_video)

    return history_objects


def get_history_json_from_objects(history: list[HistoryEntry]) -> list[dict[str, Any]]:
    history_objects = []

    for entry in history:
        history_objects.append({
            "md5": entry.video.md5,
            "start": datetime.strptime(entry.start, "%a, %d %b %Y %H:%M:%S %Z").strftime('%Y-%m-%d %H:%M:%S'),
            "end": datetime.strptime(entry.end, "%a, %d %b %Y %H:%M:%S %Z").strftime('%Y-%m-%d %H:%M:%S')
        })

    return history_objects


def get_video_from_id(video_id: int) -> Video:
    video = requests.get(f"{os.getenv('API_URL')}/video/{video_id}")
    video_db_json = video.json()
    return get_video_objects_from_local_json(video_db_json)[0]
