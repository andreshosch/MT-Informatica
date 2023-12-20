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

}
