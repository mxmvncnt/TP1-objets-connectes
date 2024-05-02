export class Device {
  id: number;
  name: string;
  location: string;
  isLost: boolean;

  constructor(id: number, name: string, location: string, isLost: boolean) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.isLost = isLost;
  }
}
