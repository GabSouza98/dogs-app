import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { DogsService } from '../services/dogs.service';
import { Dog } from '../models/models';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  dogs: Dog[] = [];
  isModalOpen = false;
  selectedDog: string = '';

  constructor(public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public dogService: DogsService,
    public router: Router) { }

  async ngOnInit() {
    this.dogs = await this.dogService.getDogs();
    // console.log(this.dogs);
  }

  async adotar(dog: Dog) {
    this.selectedDog = dog.nome;
    await this.dogService.reservar(dog.uid);
    this.setOpen(true);
  }

  verMapa() {
    this.setOpen(false);

    (async () => {
      await this.delay(500);
      this.navegar();
    })();
  }

  async navegar() {
    this.router.navigate(['/menu/tabs/tab3']);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  isReserved(status: string | undefined) {
    return status != 'DISPONIVEL' ? true : false
  }

  // addPhotoToGallery() {
  //   this.photoService.addNewToGallery();
  // }

  // public async showActionSheet(photo: UserPhoto, position: number) {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Photos',
  //     buttons: [
  //       {
  //         text: 'Delete',
  //         role: 'destructive',
  //         icon: 'trash',
  //         handler: () => {
  //           this.photoService.deletePicture(photo, position);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         icon: 'close',
  //         handler: () => {
  //           //Nothing to do, action sheet is automatically closed
  //         }
  //       }
  //     ]
  //   });    
  //   await actionSheet.present();
  // }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
