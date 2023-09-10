import { Injectable } from '@angular/core';
import { Usuario } from '../models/models';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserCredential } from 'firebase/auth';
import { Database, set, ref, update, get } from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario!: Usuario;

  constructor(public auth: Auth, public db: Database) { }

  async registrarUsuario(usuario: Usuario) {
    this.registrar(usuario)    
    .then(userCredential => {

      if (userCredential) {
        console.log('Regitrado: ' + userCredential.user.uid);

        //Preencher o usuario
        this.usuario = {
          uid: userCredential.user.uid,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          senha: usuario.senha
        }

        set(ref(this.db, 'users/' + userCredential.user.uid), {
          uid: userCredential.user.uid, //meio que redundante
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          senha: usuario.senha //remover isso depois
        })
      }
    });
  }

  private async registrar(usuario: Usuario): Promise<UserCredential | null> {
    try {
      return await createUserWithEmailAndPassword(this.auth, usuario.email, usuario.senha);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async logarUsuario(email: string, senha: string, nav?: Router, callback?: any) {
    this.login(email, senha)    
    .then(async userCredential => {

      if (userCredential) {

        const uuid = userCredential.user.uid;

        console.log('Logado: ' + uuid);

        await update(ref(this.db, 'users/' + uuid), {
          last_login: new Date()
        });
        
        await get(ref(this.db, 'users/' + uuid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());

            this.usuario = snapshot.val() as Usuario;

            console.log('resultado do usuario:');
            console.log(this.usuario);
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });

        console.log(this.usuario);
        if (callback) {
          callback(this.usuario, nav);
        }
      }
    });
  }

  private async login(email: string, senha: string): Promise<UserCredential | null> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, senha);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  signOut() {
    signOut(this.auth).then(() => {
      //Sign out sucessfully
    }).catch((error) => {
      //An error happened
    });
  }

}
