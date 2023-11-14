import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  productos: any[] = [];
  total: number=0
  monto: number = 0
  
  @Input() usuario:number
  @Input() nombre:string
  @Input() apellido:string
  @Input() celular:number

  //Inicio Carrito
  carritoHabilitado: boolean =false
  //Fin Carrito

  constructor(private dataService: DataService,private pedidosService:PedidosService){
    
  }

  ngOnInit(){
    this.carritoGuardado()
     }

  carritoGuardado(){
    let elCarrito = JSON.parse(localStorage.getItem("hayCarrito"));
    if (elCarrito){
      const fechaActual = new Date()
      const fechaEnSegundos = fechaActual.getTime()
      const fechaAlmacenada = new Date(elCarrito[1])
      const fechaAlmDif = fechaAlmacenada.getTime()
      const tiempoLogin = Math.round((fechaEnSegundos - fechaAlmDif) / 1000)

      if(tiempoLogin < 3600){
        this.dataService.actualizarCart(elCarrito[0])
      }else{
        this.quitarCarro()
      }
    }
    this.actualizarResumen()
  }

  quitarCarro(){
    localStorage.removeItem("hayCarrito");
  }

//Inicio sección Carrito
verCarrito(){
  this.carritoHabilitado = true
  this.actualizarResumen()
}

ocultarCarrito(){
  this.carritoHabilitado = false
}


quitarProd(quitarElem: string){
  const index = this.productos.findIndex(obj => obj.addProducto.id === quitarElem)
  this.productos.splice(index, 1)
  this.actualizarResumen()
}


sumarUno(idAgregar: string){
  for (let j=0; j < this.productos.length; j++){
    if(this.productos[j].addProducto.id === idAgregar){
      this.productos[j].addProducto.cantidad ++;
      this.actualizarResumen()
      j = this.productos.length
    }
  }
}

restarUno(idQuitar: string){
  for (let j=0; j < this.productos.length; j++){
    if(this.productos[j].addProducto.id === idQuitar){
      if(this.productos[j].addProducto.cantidad > 1){
        this.productos[j].addProducto.cantidad --;
        this.actualizarResumen()
      }
      j = this.productos.length
    }
  }
}

actualizarResumen(){
  this.dataService.productos$.subscribe(productos => {
    this.productos = productos;
    this.total = 0
    this.monto = 0
    for(let j=0; j < this.productos.length; j++){
      this.monto = this.monto + (parseInt(productos[j].addProducto.precio) * parseInt(productos[j].addProducto.cantidad))
      this.total = this.total + parseInt(productos[j].addProducto.cantidad)
    }
  });
}
mostrarCarrito(){
  const fecha=new Date()
  let day=fecha.getDay()
  const month=fecha.getMonth()
  const year=fecha.getFullYear()
  const formatFecha=`${day}/${month}/${year}`
  console.log(day+"/"+month+"/"+year)
   let unPedido:Pedido={
     carrito:this.productos,
     idUser:this.usuario,
     fecha: formatFecha,
     nombre:this.nombre,
     apellido:this.apellido,
     celular:this.celular
   }
   console.log(unPedido)
  this.pedidosService.createPedido(unPedido,'Pedidos Pendientes')
}

formatHora(){

}
}
