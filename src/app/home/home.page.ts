import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  googleSignIn() {
    this.authService.googleSignIn();
  }

}
