import { Component } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent {

  constructor(private productosServices: ProductosService){

  }

  ngOnInit(){
    this.getCotizacion();
  }

  valorDolarActual: number = 0

  getCotizacion(){
    this.productosServices.getCotizacionActual().subscribe(doc => {
      this.valorDolarActual = doc.venta
    })
  }

}
