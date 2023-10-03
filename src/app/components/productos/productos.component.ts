import { JsonPipe } from '@angular/common';
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

busquedas: any
totalProductos: any[]

constructor(private productosServices:ProductosService){
}


ngOnInit(){
  const requestData={
    "user_id": '22181',
    "token": "oyhl04axaro"
  }

 

  this.productosServices.getAllProducts(requestData, 100).subscribe
   (response=>{
      this.arrProductos=response['resultado']
      console.table(response['resultado'])
      this.pages=response['paginador'];
      this.pages1=Math.ceil(this.pages.total/20)
     })


 }

  // traerTodos(){
  //   const requestData={
  //     "user_id": '22181',
  //     "token": "oyhl04axaro"
  //   }
   
  //  this.busquedas= Math.ceil(this.pages.total/100)
  //  console.log(`busquedas: ${this.busquedas}`)
   
  //  let recuento = 0;
  //  this.totalProductos = []
  //  for(let j=0; j<this.busquedas; j++){
  //    recuento = recuento + 100
  //    this.productosServices.getAllProducts(requestData, recuento).subscribe
  //      (res=>{
  //        this.totalProductos.push(res['resultado'])
  //        console.log(`productos - ${j} - ${JSON.stringify(res['resultado'])}`)
  //      })
  //      console.log(JSON.stringify(this.totalProductos))
  //  }
   
  // }
 

  // traerTodo(){
  //   this.traerTodos()
  // }

}
