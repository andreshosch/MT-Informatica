import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
import { Observable, of } from 'rxjs';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string
  baseUrl1: string

  private onlyCategory: string[] = [];

  setOnlyCategory(data: string[]): void {
    this.onlyCategory = data;
    console.log(`service: ${JSON.stringify(this.onlyCategory)}`)
  }

  getOnlyCategory(): string[] {
    return this.onlyCategory;
  }

  constructor(private http:HttpClient, private firestore: AngularFirestore) { 
    this.baseUrl="https://clientes.elit.com.ar/v1/api/productos?limit="
        
  }

getArrayProducts(data:any,limit:number,offset:number):Observable<any>{
  return this.http.post(`${this.baseUrl}${limit}&offset=${offset}`,data);
}

getProducts(): Observable<any> {
  return this.firestore.collection('Productos').snapshotChanges()
}

createProduct(producto: Producto): Promise<any>{
  return this.firestore.collection('Productos').add(producto)
}

deleteProduct(id: string): Promise<any> {
  return this.firestore.collection('Productos').doc(id).delete();
}

getProductById(id:string): Observable<any> {
  return this.firestore.collection('Productos').doc(id).valueChanges()
}

 updateProduct(id: string, cliente: any): Promise<any> {
   return this.firestore.collection('Productos').doc(id).update(cliente);
 }



getBloqueos(): Observable<any>{
  return this.firestore.collection('Bloqueos').snapshotChanges()
}

setBloqueos(categoria: any): Promise<any>{
  console.log(`parametro: ${categoria}`)
  return this.firestore.collection('Bloqueos').add(categoria)
}

}



