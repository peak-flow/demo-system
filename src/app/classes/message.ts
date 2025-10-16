export class Message {
  id: string;
  type: string;
  data: any;

  constructor(type: string, data: any, id?: string) {
    this.id = id ? id :
      Math.floor(Math.random() * new Date().getTime()).toString(36);
    this.type = type;
    this.data = data;
  }
}
