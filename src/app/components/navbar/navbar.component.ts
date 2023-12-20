import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

import {MatIconModule} from '@angular/material/icon'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isAdmin: boolean;
  private subscription: Subscription

  ngOnInit(){
    this.usuarioLogueado()
  }

  constructor(private usuarioService: UsuariosService){
   this.subscription = this.usuarioService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin
    },
   )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  usuarioLogueado() {
    let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
    if (arregloLS) {
      const fechaActual = new Date()
      const fechaEnSegundos = fechaActual.getTime()
      const fechaAlmacenada = new Date(arregloLS[2])
      const fechaAlmDif = fechaAlmacenada.getTime()
      const tiempoLogin = Math.round((fechaEnSegundos - fechaAlmDif) / 1000)

      if (tiempoLogin < 3600) {
        this.isAdmin = (arregloLS[1] == "true")
      } else {
        this.isAdmin = false
      }

    }
  }

}
