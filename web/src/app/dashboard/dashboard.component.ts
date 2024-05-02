import {Component, OnInit} from '@angular/core';
import {Device} from '../model/device.model';

import {NzUploadFile} from 'ng-zorro-antd/upload';
import {DataService} from "../../services/data/data.service";
import {da_DK} from "ng-zorro-antd/i18n";

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashBoardComponent implements OnInit {
  listOfData: Device[] = [];

  fileList: NzUploadFile[] = [
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.dataService.getData("/devices")
      .subscribe(data => {
        let deviceList: Device[] = [];

        data.forEach((device: any) => {
          let id: number = device.id;
          let name: string = device.name;
          let location: string = device.location;
          let isLost: boolean = device.lost;

          deviceList.push(new Device(id, name, location, isLost));
        })
        this.listOfData = deviceList;
      });
  }
}
