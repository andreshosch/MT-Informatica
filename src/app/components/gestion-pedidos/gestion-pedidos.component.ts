import { Component, ViewChild } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pedido } from 'src/app/models/pedido';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css']
})
export class GestionPedidosComponent {

  pedidosPendientes:any[]=[]
  pedidosEncurso:any[]=[]
  pedidosEnTransporte:any[]=[]
  pedidosFinalizados:any[]=[]

  displayedColumns: string[] = ['fecha', 'dni', 'apellido', 'nombre', 'acciones'];
  dataSourcePedidosPendientes!: MatTableDataSource<any>;
  dataSourcePedidosEnCurso!: MatTableDataSource<any>;
  dataSourcePedidosEnTransporte!: MatTableDataSource<any>;
  dataSourcePedidosFinalizados!: MatTableDataSource<any>;
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

  setDataSourceAttributes() {
    this.dataSourcePedidosPendientes.paginator = this.paginator;
    this.dataSourcePedidosPendientes.sort = this.sort;
    this.dataSourcePedidosEnCurso.paginator = this.paginator;
    this.dataSourcePedidosEnCurso.sort = this.sort;
    this.dataSourcePedidosEnTransporte.paginator = this.paginator;
    this.dataSourcePedidosEnTransporte.sort = this.sort;
    this.dataSourcePedidosFinalizados.paginator = this.paginator;
    this.dataSourcePedidosFinalizados.sort = this.sort;
  }

  constructor(private _gestionPedido: PedidosService,private _snackBar: MatSnackBar,private firestore: AngularFirestore){  
}

ngOnInit(){
  this.getPedidosPendientes()
  this.dataSourcePedidosPendientes = new MatTableDataSource(this.pedidosPendientes);
  this.dataSourcePedidosPendientes.sort = this.sort;
  this.getPedidosEnCurso()
  this.dataSourcePedidosEnCurso = new MatTableDataSource(this.pedidosEncurso);
  this.dataSourcePedidosEnCurso.sort = this.sort;
  this.getPedidosEnTransporte()
  this.dataSourcePedidosEnTransporte = new MatTableDataSource(this.pedidosEnTransporte);
  this.dataSourcePedidosEnTransporte.sort = this.sort;
  this.getPedidosFinalizados()
  this.dataSourcePedidosFinalizados = new MatTableDataSource(this.pedidosFinalizados);
  this.dataSourcePedidosFinalizados.sort = this.sort;
}

getPedidosPendientes() {
  this._gestionPedido.getPedidos('Pedidos Pendientes').subscribe(doc => {
    this.pedidosPendientes = []
    this.dataSourcePedidosPendientes = new MatTableDataSource(this.pedidosPendientes)
    doc.forEach((element: any) => {
      this.pedidosPendientes.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
    console.log(this.pedidosPendientes)
  })
}

getPedidosEnCurso() {
  this._gestionPedido.getPedidos('Pedidos En Curso').subscribe(doc => {
    this.pedidosEncurso = []
    this.dataSourcePedidosEnCurso = new MatTableDataSource(this.pedidosEncurso)
    doc.forEach((element: any) => {
      this.pedidosEncurso.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
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
        ... element.payload.doc.data()
      })
    })
    console.log(this.pedidosEnTransporte)
  })
}

getPedidosFinalizados() {
  this._gestionPedido.getPedidos('Pedidos Finalizados').subscribe(doc => {
    this.pedidosFinalizados = []
    this.dataSourcePedidosFinalizados = new MatTableDataSource(this.pedidosFinalizados)
    doc.forEach((element: any) => {
      this.pedidosFinalizados.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
    console.log(this.pedidosFinalizados)
  })
}

AceptarPedido(id:string,coleccionOrigen:string,coleccionDestino:string){
 const pedido=this.firestore.collection(coleccionOrigen).doc(id);
 pedido.get().subscribe((snapshot) => {
  if (snapshot.exists) {
    // Datos del documento
    const datos = snapshot.data();

    // Crear una referencia al documento en la colección de destino
    const destinoDocRef = this.firestore.collection(coleccionDestino).doc(id);

    // Copiar los datos a la colección de destino
    destinoDocRef.set(datos).then(() => {
      console.log('Elemento copiado exitosamente');
      this.deletePedidoPendienteId(id,coleccionOrigen)
    }).catch((error) => {
      console.error('Error al copiar el elemento:', error);
    });
  } else {
    console.error('El elemento no existe en la colección de origen');
  }
});
 
}

deletePedidoPendienteId(id: string,coleccion:string){
  this._gestionPedido.deletePedidoPorId(id,coleccion)
}

}
