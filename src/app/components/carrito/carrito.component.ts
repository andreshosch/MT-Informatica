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
