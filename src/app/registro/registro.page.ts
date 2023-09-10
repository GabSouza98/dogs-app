import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/models';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  nome: string = '';
  sobrenome: string = '';
  email: string = '';
  senha: string= '';

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
  }

  registrar() {
    const usr: Usuario = {
      nome: this.nome,
      sobrenome: this.sobrenome,
      email: this.email,
      senha: this.senha
    }

    this.authSrv.registrarUsuario(usr).then(res => {
      this.router.navigate(['login']);
    });
  }

}
