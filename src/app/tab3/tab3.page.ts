import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Loader } from "@googlemaps/js-api-loader";
import { environment } from 'src/environments/environment';

// Localização padrão, quando o usuário não tem uma localização vinculada
const unisinosLocation = {
  lat: -29.79551478678531,
  lng: -51.15533565494113
};

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

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

      if (!this.authService.usuario) {
        this.router.navigate(['login']);
      } else {
        this.latitude = unisinosLocation.lat;
        this.longitude = unisinosLocation.lng;
        this.carregarMapa();
      }
    }
    );
  }

  carregarMapa() {

    const loader = new Loader({
      apiKey: environment.googleMapsApiKey
    });

    loader.load().then(async () => {

      const mapOptions = {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Aulas
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


      const icon = {
        url: "assets/icon/2527026.png", // url
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };

      //Fazer isso aqui para os pontos de coleta, e para marcar a localização do canil municipal
      const gloc1 = new google.maps.LatLng(unisinosLocation.lat, unisinosLocation.lng);
      const marker1 = new google.maps.Marker({
        position: gloc1,
        map: this.map,
        icon: icon
      });

      // const gloc2 = new google.maps.LatLng(this.latitude, this.longitude);
      // const marker2 = new google.maps.Marker({
      //   position: gloc2,
      //   map: this.map,
      //   icon: 'assets/icon/character.png'
      // });

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
