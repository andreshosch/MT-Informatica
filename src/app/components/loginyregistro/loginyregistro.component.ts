import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-loginyregistro',
  templateUrl: './loginyregistro.component.html',
  styleUrls: ['./loginyregistro.component.css']
})
export class LoginyregistroComponent {

  login: boolean = true
  listUsuario: Usuario[] = []

  constructor(private _usuarioService: UsuariosService){

  }

  ngOnInit(){
    // this.getUsuarios()
    // this.getSolicitudes()
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
        this.listUsuario.push(element)
      })
    })
    console.log(`Usuario: ${this.listUsuario}`)
  }

  getSolicitudes(){

  }

  creacion(){
    const unUsuario: Usuario = {
      dni: 29560756,
      nombre: "Cristian",
      apellido: "Alessandria",
      celular: 3425289289,
      domicilio: "Matacos 4242",
      mail: "cale@ssan.com",
    }

    this._usuarioService.createUser(unUsuario);
  }

}
