import { Component, OnInit } from '@angular/core';
import { Device } from '../model/device.model';

import { NzUploadFile } from 'ng-zorro-antd/upload';

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

export class DashBoardComponent implements OnInit{
    
    listOfData: Device[] = [
        new Device(1, 'Rapsberry Pi Model 4 B', false)
    ];

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

    constructor() {}
    
    ngOnInit(): void {
        
    }
}