import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PagosService } from 'src/app/services/pagos.service';
import {MensajeService} from 'src/app/services/mensaje.service'
import { tr } from 'date-fns/locale';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SppinerService } from 'src/app/services/sppiner.service';

@Component({
  selector: 'app-gestion-pago',
  templateUrl: './gestion-pago.component.html',
  styleUrls: ['./gestion-pago.component.css']
})
export class GestionPagoComponent {

  tablaPagos: any[] = []
  dataSourcePagos!: MatTableDataSource<any>;
  displayedColumns: string[] = ['metodo', 'porcentaje', 'acciones'];
  formMetodo: FormGroup
  updateMetodo: FormGroup
  actualizarPago: boolean = false
  idAuxiliar: string = ""
  showConfirmationDelPago: boolean = false
  metodoExistente: boolean = false

  constructor(private _pagosService: PagosService, private fb:FormBuilder, private _mensaje:MensajeService,public _spinner:SppinerService){

    this.dataSourcePagos = new MatTableDataSource(this.tablaPagos);

    this.formMetodo=this.fb.group({
      metodo:['',Validators.required],
      porcentaje: ['', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
    })

    this.updateMetodo = this.fb.group({
      metodo:['',Validators.required],
      porcentaje: ['', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
    })
  }

  ngOnInit() {
    this._spinner.showSpinner()
    this.getTablaPagos()
  }

  getTablaPagos(){
    this._pagosService.getPagos().subscribe(doc => {
      this.tablaPagos = []
      this.dataSourcePagos = new MatTableDataSource(this.tablaPagos)
      doc.forEach((element: any) => {
        this.tablaPagos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  crearMetodo(){
    console.log(`metodos: ${JSON.stringify(this.tablaPagos)}`)
    let existe = false
    let newMetodo = {
      metodo: this.formMetodo.get('metodo').value,
      porcentaje: this.formMetodo.get('porcentaje').value,
    }

    for(let j=0; j< this.tablaPagos.length; j++){
      if((this.tablaPagos[j].metodo).toLowerCase() === (newMetodo.metodo).toLowerCase() ){
        existe = true
        j = this.tablaPagos.length
      }
    }

    if(existe){
      this.metodoInvalido()
    }else{
      this._pagosService.createPagos(newMetodo)
      this._mensaje.snackBar("Método de Pago creado correctamente",'green')
      this.formMetodo.reset()
    }
  }

  metodoInvalido(){
    this.metodoExistente = true
    setTimeout(() => {
      this.metodoExistente =false
    }, 3000);
  }

  confirmDel(id: string){
    this._pagosService.deletePago(id)
    this.showConfirmationDelPago = false
    this._mensaje.snackBar("Método de Pago eliminado correctamente",'green')
  }

  actualizarMetodoPago(){
    const metodoAuxiliar = {
      metodo: this.updateMetodo.get('metodo').value,
      porcentaje: this.updateMetodo.get('porcentaje').value, 
    }
    this._pagosService.updatePago(this.idAuxiliar, metodoAuxiliar)
    this.idAuxiliar = ""
    this.actualizarPago = false
    this._mensaje.snackBar("Método de Pago actualizado correctamente",'green')
  }

  modificarPago(id: string, indice: number){
    this.actualizarPago = true
    this.updateMetodo.patchValue({
      metodo: this.tablaPagos[indice].metodo,
      porcentaje: this.tablaPagos[indice].porcentaje,
    });
    this.idAuxiliar = id
  }

  eliminarUnPago(id: string){
    this.showConfirmationDelPago = true
    this.idAuxiliar = id
  }

  cancelDel(){
    this.showConfirmationDelPago = false
  }

}
