import { Component, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SppinerService } from 'src/app/services/sppiner.service';

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
  mostrarFicha: boolean = false
  fichaDetalle: Usuario
  ordenActual: 'asc' | 'desc' | 'original' = 'asc';
  showSolicitudPendiente:boolean=false



  // displayedColumns: string[] = ['nombre','apellido','dni','telefono','domicilio','mail','provincia','localidad','codigoPostal','estadoFiscal','observaciones','acciones'];
  displayedColumns: string[] = ['nombre', 'apellido', 'dni', 'telefono', 'estadoFiscal', 'acciones'];
  dataSourceUsuarios!: MatTableDataSource<any>;
  private paginator: MatPaginator;
  numeroClics: number=0;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por Página'
    this.paginator._intl.firstPageLabel = "Primera Página"
    this.paginator._intl.previousPageLabel = "Página Anterior"
    this.paginator._intl.nextPageLabel = 'Siguiente Página'
    this.paginator._intl.lastPageLabel = "Última Página"
  }

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
    this.dataSourceUsuarios.data = pageItems;

    // Actualizar el length del paginator con la longitud total del arreglo
    this.dataSourceUsuarios.paginator.length = this.usuariosRegistrados.length;
  }

  ordenarTabla(propiedad: string) {
    this.numeroClics++;
    if (this.numeroClics > 2) {
      this.ordenActual = 'original';
      this.numeroClics = 0; // Reiniciar el contador
    } else {
      this.ordenActual = this.ordenActual === 'desc' ? 'asc' : 'desc';
    }
    this.dataSourceUsuarios.data = this.ordenarDatos(this.dataSourceUsuarios.data, propiedad, this.ordenActual);
  }

  private ordenarDatos(datos: Usuario[], propiedad: string, orden: 'asc' | 'desc' | 'original'): Usuario[] {
    if (orden === 'original') {
      // Devolver una copia de los datos originales (para no modificar el array original)
      return datos.sort(() => Math.random() - 0.5);
    }

    return datos.sort((a, b) => {
      const valorA = a[propiedad];
      const valorB = b[propiedad];

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        // Comparar números de manera directa
        return orden === 'asc' ? valorA - valorB : valorB - valorA;
      } else if (typeof valorA === 'string' && typeof valorB === 'string') {
        // Comparar cadenas utilizando localeCompare
        return orden === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
      } else {
        // Comparar otros tipos (o valores iguales) para mantener el orden original
        return 0;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsuarios.filter = filterValue.trim().toLowerCase()
  }

  constructor(private _usuariosService: UsuariosService, private _snackBar: MatSnackBar, private _liveAnnouncer: LiveAnnouncer,public _spinner:SppinerService) {
    this.dataSourceUsuarios = new MatTableDataSource(this.usuariosRegistrados);
  }

  ngOnInit() {
    this._spinner.showSpinner()
    this.getUsuarios()
    this.getSolicitudes()
  }

  getSolicitudes() {
    this._usuariosService.getUsers().subscribe(doc => {
      this.usuariosRegistrados = []
      this.dataSourceUsuarios = new MatTableDataSource(this.usuariosRegistrados)
      doc.forEach((element: any) => {
        this.usuariosRegistrados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
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
          ...element.payload.doc.data()
        })
      })
      console.log(this.usuariosEnEspera)
      if (this.usuariosEnEspera.length>0)
    {
      this.showSolicitudPendiente=true
    }
      else{
        this.showSolicitudPendiente=false
      }
    })
  
    
    }
  
  aceptarUsr(id: string) {
    let posicion = 0
    for (let j = 0; j < this.usuariosEnEspera.length; j++) {
      if (this.usuariosEnEspera[j].id == id) {
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
      password: this.usuariosEnEspera[posicion].password,
      provincia: this.usuariosEnEspera[posicion].provincia,
      localidad: this.usuariosEnEspera[posicion].localidad,
      codigoPostal: this.usuariosEnEspera[posicion].codigoPostal,
      observaciones: this.usuariosEnEspera[posicion].observaciones,
      estadoFiscal: this.usuariosEnEspera[posicion].estadoFiscal,
    }
    this._usuariosService.createUser(unUsuario)
    console.log(`Se creo el usuario: ${JSON.stringify(unUsuario)}`)
    console.log(unUsuario.celular)
    window.open(`https://api.whatsapp.com/send?phone=${unUsuario.celular}`);
    this._usuariosService.deleteSolicitudPorId(id)
    console.log(`Se borró el usuario: ${id}`)

  }

  eliminarSolicitudPorId(id: string) {
    console.log(`Solicitud a eliminar: ${id}`)
    this._usuariosService.deleteSolicitudPorId(id)
  }

  eliminarUsrPorId(id: string) {
    console.log(`Usuario a eliminar: ${id}`)
    this._usuariosService.deleteUsrPorId(id)
  }

  eliminarUsr(id_usr) {
    this.showConfirmationDialogUsuario = true
    this.usuarioAEliminar = id_usr
  }

  eliminarSolicitud(id_usr) {
    this.showConfirmationDialogSolicitud = true
    this.solicitudAEliminar = id_usr
  }

  cancel() {
    this.showConfirmationDialogUsuario = false
  }

  confirm() {
    this.eliminarUsrPorId(this.usuarioAEliminar)
    this.showConfirmationDialogUsuario = false
  }

  cancelSol() {
    this.showConfirmationDialogSolicitud = false
  }

  confirmSol() {
    this.eliminarSolicitudPorId(this.solicitudAEliminar)
    this.showConfirmationDialogSolicitud = false
  }

  blanquearClave(id) {
    console.log(`id: ${id}`)
    this.showConfirmationDialogModificacion = true
    this.usuarioAModificar = id
    this.idUsuarioAModificar = id.id
    console.log(this.usuarioAModificar)
  }

  cancelUpdate() {
    this.showConfirmationDialogModificacion = false
  }

  confirmUpdate() {
    this.usuarioUpdate = {
      dni: this.usuarioAModificar.dni,
      nombre: this.usuarioAModificar.nombre,
      apellido: this.usuarioAModificar.apellido,
      domicilio: this.usuarioAModificar.domicilio,
      celular: this.usuarioAModificar.celular,
      mail: this.usuarioAModificar.mail,
      password: "MTInformatica1",
      provincia: this.usuarioAModificar.provincia,
      localidad: this.usuarioAModificar.localidad,
      codigoPostal: this.usuarioAModificar.codigoPostal,
      observaciones: this.usuarioAModificar.observaciones,
      estadoFiscal: this.usuarioAModificar.estadoFiscal,
    }
    this._usuariosService.updateUsr(this.idUsuarioAModificar, this.usuarioUpdate)
    alert("Nueva clave de usuario: MTInformatica1")
    this.showConfirmationDialogModificacion = false
  }

  verFicha(usuario: any) {
    this.fichaDetalle = usuario
    this.mostrarFicha = true
    console.log(`este: ${JSON.stringify(usuario)}`)
  }

  cancelFicha() {
    this.mostrarFicha = false
  }

}
