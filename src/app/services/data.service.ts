import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor() { }

  async actualizarProductos(productos: any[], producto: any[], idProd: string) {
    let agregar: boolean = true
    let carroAux: any[] = []
    for(let j = 0; j < productos.length; j++){
      if(productos[j].addProducto.id === idProd){
        productos[j].addProducto.cantidad ++    
        agregar = false
        carroAux.push(productos)
        let fechaAux = new Date()
        carroAux.push(fechaAux)
        localStorage.setItem("hayCarrito", JSON.stringify(carroAux));
        //
        this.actualizarCart(productos)
        //
      }
    }
    if(agregar){
      this.actualizarCart([...productos, ...producto])
    }
  }

   actualizarCart(productos: any[]) {
    let carroAux: any[] = []
    this.productosSubject.next(productos);
    carroAux.push(productos)
    let fechaAux = new Date()
    carroAux.push(fechaAux)
    localStorage.setItem("hayCarrito", JSON.stringify(carroAux));
  }



}