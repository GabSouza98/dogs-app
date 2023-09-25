import { Injectable } from '@angular/core';
import { Usuario, Dog, StatusEnum } from '../models/models';
import { Database, set, ref, update, get, onValue } from '@angular/fire/database';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  dogs: Dog[] = [];

  constructor(public db: Database) { }

  async registrarDog(dog: Dog) {

    const uid = uuid();

    await set(ref(this.db, 'dogs/' + uid), {
      uid: uid,
      nome: dog.nome,
      raca: dog.raca,
      idade: dog.idade,
      vacinado: dog.vacinado,
      docil: dog.docil,
      porte: dog.porte,
      sexo: dog.sexo,
      cor: dog.cor,
      caracteristicas: dog.caracteristicas,
      usuarioId: dog.usuarioId,
      foto: dog.foto,
      status: 'DISPONIVEL'
    })
  }

  async getDogs(): Promise<Dog[]> {

    let dogsArray: any;

    await get(ref(this.db, 'dogs/')).then((snapshot) => {
      if (snapshot.exists()) {

        dogsArray = snapshot.val();

        const keys = Object.keys(dogsArray);

        this.dogs = [];

        keys.forEach((key) => {
          this.dogs.push(dogsArray[key] as Dog);
        });

        this.dogs = this.dogs.filter((dog) => dog.status != StatusEnum.ADOTADO);

      } else {
        console.log('No data');
      }

    }).catch((error) => {
      console.error(error);
    });

    return this.dogs;
  } 

  async reservar(uid: string | undefined) {
    await update(ref(this.db, 'dogs/' + uid), {
      status: 'RESERVADO'
    });
  }

  async liberar(uid: string | undefined) {
    await update(ref(this.db, 'dogs/' + uid), {
      status: 'DISPONIVEL'
    });
  }

  async adotado(uid: string | undefined) {
    await update(ref(this.db, 'dogs/' + uid), {
      status: 'ADOTADO'
    });
  }

}


