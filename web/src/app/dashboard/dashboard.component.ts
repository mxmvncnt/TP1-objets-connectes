import {Component, OnDestroy, OnInit} from '@angular/core';
import {Device} from '../model/device.model';

import {DataService} from "../../services/data/data.service";
import {da_DK} from "ng-zorro-antd/i18n";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashBoardComponent implements OnInit, OnDestroy {
  listOfData: Device[] = [];
  editId: string | null = null;
  editLocationId: string | null = null;
  updateIntervalRef: any;
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
    
    // Update interface each 5 sec
    this.updateIntervalRef = setInterval(() => {this.getData(); console.log('DashBoard updated')}, (5 * 1000));
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

  startEdit(id: string, deviceInfo): void {
    if (deviceInfo === 'location') { 
      this.editLocationId = id;
    }
    else if (deviceInfo === 'name') { 
      this.editId = id;
    }
  }

  stopEdit(deviceId, value, deviceInfo): void {
    if (deviceInfo === 'location') {
      this.editLocationId = null;
      this.changeDeviceLocation(deviceId, value);
    }
    else if (deviceInfo === 'name') {
      this.editId = null;
      this.changeDeviceName(deviceId, value);
    }
  }

  changeDeviceName(deviceId: number, newValue: string) {
    
    this.dataService.patchData(`/devices/${deviceId}/editName/${newValue}/`, deviceId).subscribe(
      (data) => {
        console.log("Mise à jour éffectuée");
        console.log(this.listOfData);
      }
    )
  }
  changeDeviceLocation(deviceId: number, newValue: string) {
    console.log('Change device loc')
    this.dataService.patchData(`/devices/${deviceId}/editLocation/${newValue}`, deviceId).subscribe(
      (data) => {
        console.log("Mise à jour éffectuée");
        console.log(this.listOfData);
      }
    )
  }

  ngOnDestroy(): void {
    clearInterval(this.updateIntervalRef);
  }
}
