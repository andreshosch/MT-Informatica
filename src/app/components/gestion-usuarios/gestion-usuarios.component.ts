import { Component, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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



displayedColumns: string[] = ['nombre', 'apellido','dni','telefono','domicilio','mail','acciones'];
dataSource!: MatTableDataSource<any>;

// private paginator: MatPaginator; 
private sort: MatSort;

@ViewChild(MatSort) set matSort(ms: MatSort) {
  this.sort = ms;
  this.setDataSourceAttributes();
}

@ViewChild(MatPaginator) paginator: MatPaginator;
pageIndex = 0;
pageSize = 10;

// Método para manejar el cambio de página
onPaginateChange(event) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;

    // Calcular el índice de inicio y final de los elementos que se deben mostrar
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
  
    // Crear un nuevo array de elementos para la página actual
    const pageItems = this.usuariosRegistrados.slice(startIndex, endIndex);
  
    // Actualizar el dataSource con los elementos de la página actual
    this.dataSource.data = pageItems;

    // Actualizar el length del paginator con la longitud total del arreglo
    this.dataSource.paginator.length = this.usuariosRegistrados.length;
  
}

setDataSourceAttributes() {
this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;
}

constructor(private _usuariosService: UsuariosService, private _snackBar: MatSnackBar,private _liveAnnouncer: LiveAnnouncer){
  this.dataSource = new MatTableDataSource(this.usuariosRegistrados);
}

ngOnInit(){
  this.getUsuarios()
  this.getSolicitudes()

  this.dataSource = new MatTableDataSource(this.usuariosRegistrados);
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


}
