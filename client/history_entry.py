from client.video import Video


class HistoryEntry:
    def __init__(self, id: int, video: Video, start, end):
        self.id = id
        self.video = video
        self.start = start
        self.end = end
