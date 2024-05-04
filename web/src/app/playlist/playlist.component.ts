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
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnInit{

  playList: Video[] = []
  deviceId: number;
  
  fileList: NzUploadFile[] = []
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(private dataService: DataService,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.params['id'];
    this.getData();
  }

  deleteVideo(id) {
    this.playList = this.playList.filter(video => video.id !== id );
    this.deleteData(id);
  }

  getData(): void {
    this.dataService.getData(`/devices/${this.deviceId}/playlist`)
      .subscribe(data => {
        let playList: Video[] = [];

        data.forEach((video: any) => {
          let id: number = video.id;
          let file: string = video.file;
          let size: number = video.size;
          let md5: string = video.md5;

          playList.push(new Video(id, file, size, md5));
        })
        this.playList = playList;
      });
  }

  deleteData(playlistId): void {
    this.dataService.deleteData((`/devices/${this.deviceId}/playlist/${playlistId}`))
    .subscribe(data => {
      console.log(data);
      console.log('Supprimé avec succès.');
    })
  }

//  uploadVideo(video: any, deviceId: number) {
//   const form = new FormData();
//   form.append("file", video);

//   this.dataService.postData(`/devices/${deviceId}/video/add`, form)
//  }

//  handleChange(info: { file: NzUploadFile }): void {
//   if (info.file.status === 'done') {
//     console.log('Fichier téléchargé :', info.file);
//     this.uploadVideo(info.file.originFileObj, this.deviceId);
//   } else if (info.file.status === 'error') {
//     console.error('Erreur lors du téléchargement du fichier :', info.file.error);
//   }
// }

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
