import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: AngularFirestore) { 

  }

  getProducts(): Observable<any> {
    return this.firestore.collection('Productos').snapshotChanges()
  }

  createProduct(producto: Producto): Promise<any>{
    return this.firestore.collection('Productos').add(producto)
    
  }


}
