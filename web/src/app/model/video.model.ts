export class Video {
    id: number;
    file: string;
    size: number;
    md5: string;
  
    constructor(id: number, file: string, size: number, md5: string) {
      this.id = id;
      this.file = file;
      this.size = size;
      this.md5 = md5;
    }
  }
  