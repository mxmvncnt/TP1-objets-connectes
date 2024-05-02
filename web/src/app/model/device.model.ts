export class Device {
    id: number;
    name: string;
    isLocated: boolean;
    
    constructor(id: number, name: string, isLocated: boolean) {
        this.id = id;
        this.name = name;
        this.isLocated = isLocated;
    }
}