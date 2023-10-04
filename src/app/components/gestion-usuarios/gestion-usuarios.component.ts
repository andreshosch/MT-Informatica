import { Component, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})

export class GestionUsuariosComponent {

usuariosRegistrados: any[] = []
usuariosEnEspera: any[] = []
showConfirmationDialogUsuario: boolean = false
showConfirmationDialogSolicitud: boolean = false
showConfirmationDialogModificacion: boolean = false
usuarioAEliminar: string = ""
solicitudAEliminar: string = ""
usuarioAModificar: Usuario
idUsuarioAModificar: string = ""
usuarioUpdate: Usuario

private paginator: MatPaginator; 
private sort: MatSort;

displayedColumns: string[] = ['nombre', 'apellido','dni','telefono','domicilio','mail','acciones'];
dataSource!: MatTableDataSource<any>;

constructor(private _usuariosService: UsuariosService, private _snackBar: MatSnackBar){
  this.dataSource = new MatTableDataSource(this.usuariosRegistrados);
}

ngOnInit(){
  this.getUsuarios()
  this.getSolicitudes()
}

@ViewChild(MatSort) set matSort(ms: MatSort) {
  this.sort = ms;
  this.setDataSourceAttributes();


}

@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
this.paginator = mp;
this.paginator._intl.itemsPerPageLabel='Clientes por Página'
this.paginator._intl.firstPageLabel="Primera Página"
this.paginator._intl.previousPageLabel="Página Anterior"
this.paginator._intl.nextPageLabel='Siguiente Página'
this.paginator._intl.lastPageLabel="Última Página"
this.setDataSourceAttributes();
}

setDataSourceAttributes() {
this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;
}

getSolicitudes() {
  this._usuariosService.getUsers().subscribe(doc => {
    this.usuariosRegistrados = []
    this.dataSource = new MatTableDataSource(this.usuariosRegistrados)
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

eliminarUsr(id_usr){
  this.showConfirmationDialogUsuario = true
  this.usuarioAEliminar = id_usr
}

eliminarSolicitud(id_usr){
  this.showConfirmationDialogSolicitud = true
  this.solicitudAEliminar = id_usr
}

cancel(){
  this.showConfirmationDialogUsuario = false
}

confirm(){
  this.eliminarUsrPorId(this.usuarioAEliminar)
  this.showConfirmationDialogUsuario=false
}

cancelSol(){
  this.showConfirmationDialogSolicitud = false
}

confirmSol(){
  this.eliminarSolicitudPorId(this.solicitudAEliminar)
  this.showConfirmationDialogSolicitud=false
}

blanquearClave(id){
  console.log(`id: ${id}`)
  this.showConfirmationDialogModificacion = true
  this.usuarioAModificar = id
  this.idUsuarioAModificar = id.id
  console.log(this.usuarioAModificar)
}

cancelUpdate(){
  this.showConfirmationDialogModificacion = false
}

confirmUpdate(){
  this.usuarioUpdate = {
    dni: this.usuarioAModificar.dni,
    nombre: this.usuarioAModificar.nombre,
    apellido: this.usuarioAModificar.apellido,
    domicilio: this.usuarioAModificar.domicilio,
    celular: this.usuarioAModificar.celular,
    mail: this.usuarioAModificar.mail,
    password: "MTInformatica1"
  }
  this._usuariosService.updateUsr(this.idUsuarioAModificar, this.usuarioUpdate)
  alert("Nueva clave de usuario: MTInformatica1")
  this.showConfirmationDialogModificacion = false
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
