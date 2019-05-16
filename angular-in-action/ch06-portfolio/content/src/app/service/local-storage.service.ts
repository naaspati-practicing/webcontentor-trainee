import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  set(key: string, value: any) : void{
    localStorage.setItem(key, JSON.stringify(value));
  }
  get(key: string, default_value: any): any {
    const c = localStorage.getItem(key);
    return !c ? default_value : JSON.parse(c);
  }
}
