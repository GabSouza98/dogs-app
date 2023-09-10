import { Component } from '@angular/core';
import { DogsService } from '../services/dogs.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Dog, PORTE } from '../models/models';
import { PhotoService } from '../services/photo.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nome: string = '';
  raca: string = '';
  idade: number = 0;
  vacinado: boolean = false;
  docil: boolean = false;
  porte: string = '';
  sexo: string = '';
  cor: string = '';
  caracteristicas: string = '';
  foto: string = '';

  constructor(private authSrv: AuthService, 
    private router: Router, 
    private dogService: DogsService,
    private photoService: PhotoService,
    private storageService: StorageService) { }

  ngOnInit() {
  }

  async registrar() {
    const dog: Dog = {
      nome: this.nome,
      raca: this.raca,
      idade: this.idade,
      vacinado: this.vacinado,
      docil: this.docil,
      porte: this.porte,
      sexo: this.sexo,
      cor: this.cor,
      caracteristicas: this.caracteristicas,
      usuarioId: this.authSrv.usuario.uid,
      foto: this.foto
    }

    await this.dogService.registrarDog(dog);

    console.log('dog salvou');

    this.resetForm();
  }

  async takeDogPhoto() {
    this.foto = await this.photoService.addDogPhoto();
  }

  async choosePicture() {
    this.foto = await this.photoService.selectPicture();
  }

  async promptPicture() {
    this.foto = await this.photoService.promptPicture();
  }

  resetForm() {
    this.nome = '';
    this.raca = '';
    this.idade = 0;
    this.vacinado = false;
    this.docil = false;
    this.porte = '';
    this.sexo = '';
    this.cor = '';
    this.caracteristicas = '';
    this.foto = '';
  }

}
