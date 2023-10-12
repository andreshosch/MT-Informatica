import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';
import { ProductosService } from 'src/app/services/productos.service';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent {

  productosHot: any[] = []
  altaProd:FormGroup
  modificarProd: FormGroup
  modalActivo: boolean = false
  idProducto: string


  constructor(private _productosService: ProductosService, private fb: FormBuilder){
    this.altaProd = this.fb.group({
      nombre: ['', Validators.required],
      rubro: ['', Validators.required],
      subrubro: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: ['', Validators.required],
    })

    this.modificarProd = this.fb.group({
      nombreM: ['', Validators.required],
      rubroM: ['', Validators.required],
      subrubroM: ['', Validators.required],
      descripcionM: ['', Validators.required],
      precioM: ['', Validators.required],
      imagenM: ['', Validators.required],
    })
  }


  ngOnInit(){
    this.getProductos()
  }

  ngAfterView(){
    
  }

  getProductos(){
    this._productosService.getProducts().subscribe(doc => {
      this.productosHot = []
      doc.forEach((element: any) => {
        this.productosHot.push({
          id: element.payload.doc.id,
          ... element.payload.doc.data()
        })
      })
      console.log(this.productosHot)
    })
  }

  agregarProd(tipo){
    if(tipo == 'a'){
      const unProducto: Producto = {
        nombre: this.altaProd.get('nombre').value,
        precio: this.altaProd.get('precio').value,
        rubro: this.altaProd.get('rubro').value,
        subrubro: this.altaProd.get('subrubro').value,
        imagen: this.altaProd.get('imagen').value,
        descripcion: this.altaProd.get('descripcion').value,
        cantidad: 1
      }
      this._productosService.createProduct(unProducto) 
    }else{
      const unProducto: Producto = {
        nombre: this.modificarProd.get('nombreM').value,
        precio: this.modificarProd.get('precioM').value,
        rubro: this.modificarProd.get('rubroM').value,
        subrubro: this.modificarProd.get('subrubroM').value,
        imagen: this.modificarProd.get('imagenM').value,
        descripcion: this.modificarProd.get('descripcionM').value,
        cantidad: 1
      }
      this._productosService.updateProduct(this.idProducto, unProducto) 
    }
    
  }

  borrarPorId(articulo){
    console.log(`articulo: ${articulo}`)
    this._productosService.deleteProduct(articulo)
  }

  modificar(articulo){
    this.modalActivo = true
    this.idProducto = articulo

    this._productosService.getProductById(articulo).subscribe(data => {
      this.modificarProd.setValue({
        nombreM: data.nombre,
        precioM: data.precio,
        rubroM: data.rubro,
        subrubroM: data.subrubro,
        imagenM: data.imagen,
        descripcionM: data.descripcion
      })
    })
  }

  cerrarModal(){
    this.modalActivo=false
  }

}
