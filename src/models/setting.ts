export class Setting {
  id: number;
  key: string;
  value: string;

  constructor(id: number, key: string, value: string) {
    this.id = id;
    this.key = key;
    this.value = value;
  }
}