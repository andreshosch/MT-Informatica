import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loginyregistro',
  templateUrl: './loginyregistro.component.html',
  styleUrls: ['./loginyregistro.component.css']
})
export class LoginyregistroComponent {

  login: boolean = true
  listUsuario: Usuario[] = []
  formRegistro: FormGroup
  loginUsr: FormGroup
  loginProgress: boolean = true;

  constructor(private _usuarioService: UsuariosService, private fb:FormBuilder){
    this.formRegistro = this.fb.group({
      nombre:['',Validators.required],
      apellido:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required],
      dni:['',Validators.required],      
      cuit:['',Validators.required],  
      domicilio:['',Validators.required],
      telefono:['',Validators.required],
    })

  }

  ngOnInit(){
    this.getUsuarios()
    // this.getSolicitudes()
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
      
      for(let j=0; j< this.listUsuario.length; j++){
        console.log(`Usuario: ${this.listUsuario[j].mail}`)
        console.log(`Pass: ${this.listUsuario[j].password}`)
      }
    })
    
  }

  getSolicitudes(){

  }

  creacion(){
    console.log('Ingresando')
    const unUsuario: Usuario = {
      dni: 29560560,
      nombre: "Cristian",
      apellido: "Alex",
      celular: 3425289289,
      domicilio: "Japon 224",
      mail: "cale@ssan.com",
      password: "Tomate12"
    }

    this._usuarioService.createUser(unUsuario);
  }

  creacion2(){
    console.log('creacion 2')
    const unUsuario: Usuario = {
      dni: 11057648,
      nombre: "Andy",
      apellido: "Summer",
      celular: 3426348751,
      domicilio: "Narnia 900",
      mail: "andy@gmail.com",
      password: "destino2023"
    }

    this._usuarioService.createSolicitud(unUsuario);
  }

  solicitarAlta(){

  }

}
