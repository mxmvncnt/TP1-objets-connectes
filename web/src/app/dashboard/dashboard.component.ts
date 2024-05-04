import {Component, OnInit} from '@angular/core';
import {Device} from '../model/device.model';

import {DataService} from "../../services/data/data.service";
import {da_DK} from "ng-zorro-antd/i18n";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashBoardComponent implements OnInit {
  listOfData: Device[] = [];

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

  toggleDeviceLost(device: Device): void {
    this.dataService.getData(`/devices/${device.id}/lost?isLost=${!device.isLost}`, )
      .subscribe(data => {
        device.isLost = !device.isLost;
      });
  }
}
