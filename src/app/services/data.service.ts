import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor() { }

  limpiar(){
    let limpiarProductos = []
    this.productosSubject.next(limpiarProductos);
  }

  async actualizarProductos(productos: any[], producto: any[], idProd: string) {
    let agregar: boolean = true
    let carroAux: any[] = []
    let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
    let usuarioLog: any = arregloLS[0]
    
    for(let j = 0; j < productos.length; j++){
      if(productos[j].addProducto.id === idProd){
        productos[j].addProducto.cantidad ++    
        agregar = false
        carroAux.push(productos)
        let fechaAux = new Date()
        carroAux.push(fechaAux)
        localStorage.setItem(usuarioLog, JSON.stringify(carroAux));
        //
        this.actualizarCart(productos, usuarioLog)
        //
      }
    }
    if(agregar){
      this.actualizarCart([...productos, ...producto], usuarioLog)
    }
  }

   actualizarCart(productos: any[], carroUsr: any) {
    let cadena: string = carroUsr
    let carroAux: any[] = []
    this.productosSubject.next(productos);
    carroAux.push(productos)
    let fechaAux = new Date()
    carroAux.push(fechaAux)
    localStorage.setItem(cadena, JSON.stringify(carroAux));
  }



}