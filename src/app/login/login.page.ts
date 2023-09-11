import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  senha: string = '';

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    try {
      this.authSrv.logarUsuario(this.email, this.senha, this.router,
        function(user: Usuario, nav: Router) {
          nav.navigate(['menu']);
        });
    } catch (e) {
      console.log('ERRO LOGIN COMP = ' + JSON.stringify(e));
    }
  }

}
