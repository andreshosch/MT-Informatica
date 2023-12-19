import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pedido } from 'src/app/models/pedido';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  total: number = 0;
  monto:number=0
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
  indicePedidoPendiente: number
  elementoActual: string
  ordenActual: 'asc' | 'desc' = 'asc';

  displayedColumns: string[] = ['fecha', 'dni', 'apellido', 'nombre', 'acciones'];
  dataSourcePedidosPendientes!: MatTableDataSource<any>;
  dataSourcePedidosEnCurso!: MatTableDataSource<any>;
  dataSourcePedidosEnTransporte!: MatTableDataSource<any>;
  dataSourcePedidosFinalizados!: MatTableDataSource<any>;
   private paginator: MatPaginator; 
  private sort: MatSort;

  // @ViewChild(MatSort) set matSort(ms: MatSort) {
  //   this.sort = ms;
  //   this.setDataSourceAttributes();
  // }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.paginator._intl.itemsPerPageLabel='Pedidos por Página'
    this.paginator._intl.firstPageLabel="Primera Página"
    this.paginator._intl.previousPageLabel="Página Anterior"
    this.paginator._intl.nextPageLabel='Siguiente Página'
    this.paginator._intl.lastPageLabel="Última Página"
  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;
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
  ordenarTabla(propiedad: string,dataSource:MatTableDataSource<any>) {
    this.ordenActual = this.ordenActual === 'asc' ? 'desc' : 'asc';
   dataSource.data = this.ordenarDatos(dataSource.data, propiedad, this.ordenActual);
  }

  applyFilter(event: Event, dataSource:MatTableDataSource<any>) {
    const filterValue = (event.target as HTMLInputElement).value;
   dataSource.filter = filterValue.trim().toLowerCase()
  }
  
  private ordenarDatos(datos: Pedido[], propiedad: string, orden: 'asc' | 'desc'): Pedido[] {
    
    return datos.sort((a, b) => {
      const valorA = a[propiedad];
      const valorB = b[propiedad];
  
      if (valorA < valorB) {
        return orden === 'asc' ? -1 : 1;
      } else if (valorA > valorB) {
        return orden === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  // setDataSourceAttributes() {
  //   this.dataSourcePedidosPendientes.paginator = this.paginator;
  //   this.dataSourcePedidosPendientes.sort = this.sort;
  //   this.dataSourcePedidosEnCurso.paginator = this.paginator;
  //   this.dataSourcePedidosEnCurso.sort = this.sort;
  //   this.dataSourcePedidosEnTransporte.paginator = this.paginator;
  //   this.dataSourcePedidosEnTransporte.sort = this.sort;
  //   this.dataSourcePedidosFinalizados.paginator = this.paginator;
  //   this.dataSourcePedidosFinalizados.sort = this.sort;
  // }

  constructor(private _gestionPedido: PedidosService, private _snackBar: MatSnackBar,private fb:FormBuilder, private firestore: AngularFirestore,private dataService: DataService, private cdr: ChangeDetectorRef) {
  
    this.formSeguimiento=this.fb.group({
      transporte:['',Validators.required],
      seguimiento:['',Validators.required],
    })
  
  }

  ngOnInit() {
    this.getPedidosPendientes()
    // this.dataSourcePedidosPendientes = new MatTableDataSource(this.pedidosPendientes);
    // this.dataSourcePedidosPendientes.sort = this.sort;
     this.getPedidosEnCurso()
    // this.dataSourcePedidosEnCurso = new MatTableDataSource(this.pedidosEncurso);
    // this.dataSourcePedidosEnCurso.sort = this.sort;
     this.getPedidosEnTransporte()
    // this.dataSourcePedidosEnTransporte = new MatTableDataSource(this.pedidosEnTransporte);
    // this.dataSourcePedidosEnTransporte.sort = this.sort;
     this.getPedidosFinalizados()
    // this.dataSourcePedidosFinalizados = new MatTableDataSource(this.pedidosFinalizados);
    // this.dataSourcePedidosFinalizados.sort = this.sort;
  }

  updateSeguimiento(id:string)
  {
      const unPedido={
      transporte: this.formSeguimiento.get('transporte').value,
      seguimiento: this.formSeguimiento.get('seguimiento').value,
    }
    console.log(unPedido)
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


    console.log(`id carro: ${JSON.stringify(this.pedidosPendientes[this.indicePedidoPendiente].id)}`)
    console.table(JSON.stringify(this.pedidosPendientes[this.indicePedidoPendiente]))
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
          this.deletePedidoPendienteId(id, coleccionOrigen)
        }).catch((error) => {
          console.error('Error al copiar el elemento:', error);
        });
      } else {
        console.error('El elemento no existe en la colección de origen');
      }
    });

  }

  envioTransporte(element:string){
    this.showSeguimiento=true
    console.log(element)
    this.elementoActual = element
    // this.AceptarPedido(this.elementoActual,'Pedidos En Curso','Pedidos En Transporte')
  }
cerrarSeguimiento(){
  this.showSeguimiento=false
}
  deletePedidoPendienteId(id: string, coleccion: string) {
    this._gestionPedido.deletePedidoPorId(id, coleccion)
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
  this.showTransporte=false
  this.showCodigoSeguimiento=false
}

showModalEnCurso(element:any){
  this.showSeguimiento=false
  this.showSuma=false
  this.showResta=false
  this.showActualizar=false
  this.showEliminar=false
  this.carritoHabilitado=true
  this.showTransporte=false
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
 this.showCodigoSeguimiento=true
 this.showTransporte=true
  this.pedido=element
}

hideCarrito(){
  this.carritoHabilitado=false
}
 sumarUno(idAgregar: string, posicion: number){

  console.log(`posicion: ${posicion}`)
  console.log(`IndicePedido: ${this.indicePedidoPendiente}`)

 this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad++
 this.monto=3
 }

restarUno(idQuitar: string, posicion: number){
  if(this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad > 1){
    this.pedidosPendientes[this.indicePedidoPendiente].carrito[posicion].addProducto.cantidad--;
  }
}

actualizarResumen(posicion: number){
  // this.dataService.productos$.subscribe(pedidos => {
    console.log(`valor parametro: ${posicion}`)
    this.pedidosAux = this.pedidosPendientes[posicion].carrito;
    console.log(`pedidos??: ${JSON.stringify(this.pedidosAux)}`)
    this.total = 0
    this.monto = 0
    for(let j=0; j < this.pedidosAux.length; j++){
      this.monto = this.monto + (parseInt(this.pedidosAux[j].addProducto.precio) * parseInt(this.pedidosAux[j].addProducto.cantidad))
      this.total = this.total + parseInt(this.pedidosAux[j].addProducto.cantidad)
    }
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

}
