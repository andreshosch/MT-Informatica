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

  deletePago(id: string): Promise<any> {
    return this.firestore.collection('tablaPagos').doc(id).delete();
  }

  updatePago(id: string, pago: any): Promise<any> {
    return this.firestore.collection('tablaPagos').doc(id).update(pago);
  }

  createIva(monto: any): Promise<any>{
    console.log('llegue')
    return this.firestore.collection('tablaIva').add(monto)

  }

  getIva(): Observable<any> {
    return this.firestore.collection('tablaIva').snapshotChanges()
  }

  deleteIva(id: string): Promise<any> {
    return this.firestore.collection('tablaIva').doc(id).delete();
  }

}

