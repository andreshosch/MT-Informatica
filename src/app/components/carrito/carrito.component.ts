import { Component, Input, SimpleChanges } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Pedido } from 'src/app/models/pedido';
import { format } from 'date-fns';
import {MensajeService} from 'src/app/services/mensaje.service'
import { PagosService } from 'src/app/services/pagos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailsService } from 'src/app/services/mails.service';
import { environment } from 'src/environment/environment';



@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  productos: any[] = [];
  total: number = 0
  monto: number = 0
  montoIva: number = 0
  fechaActual: Date = new Date()
  showConfirmationPedido: boolean = false
  formPedido:FormGroup
  @Input() usuario: number
  @Input() nombre: string
  @Input() apellido: string
  @Input() celular: number

  carritoHabilitado: boolean = false
  carritoVacio: boolean = false
  incremento: number = 0
  montoIncremento = 0
  montoIncrementoIva = 0
  usuarioLog: string = ""
  to: string = 'andreshosch114@gmail.com';
  subject: string = 'andreshosch114@gmail.com';
  text: string = 'Tienes un nuevo pedido confirmado';
  numeroPedido: number
  showBuy: boolean = false
  

  //Traer datos de coleccion... 
  // metodoPago: string[] = ['Link de pago', 'Transferencia', 'Mercado Pago'];
  metodoPago: any[] = []
  seleccionPago: string = this.metodoPago[0]
  

  constructor(private dataService: DataService, private pedidosService: PedidosService, private _mensaje:MensajeService, private _pagosService: PagosService,private fb: FormBuilder,private _mailService:MailsService) {
   
    this.formPedido = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      celular: ['', Validators.required],
      carrito: ['', Validators.required],
    })

  }

 

  ngOnInit() {
    let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
    // let usuarioLog: any = arregloLS[0]
    this.usuarioLog = arregloLS[0]
    this.carritoGuardado(this.usuarioLog)
    this.getTablaPagos()
    this.seleccionPago = "Link de Pago"
  }

  getNumeroPedido(){
    this.pedidosService.getNumeroPedido().subscribe(doc => {
      doc.forEach((element: any) => {
        this.numeroPedido = element.payload.doc.data().actual
      })
    })
  }

  getTablaPagos(){
    this._pagosService.getPagos().subscribe(doc => {
      this.metodoPago = []
      doc.forEach((element: any) => {
        this.metodoPago.push({
          ...element.payload.doc.data()
        })
      })
    })
  }

  mostrarMetodos(){
    console.log(`metodos: ${JSON.stringify(this.metodoPago)}`)
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
    this.montoIva = 0
    this.incremento = 0
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
    this.dataService.actualizarCart(this.productos, this.usuarioLog)
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
    this.dataService.actualizarCart(this.productos, this.usuarioLog)
  }

  actualizarResumen() {
    this.dataService.productos$.subscribe(productos => {
      this.productos = productos;
      this.total = 0
      this.monto = 0
      this.montoIva = 0
      for (let j = 0; j < this.productos.length; j++) {
        this.monto = this.monto + (parseInt(productos[j].addProducto.precio) * parseInt(productos[j].addProducto.cantidad))
        this.montoIva = this.montoIva + (parseInt(productos[j].addProducto.precio) * parseInt(productos[j].addProducto.cantidad) * (1 + (parseInt(productos[j].addProducto.iva) / 100)))
        this.total = this.total + parseInt(productos[j].addProducto.cantidad)
      }
    this.montoIncremento = this.incremento > 0? (this.monto * this.incremento / 100 + this.monto) : this.monto  
    this.montoIncrementoIva = this.incremento > 0? (this.montoIva * this.incremento / 100 + this.montoIva) : this.montoIva  

    });
  }

  confirmPedido(){
    this.showConfirmationPedido = true
    this.getNumeroPedido()
  }

  cancelPedido(){
    this.showConfirmationPedido = false
  }
  

  mostrarCarrito() {
    let numPedido = this.numeroPedido + 1
    this.showConfirmationPedido = false
    let userActual: any = this.usuario
    let unPedido: Pedido = {
      carrito: this.productos,
      idUser: this.usuario,
      fecha: this.formatFecha(),
      nombre: this.nombre,
      apellido: this.apellido,
      celular: this.celular,
      numero: numPedido
    }
     const pedidoNuevo={
      nombre:this.nombre,
      apellido:this.apellido,
      celular:this.celular,
      carrito:[]
     }
      for (let i=0;i<this.productos.length;i++){
       const carrito=
          {  
           Producto: i+1,
           nombre:this.productos[i].addProducto.nombre,
           cantidad:this.productos[i].addProducto.cantidad,
           precio:"U$S "+this.productos[i].addProducto.precio * this.productos[i].addProducto.cantidad
          }
        pedidoNuevo.carrito.push(carrito);
        pedidoNuevo.carrito.push("\n");
      }
    
      console.log(pedidoNuevo)
      
      const formData:any=pedidoNuevo
      const formUrl="https://formspree.io/f/mwkgbeoz"
      //  this._mailService.sendMails(formUrl, formData)
    this.pedidosService.createPedido(unPedido, 'Pedidos Pendientes')
    for (let i =0; i < this.productos.length; i++){
      this.productos[i].addProducto.cantidad = 1;
    }
    this.productos = []
    this.total = 0
    this.monto = 0
    this.montoIva = 0
    this.incremento = 0
    this.dataService.limpiar()
    this.ocultarCarrito();
    localStorage.removeItem(userActual);
    this.showBuy = true
    const nuevoPedido = {
      actual: numPedido
    }
    this.pedidosService.updateNumeroPedido(environment.idPedido ,nuevoPedido)
  }

  aceptarBuy(){
    this.showBuy = false
  }

  formatFecha() {
    return format(this.fechaActual, 'dd/MM/yyyy - HH:mm');
  }


  seleccionCambiada() {
    const indiceSeleccionado = this.metodoPago.findIndex(metodo => metodo.metodo === this.seleccionPago);
    this.incremento = this.metodoPago[indiceSeleccionado].porcentaje
    this.montoIncremento = this.incremento > 0? (this.monto * this.incremento / 100 + this.monto) : this.monto  
    this.montoIncrementoIva = this.incremento > 0? (this.montoIva * this.incremento / 100 + this.montoIva) : this.montoIva
  }
  }

