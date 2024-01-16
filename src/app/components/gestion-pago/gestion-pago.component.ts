import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PagosService } from 'src/app/services/pagos.service';

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

  constructor(private _pagosService: PagosService, private fb:FormBuilder){

    this.dataSourcePagos = new MatTableDataSource(this.tablaPagos);

    this.formMetodo=this.fb.group({
      metodo:['',Validators.required],
      porcentaje:['',Validators.required],
    })

    this.updateMetodo = this.fb.group({
      metodo:['',Validators.required],
      porcentaje:['',Validators.required],
    })
  }

  ngOnInit() {
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
    let newMetodo = {
      metodo: this.formMetodo.get('metodo').value,
      porcentaje: this.formMetodo.get('porcentaje').value,
    }
    this._pagosService.createPagos(newMetodo)
  }

  eliminarPago(id: string){
    this._pagosService.deletePago(id)
  }

  actualizarMetodoPago(){
    const metodoAuxiliar = {
      metodo: this.updateMetodo.get('metodo').value,
      porcentaje: this.updateMetodo.get('porcentaje').value, 
    }
    this._pagosService.updatePago(this.idAuxiliar, metodoAuxiliar)
    this.idAuxiliar = ""
  }

  modificarPago(id: string, indice: number){
    this.actualizarPago = true
    this.updateMetodo.patchValue({
      metodo: this.tablaPagos[indice].metodo,
      porcentaje: this.tablaPagos[indice].porcentaje,
    });
    this.idAuxiliar = id
  }

}
