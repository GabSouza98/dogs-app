import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Loader } from "@googlemaps/js-api-loader";

// Localização padrão, quando o usuário não tem uma localização vinculada
const unisinosLocation = {
  lat: -29.79551478678531,
  lng: -51.15533565494113
};

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  @ViewChild('map') mapElement!: ElementRef;

  map: any;
  address: string = '';
  latitude: number = 0;
  longitude: number = 0;

  constructor(private platform: Platform,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {

      console.log(this.authService.usuario); //esta logando {}

      if (!this.authService.usuario) {
        this.router.navigate(['login']);
      } else {

        //Essa parte só funciona se o usuario estiver definido
        this.latitude = this.authService.usuario.latitude ? this.authService.usuario.latitude : unisinosLocation.lat;
        this.longitude = this.authService.usuario.longitude ? this.authService.usuario.longitude : unisinosLocation.lng;

        this.carregarMapa();
      }
    }
    );
  }

  carregarMapa() {

    const loader = new Loader({
      apiKey: 'AIzaSyBbgpTYp_tT0EiKKgJpOn6xa7UnSwBnJM8'
    });

    loader.load().then(async () => {

      const mapOptions = {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Aulas
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //Fazer isso aqui para os pontos de coleta, e para marcar a localização do canil municipal
      const gloc1 = new google.maps.LatLng(unisinosLocation.lat, unisinosLocation.lng);
      const marker1 = new google.maps.Marker({
        position: gloc1,
        map: this.map,
        icon: 'assets/icon/favicon.png'
      });

      const gloc2 = new google.maps.LatLng(this.latitude, this.longitude);
      const marker2 = new google.maps.Marker({
        position: gloc2,
        map: this.map,
        icon: 'assets/icon/character.png'
      });

      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
      });

    });
  }

  atualizarLocalizacao() {
    // this.authService.atualizarDadosUsuario(this.latitude, this.longitude);
  }

}
