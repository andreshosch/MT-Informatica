import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, of } from 'rxjs';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  prueba:any[]=[]
  constructor(private firestore: AngularFirestore){}
  
  createPedido(pedido:Pedido,coleccion:string ): Promise<any>{    
    return this.firestore.collection(coleccion).add(pedido)
  }

  getPedidos(coleccion:string): Observable<any> {
    return this.firestore.collection(coleccion).snapshotChanges()
  }
  deletePedidoPorId(id: string, coleccion:string): Promise<any> {
    return this.firestore.collection(coleccion).doc(id).delete();
  }

  getPedidoById(id:string,coleccion:string): Observable<any> {
    return this.firestore.collection(coleccion).doc(id).valueChanges()
  }
}
