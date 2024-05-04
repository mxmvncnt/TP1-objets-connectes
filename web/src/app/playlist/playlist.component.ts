import { Component, OnInit } from '@angular/core';
import { Video } from '../model/video.model';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnInit{

  playList: Video[] = []
  deviceId: number;

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


    // Ajouter la suppression de la vidéo de la playlist dans la bd
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

}
