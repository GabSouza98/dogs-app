import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhotos, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  public photos: UserPhoto[] = [];

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    //Take a photo
    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false
    });

    // Save the picture and add it to photo collection
    const savedImageFile: UserPhoto = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // Save the array to preferences
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  // Save picture to file on device
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    //Convert the photo to base64 format, required by Filesystem API to save.
    const base64Data: string = await this.readAsBase64(photo);

    console.log('Tamanho da foto em formato base64:');
    console.log(base64Data.length);

    const binaryString = atob(base64Data.split(',')[1]);
    console.log('Tamanho da foto em formato binario (blob):');
    console.log(binaryString.length); //é isso que deve ser salvo, uma string binaria numa coluna BLOB do banco
    console.log(binaryString);

    //Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      //Display the new image by rewriting the 'file://' path to HTTP
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      };
    }
    else {
      // Use webPath to display the new image instead of base64 
      // since it's already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }

  }

  private async readAsBase64(photo: Photo): Promise<string> {
    // MOBILE
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data as string;
    }
    else {
      // WEB
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      console.log('A foto em formato blob:');
      console.log(blob.size);
      console.log(blob.type);

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];


    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo form the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // Delete photo file from Filesystem
    const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  public async addDogPhoto(): Promise<string> {
    //Take a photo
    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false
    });

    const base64Data: string = await this.readAsBase64(capturedPhoto);

    console.log('Tamanho da foto em formato base64:');
    console.log(base64Data.length);

    const binaryString = atob(base64Data.split(',')[1]);
    console.log('Tamanho da foto em formato binario (blob):');
    console.log(binaryString.length); //é isso que deve ser salvo, uma string binaria numa coluna BLOB do banco

    return base64Data;
  }

  public async selectPicture() {

    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
      allowEditing: false
    });

    const base64Data: string = await this.readAsBase64(capturedPhoto);

    return base64Data;
  }

  public async promptPicture() {

    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      allowEditing: false
    });

    const base64Data: string = await this.readAsBase64(capturedPhoto);

    return base64Data;
  }

}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
