import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string

  constructor(private http:HttpClient) { 
    this.baseUrl="https://clientes.elit.com.ar/v1/api/productos?limit=20&offset="
    
  }
  getAllProducts(data:any):Observable<any> {
    
    return this.http.post(`${this.baseUrl}${100}`,data);
}
}
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
