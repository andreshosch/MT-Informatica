import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor() { }

  async actualizarProductos(productos: any[], producto: any[], idProd: string) {
    let agregar: boolean = true

    for(let j = 0; j < productos.length; j++){
      if(productos[j].addProducto.id === idProd){
        productos[j].addProducto.cantidad ++
        agregar = false
      }
    }
    if(agregar){
      this.actualizarCart([...productos, ...producto])
    }
    
  }

   actualizarCart(productos: any[]) {
    this.productosSubject.next(productos);
  }



}