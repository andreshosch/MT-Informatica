import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore: AngularFirestore) { }


  getUsers(): Observable<any> {
    return this.firestore.collection('Usuarios').snapshotChanges()
  }

  createUser(usuario: Usuario): Promise<any>{
    return this.firestore.collection('Usuarios').add(usuario)
    
  }


}
