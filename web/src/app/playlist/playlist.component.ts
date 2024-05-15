import { Component, OnInit } from '@angular/core';
import { Video } from '../model/video.model';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '../../environments/environment';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


interface PlayList {
  video: Video;
  position: number;
}

@Component({
  selector: "app-playlist",
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistComponent implements OnInit {
  playList: PlayList[]
  // history: 
  deviceId: number;
  
  fileList: NzUploadFile[] = []
  showUploadList = true;
  previewImage: string | undefined = '';
  previewVisible = false;

  videoMovedIndex;
  videoReplacedIndex;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.params["id"];
    this.getData();
    // this.getHistoryData();
  }
  
  onChange(file: NzUploadChangeParam) {
    console.log(this.playList);
    if (file.type === 'success') {
      this.getData();
      this.showUploadList = false;
      console.log(this.playList);
    }
  }
  deleteVideo(id) {
    // this.playList = this.playList.filter((video) => video.id !== id);
    this.playList = this.playList.filter((plistItem) => plistItem.video.id !== id);

    this.dataService
      .deleteData(`/devices/${this.deviceId}/playlist/${id}`)
      .subscribe((data) => {
        console.log("Supprimé avec succès.");
      });
  }

  getData(): void {
    this.dataService
      .getData(`/devices/${this.deviceId}/playlist`)
      .subscribe((data) => {
         const playList: PlayList[] = [];

        data.forEach((video: any, index: number) => {
          let id: number = video.id;
          let file: string = video.file;
          let size: number = video.size;
          let md5: string = video.md5;
          let position: number = index + 1;

          playList.push({video : new Video(id, file, size, md5), position: position});
        });
        this.playList = playList;
        console.log(this.playList)
      });
  }

 handlePreview = async (file: NzUploadFile): Promise<void> => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj!);
  }
  this.previewImage = file.url || file.preview;
  this.previewVisible = true;
};

getUploadUrl(): string {
  return `${environment.apiUrl}/devices/${this.deviceId}/video/add`;
}

goUp(index: number) {

  if (index <= 0 || index >= this.playList.length) {
    return;
  }

  // Switch videos in playlist
  let tmpVideo = this.playList[index].video;
  this.playList[index].video = this.playList[index - 1].video;
  this.playList[index - 1].video = tmpVideo;

  // Identify videos permuted indexes
  const videoMovedIndex = index - 1;
  const videoReplacedIndex = index;

  // Get new IDs of videos permuted
  const videoMovedId = this.playList[videoMovedIndex].video.id;
  const videoReplacedId = this.playList[videoReplacedIndex].video.id;

  // Get new Positions
  const videoMovedPosition = this.playList[videoMovedIndex].position;
  const videoReplacedPosition = this.playList[videoReplacedIndex].position;

  // GetVideos
  const videoMoved = this.playList[videoMovedIndex].video;
  const videoReplaced = this.playList[videoReplacedIndex].video;

  this.changeVideoPositionInDb(videoMovedId, videoMovedPosition, videoMoved);
  this.changeVideoPositionInDb(videoReplacedId, videoReplacedPosition, videoReplaced);

  console.log(this.playList);
}

goDown(index: number) {
  if (index < this.playList.length - 1) {
    // Switch videos in playlist
    let tmpVideo = this.playList[index].video;
    this.playList[index].video = this.playList[index + 1].video;
    this.playList[index + 1].video = tmpVideo;

    // Identify videos permuted indexes
    const videoMovedIndex = index + 1;
    const videoReplacedIndex = index;    

    // Get new IDs of videos permuted
    const videoMovedId = this.playList[videoMovedIndex].video.id;
    const videoReplacedId = this.playList[videoReplacedIndex].video.id;

    // Get new Positions
    const videoMovedPosition = this.playList[videoMovedIndex].position;
    const videoReplacedPosition = this.playList[videoReplacedIndex].position;

    // GetVideos
    const videoMoved = this.playList[videoMovedIndex].video;
    const videoReplaced = this.playList[videoReplacedIndex].video;

    
    this.changeVideoPositionInDb(videoMovedId, videoMovedPosition, videoMoved);
    this.changeVideoPositionInDb(videoReplacedId, videoReplacedPosition, videoReplaced);
  }
  console.log(this.playList);
}

changeVideoPositionInDb(videoId: number, videoPosition: number, video: Video) {
  this.dataService.patchData(`/devices/${this.deviceId}/playlist/${videoId}/${videoPosition}`, video).subscribe(
    (data) => {
      console.log(data);
    }
  )
}


nextExists(index: number): boolean {
  return index < this.playList.length - 1
}
previousExists(index : number): boolean {
  return index > 0
}
}