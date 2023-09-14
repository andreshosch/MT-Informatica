import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  usrAdmin: boolean = true
  loginProgress: boolean = false
  login: boolean = true
  listUsuario: Usuario[] = []
  loginUsr: FormGroup
  formRegistro: FormGroup
  usuario: number;
  contrasena: string;

  ngOnInit(){
    this.getUsuarios()
    // this.getSolicitudes()
  }

  constructor(private _usuarioService: UsuariosService, private fb: FormBuilder){
    this.loginUsr = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    })
  }

  getUsuarios(){
    this._usuarioService.getUsers().subscribe(doc => {
      this.listUsuario = []
      doc.forEach((element: any) => {
        // this.listUsuario.push(element)
        this.listUsuario.push({
          id: element.payload.doc.id,
          ... element.payload.doc.data()
        })
      })
    }) 
  }

  ingresoUsr(){
    this.usuario = this.loginUsr.get('usuario').value
    this.contrasena = this.loginUsr.get('contrasena').value
    console.log(`Usuario: ${this.usuario}`)
    console.log(`Contraseña: ${this.contrasena}`)
    for (let j=0; j < this.listUsuario.length; j++){
      console.log(`Usuario en J: ${this.listUsuario[j].dni}`)
      console.log(`Contraseña en J : ${this.listUsuario[j].password}`)
      if(this.listUsuario[j].dni == this.usuario){
        if(this.listUsuario[j].password === this.contrasena){
          console.log('Ingresaste correctamente')
          this.loginProgress = false
        }else{
          console.log('Error en ingreso')
        }
      }
    }
  }

  habilitarLogin(){
    this.loginProgress = true
  }

  cerrarLogin(){
    this.loginProgress = false
  }

  irALogin(){
    this.login=true
  }

  irARegistro(){
    this.login=false
  }

}
