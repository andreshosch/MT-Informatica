import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent {

  productosHot: any[] = [
    {
      nombre: "Auricular Axion Strem",
      precio: "95",
      rubro: "audio",
      subrubro: "auriculares",
      img: "https://elit.com.ar/producto/16153-aio-lenovo-think-centre-neo-30a-intel-core-i5-1240p-23-8-1x8gb-256gb-free-dos",
      descripcion: "son una garcha"
    },
    {
      nombre: "Camara niños",
      precio: "256",
      rubro: "video",
      subrubro: "camara",
      img: "16153-aio-lenovo-think-centre-neo-30a-intel-core-i5-1240p-23-8-1x8gb-256gb-free-dos",
      descripcion: "safan dentro de todo"
    }
  ]

  constructor(private _config: NgbCarouselConfig){
    _config.interval = 2000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
  }

}
