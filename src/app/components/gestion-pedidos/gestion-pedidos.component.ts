import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pedido } from 'src/app/models/pedido';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SppinerService } from 'src/app/services/sppiner.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { tr } from 'date-fns/locale';


@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css']
})
export class GestionPedidosComponent {

  pedidosPendientes: any[] = []
  pedidosEncurso: any[] = []
  pedidosEnTransporte: any[] = []
  pedidosFinalizados: any[] = []
  pedidosAux: any[] = []
  formSeguimiento:FormGroup
  formTransporte:FormGroup
  total: number = 0;
  monto:number=0
  montoIva = 0
  pedido:any
  carrito:any[]=[]
  carritoHabilitado: boolean = false
  showSuma:boolean=true
  showResta:boolean=true
  showEliminar:boolean=true
  showSeguimiento:boolean=false
  showTransporte:boolean=false
  showActualizar:boolean=true
  showCodigoSeguimiento:boolean=false
  showNombreTransporte:boolean=false
  indicePedidoPendiente: number
  elementoActual: string
  loading:boolean=true
  ordenActual: 'asc' | 'desc' | 'original' = 'asc';
  idAuxiliar: string = ""

  displayedColumns: string[] = ['fecha', 'dni', 'apellido', 'nombre', 'acciones'];
  dataSourcePedidosPendientes!: MatTableDataSource<any>;
  dataSourcePedidosEnCurso!: MatTableDataSource<any>;
  dataSourcePedidosEnTransporte!: MatTableDataSource<any>;
  dataSourcePedidosFinalizados!: MatTableDataSource<any>;
   private paginator: MatPaginator; 
  numeroClics: number=0;
  sinModificaciones: boolean = true
  showConfirmationDelPedido: boolean = false
  coleccionAuxiliar: string = ""
    
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.paginator._intl.itemsPerPageLabel='Pedidos por Página'
    this.paginator._intl.firstPageLabel="Primera Página"
    this.paginator._intl.previousPageLabel="Página Anterior"
    this.paginator._intl.nextPageLabel='Siguiente Página'
    this.paginator._intl.lastPageLabel="Última Página"
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
    const pageItemsPendientes = this.pedidosPendientes.slice(startIndex, endIndex);
    const pageItemsEnCurso = this.pedidosEncurso.slice(startIndex, endIndex);
    const pageItemsTransporte = this.pedidosEnTransporte.slice(startIndex, endIndex);
    const pageItemsFinalizados = this.pedidosFinalizados.slice(startIndex, endIndex);

    // Actualizar el dataSource con los elementos de la página actual
    this.dataSourcePedidosPendientes.data = pageItemsPendientes;
    this.dataSourcePedidosEnCurso.data = pageItemsEnCurso;
    this.dataSourcePedidosEnTransporte.data = pageItemsTransporte;
    this.dataSourcePedidosFinalizados.data = pageItemsFinalizados;

    // Actualizar el length del paginator con la longitud total del arreglo
    this.dataSourcePedidosPendientes.paginator.length = this.pedidosPendientes.length;
    this.dataSourcePedidosEnCurso.paginator.length = this.pedidosEncurso.length;
    this.dataSourcePedidosEnTransporte.paginator.length = this.pedidosEnTransporte.length;
    this.dataSourcePedidosFinalizados.paginator.length = this.pedidosFinalizados.length;
  }
  ordenarTabla(propiedad: string, dataSource: MatTableDataSource<any>) {
    this.numeroClics++;
  if (this.numeroClics > 2) {
    this.ordenActual = 'original';
    this.numeroClics = 0; // Reiniciar el contador
  } else {
    this.ordenActual = this.ordenActual === 'desc' ? 'asc' : 'desc';
  }
  dataSource.data = this.ordenarDatos(dataSource.data, propiedad, this.ordenActual);
  }

  private ordenarDatos(datos: Pedido[], propiedad: string, orden: 'asc' | 'desc' | 'original'): Pedido[] {
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

  
  applyFilter(event: Event, dataSource:MatTableDataSource<any>) {
    const filterValue = (event.target as HTMLInputElement).value;
   dataSource.filter = filterValue.trim().toLowerCase()
  }
  
  constructor(private _gestionPedido: PedidosService,private fb:FormBuilder, private firestore: AngularFirestore, private cdr: ChangeDetectorRef, public _spinner:SppinerService, private _mensaje:MensajeService) {
  
    this.formSeguimiento=this.fb.group({
      seguimiento:['',Validators.required],
    })
    this.formTransporte=this.fb.group({
      transporte:['',Validators.required],
    })
  }

  ngOnInit() {
    this._spinner.showSpinner()
     this.getPedidosPendientes()
     this.getPedidosEnCurso()
     this.getPedidosEnTransporte()
     this.getPedidosFinalizados()
  }

  updateSeguimiento()
  {
    this.showSeguimiento=false
      const unPedido={
      seguimiento: this.formSeguimiento.get('seguimiento').value,
    }
    this._gestionPedido.updatePedido(this.elementoActual,'Pedidos En Transporte',unPedido)
    this._mensaje.snackBar('Se ha actualizado el nro de seguimiento','green')
    this.cerrarSeguimiento()
  }

  updateTransporte()
  {
      this.showTransporte=false
      const unPedido={
      transporte: this.formTransporte.get('transporte').value,
    }
    this._gestionPedido.updatePedido(this.elementoActual,'Pedidos En Curso',unPedido)
  }
  
  getPedidosPendientes() {
    this._gestionPedido.getPedidos('Pedidos Pendientes').subscribe(doc => {
      this.pedidosPendientes = []
      this.dataSourcePedidosPendientes = new MatTableDataSource(this.pedidosPendientes)
      doc.forEach((element: any) => {
        this.pedidosPendientes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  getPedidosEnCurso() {
    this._gestionPedido.getPedidos('Pedidos En Curso').subscribe(doc => {
      this.pedidosEncurso = []
      this.dataSourcePedidosEnCurso = new MatTableDataSource(this.pedidosEncurso)
      doc.forEach((element: any) => {
        this.pedidosEncurso.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  getPedidosEnTransporte() {
    this._gestionPedido.getPedidos('Pedidos En Transporte').subscribe(doc => {
      this.pedidosEnTransporte = []
      this.dataSourcePedidosEnTransporte = new MatTableDataSource(this.pedidosEnTransporte)
      doc.forEach((element: any) => {
        this.pedidosEnTransporte.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  actualizarPedido(){
    this._gestionPedido.updatePedido(this.pedidosPendientes[this.indicePedidoPendiente].id, 'Pedidos Pendientes',this.pedidosPendientes[this.indicePedidoPendiente])
    this._mensaje.snackBar('Pedido actualizado correctamente','green')

    // console.log(`id carro: ${JSON.stringify(this.pedidosPendientes[this.indicePedidoPendiente].id)}`)
    // console.table(JSON.stringify(this.pedidosPendientes[this.indicePedidoPendiente]))
  }

  getPedidosFinalizados() {
    this._gestionPedido.getPedidos('Pedidos Finalizados').subscribe(doc => {
      this.pedidosFinalizados = []
      this.dataSourcePedidosFinalizados = new MatTableDataSource(this.pedidosFinalizados)
      doc.forEach((element: any) => {
        this.pedidosFinalizados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  AceptarPedido(id: string, coleccionOrigen: string, coleccionDestino: string) {
    const pedido = this.firestore.collection(coleccionOrigen).doc(id);
    pedido.get().subscribe((snapshot) => {
      if (snapshot.exists) {
        // Datos del documento
        const datos = snapshot.data();

        // Crear una referencia al documento en la colección de destino
        const destinoDocRef = this.firestore.collection(coleccionDestino).doc(id);

        // Copiar los datos a la colección de destino
        destinoDocRef.set(datos).then(() => {
          console.log('Elemento copiado exitosamente');
          this.moverPedido(id, coleccionOrigen)
          this.confirmDel()
        }).catch((error) => {
          console.error('Error al copiar el elemento:', error);
        });
      } else {
        console.error('El elemento no existe en la colección de origen');
      }
    });
     switch(coleccionDestino)
     {
      case 'Pedidos En Curso':
        this._mensaje.snackBar('El Pedido se encuentra en curso ','green')
        break;
        case 'Pedidos En Transporte':
          this._mensaje.snackBar('El Pedido se encuentra en Transporte ','green')
          break;
          case 'Pedidos Finalizados':
          this._mensaje.snackBar('El Pedido ha finalizado ','green')
          break;
     }
  }

  envioTransporte(element:string){
    this.showTransporte=true
    this.elementoActual = element
    // this.AceptarPedido(this.elementoActual,'Pedidos En Curso','Pedidos En Transporte')
  }

  envioSeguimiento(element:string){
    this.showSeguimiento=true
    this.elementoActual = element
    // this.AceptarPedido(this.elementoActual,'Pedidos En Curso','Pedidos En Transporte')
  }

cerrarSeguimiento(){
  this.formSeguimiento.patchValue({
    seguimiento:''
  })
  this.formSeguimiento.markAsPristine();
  this.formSeguimiento.markAsUntouched();
  this.showSeguimiento=false
}

cerrarTransporte(){
  this.formTransporte.patchValue({
    transporte:''
  })
  this.formTransporte.markAsPristine();
  this.formTransporte.markAsUntouched();
  this.showTransporte=false
}

cleanTransporte(){
    this.formTransporte.patchValue({
      transporte:''
    })
    this.formTransporte.markAsPristine();
    this.formTransporte.markAsUntouched(); 
  }

  moverPedido(id: string, coleccion: string) {
    this.idAuxiliar = id
    this.coleccionAuxiliar = coleccion
  }
  deletePedidoPendienteId(id: string, coleccion: string) {
    this.showConfirmationDelPedido = true
    this.idAuxiliar = id
    this.coleccionAuxiliar = coleccion
  }

showModalPendientes(element:any, mindice: number, estado: string){
  console.log(`index: ${mindice}`)
  this.indicePedidoPendiente = mindice
  this.carritoHabilitado=true
  this.showActualizar=true
  this.showEliminar=true
  this.showResta=true
  this.showSuma=true
  this.pedido=element
  this.showNombreTransporte=false
  this.showCodigoSeguimiento=false
}

showModalEnCurso(element:any){
  this.showSeguimiento=false
  this.showSuma=false
  this.showResta=false
  this.showActualizar=false
  this.showEliminar=false
  this.carritoHabilitado=true
  this.showNombreTransporte=false
  this.showCodigoSeguimiento=false
  this.pedido=element
}

showModalTransporteyFinalizado(element:any){
  this.showSeguimiento=false
  this.showSuma=false
  this.showResta=false
  this.showActualizar=false
  this.showEliminar=false
  this.carritoHabilitado=true
  this.showActualizar=false
  this.pedido=element
  if(this.pedido?.transporte)
  {
    this.showNombreTransporte=true
  }
  else{
this.showNombreTransporte=false
  }

  if(this.pedido?.seguimiento)
  {
    this.showCodigoSeguimiento=true
  }
  else{
this.showCodigoSeguimiento=false
  }
}

hideCarrito(){
  this.sinModificaciones = true
  this.carritoHabilitado=false
}
 sumarUno(idAgregar: string, posicion: number){
  this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad++
  this.sinModificaciones = false
 }

restarUno(idQuitar: string, posicion: number){
  if(this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad > 1){
    this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad--;
    this.sinModificaciones = false
  }
}

actualizarResumen(posicion: number,coleccion:any){
  // this.dataService.productos$.subscribe(pedidos => {
    // console.log(`valor parametro: ${posicion}`)
    this.pedidosAux =coleccion[posicion].carrito;
    // console.log(`pedidos??: ${JSON.stringify(this.pedidosAux)}`)
    this.total = 0
    this.monto = 0
    this.montoIva = 0
    for(let j=0; j < this.pedidosAux.length; j++){
      this.monto = this.monto + (parseFloat(this.pedidosAux[j].addProducto.precio) * parseInt(this.pedidosAux[j].addProducto.cantidad))
      this.total =(this.total + parseInt(this.pedidosAux[j].addProducto.cantidad))
      this.montoIva = this.montoIva + (parseFloat(this.pedidosAux[j].addProducto.precio) * parseInt(this.pedidosAux[j].addProducto.cantidad) * (1 + parseFloat(this.pedidosAux[j].addProducto.iva) / 100))
    }
    console.log(`montoIva = ${this.montoIva}`)
  // });
}


quitarProd(i: number){
  
  if ((this.pedidosPendientes[this.indicePedidoPendiente].carrito.length) === 1){
    alert('Debe eliminar el carrito')
  }else{
       
    this.pedidosPendientes[this.indicePedidoPendiente].carrito.splice(i,1)   
    this._gestionPedido.updatePedido(this.pedidosPendientes[this.indicePedidoPendiente].id, 'Pedidos Pendientes',this.pedidosPendientes[this.indicePedidoPendiente])
    this.cdr.detectChanges();
    this.carritoHabilitado=false
    this.showModalPendientes(this.pedidosPendientes[this.indicePedidoPendiente],this.indicePedidoPendiente,'hola')
  }
}

cancelDel(){
  this.showConfirmationDelPedido = false
}

confirmDel(){
  this._gestionPedido.deletePedidoPorId(this.idAuxiliar, this.coleccionAuxiliar)
  this.idAuxiliar = ""
  this.coleccionAuxiliar = ""
  this.showConfirmationDelPedido = false
}

}
