import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from 'src/app/services/productos.service';
import { DataService } from 'src/app/services/data.service';
import { Producto } from 'src/app/models/producto';
import { first } from 'rxjs';

@Component({
  selector: 'app-ofertas-calientes',
  templateUrl: './ofertas-calientes.component.html',
  styleUrls: ['./ofertas-calientes.component.css']
})
export class OfertasCalientesComponent {

  productosHot: any[] = []
  elProducto: Producto
  idProducto: string

  constructor(private _config: NgbCarouselConfig, private _productoService: ProductosService, private dataService: DataService){
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

  //*******Version que anda
  // agregarAlCarrito(addProducto: Producto, idProd: string) {
  //   const producto = { addProducto };
  //   this.dataService.productos$.pipe(first()).subscribe(productos => {
  //       this.dataService.actualizarProductos([...productos, producto]);
  //   });
  // }
  //*******Version que anda

  agregarAlCarrito(addProducto: Producto, idProd: string) {
    const producto = { addProducto };
    this.dataService.productos$.pipe(first()).subscribe(productos => {
        this.dataService.actualizarProductos([...productos], [producto], idProd);
    });
  }



}
