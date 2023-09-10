import { Injectable } from '@angular/core';
import { Storage, ref, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // constructor(public storage: Storage) { }
  constructor() { }

  // uploadFile(message: string) {

  //   const storageRef = ref(this.storage, '/imagens');

  //   uploadString(storageRef, message, 'data_url').then((snapshot) => {
  //     console.log('Uploaded a data_url string!');
  //   });

  // }

  // https://firebase.google.com/docs/storage/web/upload-files?hl=pt-br

  
}
