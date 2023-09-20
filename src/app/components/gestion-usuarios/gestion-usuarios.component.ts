import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';



@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {

usuariosRegistrados: any[] = []
usuariosEnEspera: any[] = []
// nuevoUsuario: Usuario


constructor(private _usuariosService: UsuariosService){

}

ngOnInit(){
  this.getUsuarios()
  this.getSolicitudes()
}


getSolicitudes() {
  this._usuariosService.getUsers().subscribe(doc => {
    this.usuariosRegistrados = []
    doc.forEach((element: any) => {
      this.usuariosRegistrados.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
  })
}

getUsuarios() {
  this._usuariosService.getSolicitudes().subscribe(doc => {
    this.usuariosEnEspera = []
    doc.forEach((element: any) => {
      this.usuariosEnEspera.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
  })
}

aceptarUsr(id:string){
    let posicion = 0
    for (let j=0; j < this.usuariosEnEspera.length; j++){
      if(this.usuariosEnEspera[j].id == id){
        posicion = j
        j = this.usuariosEnEspera.length
      }
    }
    const unUsuario: Usuario = {
      dni: this.usuariosEnEspera[posicion].dni,
      nombre: this.usuariosEnEspera[posicion].nombre,
      apellido: this.usuariosEnEspera[posicion].apellido,
      celular: this.usuariosEnEspera[posicion].celular,
      domicilio: this.usuariosEnEspera[posicion].domicilio,
      mail: this.usuariosEnEspera[posicion].mail,
      // cuit: this.usuariosEnEspera[posicion].cuit,
      password: this.usuariosEnEspera[posicion].password
    }
    this._usuariosService.createUser(unUsuario)
    console.log(`Se creo el usuario: ${JSON.stringify(unUsuario)}`)
    this._usuariosService.deleteSolicitudPorId(id)
    console.log(`Se borró el usuario: ${id}`)
    // this.sendWhatsapp("Cristian","TuHermana@hotmail.com")

}

eliminarSolicitudPorId(id:string){
  console.log(`Solicitud a eliminar: ${id}`)
  this._usuariosService.deleteSolicitudPorId(id)
}

eliminarUsrPorId(id: string){
  console.log(`Usuario a eliminar: ${id}`)
  this._usuariosService.deleteUsrPorId(id)
}


sendWhatsapp(name:string ,mail: string) {
  const accountSid = 'ACb1200a8e555e9b41c8ec2323345c9a71'; 
  const authToken = 'aaba967529c8b94c206edb89b15fb729'; 
  
  // client: this._unTwilio 
  // const client = new Twilio(accountSid, authToken)

  // client.messages
  //   .create({
  //       body: 'Your appointment is coming up on July 21 at 3PM',
  //       from: 'whatsapp:+14155238886',
  //       to: 'whatsapp:+5493425289170'
  //   })
  //   .then(message => console.log(message.sid))
    

    // const whatsAppOption={
    //     from:"whatsapp:+14155238886",
    //     to: "whatsapp:+5493425289170",
    //     body:`Ingreso pedido de Nombre: ${name} Mail: ${mail}`
    // }    
    // try {
    //   const info = client.messages.create(whatsAppOption);
    //   console.log(info);
    // }  catch(err) {
    //   console.log('error')
    // }
  }


}
