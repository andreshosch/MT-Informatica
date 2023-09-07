import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from 'src/app/models/producto';
import { ProductosService } from 'src/app/services/productos.service';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent {

  productosHot: any[] = []

  constructor(private _productosService: ProductosService){

  }


  ngOnInit(){
    
  }

  ngAfterView(){
    this.getProductos()
  }

  getProductos(){
    this._productosService.getProducts().subscribe(doc => {
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

  agregarProd(){

    console.log('Ingresando a crear producto')
    const unProducto: Producto = {
      nombre: "Camara niños",
      precio: 256,
      rubro: "video",
      subrubro: "camara",
      imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_645359-MLA46557837279_062021-F.webp",
      descripcion: "safan dentro de todo"}

    this._productosService.createProduct(unProducto)

    
  }


}
