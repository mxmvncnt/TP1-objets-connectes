import { Component, OnInit } from '@angular/core';
import { Video } from '../model/video.model';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '../../environments/environment';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: "app-playlist",
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistComponent implements OnInit {
  playList: Video[] = [];
  deviceId: number;
  
  fileList: NzUploadFile[] = []
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.params["id"];
    this.getData();
  }

  deleteVideo(id) {
    this.playList = this.playList.filter((video) => video.id !== id);

    this.dataService
      .deleteData(`/devices/${this.deviceId}/playlist/${id}`)
      .subscribe((data) => {
        console.log(data);
        console.log("Supprimé avec succès.");
      });
  }

  getData(): void {
    this.dataService
      .getData(`/devices/${this.deviceId}/playlist`)
      .subscribe((data) => {
        let playList: Video[] = [];

        data.forEach((video: any) => {
          let id: number = video.id;
          let file: string = video.file;
          let size: number = video.size;
          let md5: string = video.md5;

          playList.push(new Video(id, file, size, md5));
        });
        this.playList = playList;
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
}