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
  
  createPedido(pedido:any ): Promise<any>{  
    console.log(pedido)  
    return this.firestore.collection('Pedidos').add(pedido)
  }

  getPedidos(): Observable<any> {
    return this.firestore.collection('Pedidos').snapshotChanges()
  }
}
