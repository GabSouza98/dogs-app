import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { DogsService } from '../services/dogs.service';
import { Dog, StatusEnum } from '../models/models';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    public router: Router,
    private authService: AuthService) { }

  async ngOnInit() {
    this.dogs = await this.dogService.getDogs();
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

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateAdmin() {
    return this.authService.usuario.admin == true;
  }

  async adotar(dog: Dog) {
    this.selectedDog = dog.nome;
    await this.dogService.reservar(dog.uid);
    this.setOpen(true);
    dog.status = StatusEnum.RESERVADO;
  }

  async liberar(dog: Dog) {
    await this.dogService.liberar(dog.uid);
    dog.status = StatusEnum.DISPONIVEL;
  }

  async adotado(dog: Dog) {
    await this.dogService.adotado(dog.uid);
    dog.status = StatusEnum.ADOTADO;
  }

  getStatus(status: string | undefined) {
    status = status ?? StatusEnum.RESERVADO;
    switch(status) {
      case StatusEnum.DISPONIVEL:
        return 'Conhecer';
      case StatusEnum.RESERVADO:
        return 'Reservado';
      case StatusEnum.ADOTADO:
        return 'Adotado';
      default:
        return 'Reservado';
    }
  }

}
