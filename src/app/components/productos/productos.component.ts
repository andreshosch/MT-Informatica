import { Component } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
arrProductos:any[]
arrPaginador:any[]
pages1:any
pages:any


constructor(private productosServices:ProductosService){
}


ngOnInit(){
  const requestData={
    "user_id": '22181',
    "token": "oyhl04axaro"
  }
  this.productosServices.getAllProducts(requestData).subscribe
   (response=>{
   this.arrProductos=response['resultado']
    this.pages=response['paginador'];
    this.pages1=Math.ceil(this.pages.total/20)
  })
 }
}
