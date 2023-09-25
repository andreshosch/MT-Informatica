import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

import {MatIconModule} from '@angular/material/icon'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // usrAdmin: boolean = false
  // loginProgress: boolean = false
  // login: boolean = true
  // hayUsuario: boolean = false
  // listUsuario: Usuario[] = []
  // usuariosRegistrados: Usuario[] = []
  // loginUsr: FormGroup
  // formRegistro: FormGroup
  // usuario: number;
  // contrasena: string;

  ngOnInit(){
    // this.getUsuarios()
    // this.getSolicitudes()
  }

  // constructor(private _usuarioService: UsuariosService, private fb: FormBuilder){
  //   this.loginUsr = this.fb.group({
  //     usuario: ['', Validators.required],
  //     contrasena: ['', Validators.required],
  //   })

  //   this.formRegistro = this.fb.group({
  //     nombre: ['', Validators.required],
  //     contrasena: ['', Validators.required],
  //     mail: ['', Validators.required],
  //     telefono: ['', Validators.required],
  //     dni: ['', Validators.required],
  //     domicilio: ['', Validators.required],
  //     apellido: ['', Validators.required],
  //   })
  // }

  // getUsuarios(){
  //   this._usuarioService.getUsers().subscribe(doc => {
  //     this.listUsuario = []
  //     doc.forEach((element: any) => {
  //       // this.listUsuario.push(element)
  //       this.listUsuario.push({
  //         id: element.payload.doc.id,
  //         ... element.payload.doc.data()
  //       })
  //     })
  //   }) 
  // }

  // getSolicitudes() {
  //   this._usuarioService.getSolicitudes().subscribe(doc => {
  //     this.usuariosRegistrados = []
  //     doc.forEach((element: any) => {
  //       this.usuariosRegistrados.push({
  //         id: element.payload.doc.id,
  //         ... element.payload.doc.data()
  //       })
  //     })
  //   })
  // }

  // ingresoUsr(){
  //   this.usuario = this.loginUsr.get('usuario').value
  //   this.contrasena = this.loginUsr.get('contrasena').value
  //   for (let j=0; j < this.listUsuario.length; j++){
  //     if(this.listUsuario[j].dni == this.usuario){
  //       if(this.listUsuario[j].password === this.contrasena){
  //         console.log('Ingresaste correctamente')
  //         this.hayUsuario = true
  //         //reemplazar por los DNI de Mariano u Natalia
  //         if((this.usuario == 29560560)||(this.usuario == 29560560)){
  //           this.usrAdmin = true
  //         }
  //         this.loginProgress = false
  //         this.loginUsr.reset()
  //       }else{
  //         console.log('Error en ingreso')
  //       }
  //     }
  //   }
  // }

  // habilitarLogin(){
  //   this.loginProgress = true
  // }

  // desloguear(){
  //   this.hayUsuario=false
  //   this.usrAdmin=false
  // }

  // cerrarLogin(){
  //   this.loginProgress = false
  // }

  // irALogin(){
  //   this.login=true
  // }

  // irARegistro(){
  //   this.login=false
  // }
  
  
  // solicitarAlta(){
  //   let dniSolicitud = this.formRegistro.get('dni').value;
  //   let resultado = "x"
  //   //Chequeamos si es un usuario registrado
  //   for (let j=0; j < this.listUsuario.length; j++){
  //     if(this.listUsuario[j].dni == dniSolicitud){
  //       resultado = "El DNI ya está asociado a un cliente"
  //       j = this.listUsuario.length
  //     }
  //   }
  //   //Chequeamos si existe una solicitud pendiente con ese DNI
  //   if (resultado === "x"){
  //     for (let j=0; j < this.usuariosRegistrados.length; j++){
  //       if(this.usuariosRegistrados[j].dni == dniSolicitud){
  //         resultado = "Ya existe una solicitud pendiente con este DNI"
  //         j = this.usuariosRegistrados.length
  //       }
  //     }
  //   }

  //   if(resultado === "x"){
  //     const unaSolicitud: Usuario = {
  //       nombre: this.formRegistro.get('nombre').value,
  //       apellido: this.formRegistro.get('apellido').value,
  //       dni: this.formRegistro.get('dni').value,
  //       celular: this.formRegistro.get('telefono').value,
  //       mail: this.formRegistro.get('mail').value,
  //       domicilio: this.formRegistro.get('domicilio').value,
  //       password: this.formRegistro.get('contrasena').value,
  //     }
      
  //     console.log(`Creando una nueva solicitud ${JSON.stringify(unaSolicitud)}`)
  //     this._usuarioService.createSolicitud(unaSolicitud)
  //     this.formRegistro.reset()
  //     //enviar mensaje de exito de solicitud
  //     this.loginProgress=false
  //     this.login=true
  //   } else{
  //     //Dar aviso correspondiente por falla
  //     console.log(resultado)
  //   }

  // }
}
