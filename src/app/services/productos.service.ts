import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
import { Observable, of } from 'rxjs';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Producto } from '../models/producto';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string
  private baseDolar: string
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
    this.baseUrl= environment.urlBase
    this.baseDolar= environment.urlDolar
        
  }

  getCotizacionActual():Observable<any>{
    return this.http.get(`${this.baseDolar}`)
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

deleteBloqueo(id: string): Promise<any> {
  return this.firestore.collection('Bloqueos').doc(id).delete();
}

setBloqueos(categoria: any): Promise<any>{
  console.log(`parametro: ${categoria}`)
  return this.firestore.collection('Bloqueos').add(categoria)
}

getApiElite(): Observable<any> {
  return this.firestore.collection('ApiElite').snapshotChanges()
}

setApiElite(valor: any): Promise<any>{
  return this.firestore.collection('ApiElite').add(valor)
}

updateApiElite(id: string, nuevoValor: any): Promise<any> {
  return this.firestore.collection('ApiElite').doc(id).update(nuevoValor);
}

}



