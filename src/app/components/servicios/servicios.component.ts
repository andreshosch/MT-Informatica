import { Component } from '@angular/core';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {

  panelOpenState: boolean[] = [false, false, false, false];

  togglePanel(index: number): void {
    for (let i = 0; i < this.panelOpenState.length; i++) {
      if (i !== index) {
        this.panelOpenState[i] = false; // Cerrar todos los paneles excepto el seleccionado
      }
    }
    this.panelOpenState[index] = !this.panelOpenState[index]; // Abrir o cerrar el panel seleccionado
  }

  datosPaneles = [
    {
      titulo: 'Equipos Informáticos',
      contenido: ['Notebooks', 'PC\'s de escritorio', 'Monitores', 'Servidores', 'UPS', 'Impresoras']
    },
    {
      titulo: 'Almacenamiento',
      contenido: ['Discos externos', 'Memorias', 'Pendrives']
    },
    {
      titulo: 'Conectividad',
      contenido: ['Routers', 'Placas de red USB', 'Extensores de rango']
    },
    {
      titulo: 'Periféricos y accesorios',
      contenido: ['Teclados y mouse', 'Auriculares', 'Parlantes']
    }
  ];

  imagen: string;
  descripcion: string;

  venta: boolean = false
  servicio: boolean = false
  asesoramiento: boolean = false
  asesoramientoI: boolean = true
  asesoramientoD: boolean = false
  ventaI: boolean = false
  ventaD: boolean = true
  servicioI: boolean = true
  servicioD: boolean = false

  constructor() { }

  mostrarServicio(){
    this.servicioD= true
    this.servicioI= false
    this.asesoramientoD = false
    this.asesoramientoI = true
    this.ventaD = false
    this.ventaI = true
    this.venta = false
    this.asesoramiento = false
    this.servicio = true
  }

  mostrarVenta(){
    this.servicioD= false
    this.servicioI= true
    this.asesoramientoD = false
    this.asesoramientoI = true
    this.ventaD = true
    this.ventaI = false
    this.venta = true
    this.asesoramiento = false
    this.servicio = false
  }

  mostrarAsesoramiento(){
    this.servicioD= false
    this.servicioI= true
    this.asesoramientoD = true
    this.asesoramientoI = false
    this.ventaD = false
    this.ventaI = true
    this.venta = false
    this.asesoramiento = true
    this.servicio = false
  }

  mostrarDetalles(opcion: string) {
    switch (opcion) {
      case 'Servicio Técnico':
        this.imagen = '../../../assets/Servicio.png'
        this.descripcion = 'Reparación electrónica de Notebooks';
        this.mostrarServicio()
        break;
      case 'Venta':
        this.imagen = '../../../assets/Logo.png';
        this.descripcion = '1- Equipos Informáticos';
        this.mostrarVenta()
        break;
      case 'Asesoramiento':
        this.imagen = '../../../assets/Logo.png';
        this.descripcion = 'Asesoramiento de software legal';
        this.mostrarAsesoramiento()
        break;
      default:
        this.imagen = '';
        this.descripcion = '';
        break;
    }
  }

}
