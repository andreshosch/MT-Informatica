import { Component, Input, SimpleChanges } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Pedido } from 'src/app/models/pedido';
import { format } from 'date-fns';
import {MensajeService} from 'src/app/services/mensaje.service'


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  productos: any[] = [];
  total: number = 0
  monto: number = 0
  fechaActual: Date = new Date()

  @Input() usuario: number
  @Input() nombre: string
  @Input() apellido: string
  @Input() celular: number

  //Inicio Carrito
  carritoHabilitado: boolean = false
  carritoVacio: boolean = false
  //Fin Carrito

  constructor(private dataService: DataService, private pedidosService: PedidosService, private _mensaje:MensajeService) {

  }

  ngOnInit() {
    let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
    let usuarioLog: any = arregloLS[0]
    this.carritoGuardado(usuarioLog)
  }

  guardarPedido() {
    console.table(this.productos)
  }

  carritoGuardado(carroUsr: any) {
    let elCarrito = JSON.parse(localStorage.getItem(carroUsr));
    if (elCarrito) {
      const fechaActual = new Date()
      const fechaEnSegundos = fechaActual.getTime()
      const fechaAlmacenada = new Date(elCarrito[1])
      const fechaAlmDif = fechaAlmacenada.getTime()
      const tiempoLogin = Math.round((fechaEnSegundos - fechaAlmDif) / 1000)

      if (tiempoLogin < 3600) {
        this.dataService.actualizarCart(elCarrito[0], carroUsr)
      } else {
        this.quitarCarro(carroUsr)
      }
    }
    this.productos = [];
    this.total = 0
    this.monto = 0
    this.actualizarResumen()
  }

  quitarCarro(carroUsr: any) {
    localStorage.removeItem(carroUsr);
  }

  //Inicio sección Carrito
  verCarrito() {
    if (this.productos.length > 0){
      this.carritoHabilitado = true
      this.actualizarResumen()
    }else{
      this.carritoVacio = true
    } 
  }

  cerrarAviso(){
    this.carritoVacio = false
  }

  ocultarCarrito() {
    this.carritoHabilitado = false
  }

  quitarProd(quitarElem: string) {
    const index = this.productos.findIndex(obj => obj.addProducto.id === quitarElem)
    this.productos[index].addProducto.cantidad=1;
    this.productos.splice(index, 1)
    this.actualizarResumen()
    this.dataService.actualizarCart(this.productos, this.usuario)
    if(this.productos.length === 0){
      this.carritoHabilitado = false
      this.carritoVacio = true
    }
  }


  sumarUno(idAgregar: string) {
    for (let j = 0; j < this.productos.length; j++) {
      if (this.productos[j].addProducto.id === idAgregar) {
        this.productos[j].addProducto.cantidad++;
        this.actualizarResumen()
        j = this.productos.length
      }
    }
  }

  restarUno(idQuitar: string) {
    for (let j = 0; j < this.productos.length; j++) {
      if (this.productos[j].addProducto.id === idQuitar) {
        if (this.productos[j].addProducto.cantidad > 1) {
          this.productos[j].addProducto.cantidad--;
          this.actualizarResumen()
        }
        j = this.productos.length
      }
    }
  }

  actualizarResumen() {
    this.dataService.productos$.subscribe(productos => {
      this.productos = productos;
      this.total = 0
      this.monto = 0
      for (let j = 0; j < this.productos.length; j++) {
        this.monto = this.monto + (parseInt(productos[j].addProducto.precio) * parseInt(productos[j].addProducto.cantidad))
        this.total = this.total + parseInt(productos[j].addProducto.cantidad)
      }
    });
  }

  mostrarCarrito() {
    let userActual: any = this.usuario
    console.log(`usuario: ${userActual}`)
    let unPedido: Pedido = {
      carrito: this.productos,
      idUser: this.usuario,
      fecha: this.formatFecha(),
      nombre: this.nombre,
      apellido: this.apellido,
      celular: this.celular
    }
    console.log(unPedido)
    this.pedidosService.createPedido(unPedido, 'Pedidos Pendientes')
    this.productos = []
    this.total = 0
    this.monto = 0
     this._mensaje.snackBar("Carrito creado correctamente",'green')
    this.dataService.limpiar()
    this.ocultarCarrito();
    localStorage.removeItem(userActual);
  }

  formatFecha() {
    return format(this.fechaActual, 'dd/MM/yyyy - HH:mm');
  }
  }

