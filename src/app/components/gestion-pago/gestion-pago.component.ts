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

  constructor(private _pagosService: PagosService, private fb:FormBuilder){

    this.dataSourcePagos = new MatTableDataSource(this.tablaPagos);

    this.formMetodo=this.fb.group({
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

}
