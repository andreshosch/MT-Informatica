import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  productos: any[] = [];
  total: number=0
  monto: number = 0

  //Inicio Carrito
  carritoHabilitado: boolean =false
  //Fin Carrito

  constructor(private dataService: DataService){
    
  }

  ngOnInit(){
       // Suscribirse al Observable del servicio para recibir actualizaciones
       this.dataService.productos$.subscribe(productos => {
        this.productos = productos;
        this.total = this.productos.length
        this.monto = 0
        for(let j=0; j < this.total; j++){
          this.monto = this.monto + parseInt(productos[j].addProducto.precio)
        }
      });
  }

  verCart(){
    console.log(JSON.stringify(this.productos))
  }  

//Inicio sección Carrito
verCarrito(){
  this.carritoHabilitado = true
}

ocultarCarrito(){
  this.carritoHabilitado = false
}

//Fin sección Carrito

}
