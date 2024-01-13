import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private firestore: AngularFirestore) { }


  getPagos(): Observable<any> {
    return this.firestore.collection('tablaPagos').snapshotChanges()
  }

  createPagos(pago: any): Promise<any>{
    return this.firestore.collection('tablaPagos').add(pago)
    
  }


}

