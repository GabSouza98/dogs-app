import { Injectable } from '@angular/core';
import { Usuario } from '../models/models';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from '@angular/fire/auth';
import { UserCredential } from 'firebase/auth';
import { Database, set, ref, update, get } from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario!: Usuario;

  constructor(public auth: Auth, public db: Database, public router: Router) { }

  async registrarUsuario(usuario: Usuario) {

    this.registrar(usuario)    
    .then(userCredential => {

      if (userCredential) {

        //Preencher o usuario
        this.usuario = {
          uid: userCredential.user.uid,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email
        }

        set(ref(this.db, 'users/' + userCredential.user.uid), {
          uid: userCredential.user.uid,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email
        })
      }
    });
  }

  private async registrar(usuario: Usuario): Promise<UserCredential | null> {
    try {
      
      if(!usuario.senha) {
        return null;
      }

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

        await update(ref(this.db, 'users/' + uuid), {
          last_login: new Date()
        });
        
        await get(ref(this.db, 'users/' + uuid)).then((snapshot) => {
          if (snapshot.exists()) {
            this.usuario = snapshot.val() as Usuario;
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });

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

  async googleSignIn() {

    const provider = new GoogleAuthProvider();
    
    return signInWithPopup(this.auth, provider).then(res => {

      const userCredential = res.user;

      this.usuario = {
        uid: userCredential.uid,
        nome: userCredential.displayName ?? '',
        email: userCredential.email ?? '',
      }

      this.router.navigate(['menu']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));

    }, err => {
      console.log(err.message);
    })
  }

}
