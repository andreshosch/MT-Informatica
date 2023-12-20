import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore: AngularFirestore) { }

  isAdmin: boolean = false


  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  setAdminStatus(isAdmin: boolean) {
    this.isAdminSubject.next(isAdmin)
  }

  getAdminStatus() {
    return this.isAdminSubject.value
  }

  getUsers(): Observable<any> {
    return this.firestore.collection('Usuarios').snapshotChanges()
  }

  createUser(usuario: Usuario): Promise<any>{
    return this.firestore.collection('Usuarios').add(usuario)
    
  }


  getSolicitudes(): Observable<any> {
    return this.firestore.collection('Solicitudes').snapshotChanges()
  }

  createSolicitud(usuario: Usuario): Promise<any>{
    return this.firestore.collection('Solicitudes').add(usuario)
    
  }

  deleteSolicitudPorId(id: string): Promise<any> {
    return this.firestore.collection('Solicitudes').doc(id).delete();
  }

  deleteUsrPorId(id: string): Promise<any> {
    return this.firestore.collection('Usuarios').doc(id).delete();
  }

  getSolicitudesById(id:string): Observable<any> {
    return this.firestore.collection('Solicitudes').doc(id).valueChanges()
  }

  updateUsr(id: string, usuario: any): Promise<any> {
    return this.firestore.collection('Usuarios').doc(id).update(usuario);
  }

 


}
