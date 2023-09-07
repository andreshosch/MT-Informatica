import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-ofertas-calientes',
  templateUrl: './ofertas-calientes.component.html',
  styleUrls: ['./ofertas-calientes.component.css']
})
export class OfertasCalientesComponent {

  productosHot: any[] = []

  // productosHot: any[] = [
  //   {
  //     nombre: "Auricular Axion Strem",
  //     precio: "95",
  //     rubro: "audio",
  //     subrubro: "auriculares",
  //     img: "https://http2.mlstatic.com/D_NQ_NP_2X_930027-MLA71145394601_082023-F.webp",
  //     descripcion: "son una garcha"
  //   },
  //   {
  //     nombre: "Camara niños",
  //     precio: "256",
  //     rubro: "video",
  //     subrubro: "camara",
  //     img: "https://http2.mlstatic.com/D_NQ_NP_2X_645359-MLA46557837279_062021-F.webp",
  //     descripcion: "safan dentro de todo"
  //   }
  // ]



  constructor(private _config: NgbCarouselConfig, private _productoService: ProductosService){
    _config.interval = 2000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
  }

  ngOnInit(){
    this.getProductos()
  }

  getProductos(){
    this._productoService.getProducts().subscribe(doc => {
      this.productosHot = []
      doc.forEach((element: any) => {
        // this.listUsuario.push(element)
        this.productosHot.push({
          id: element.payload.doc.id,
          ... element.payload.doc.data()
        })
      })
    })
  }

}
