import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';
import { MensajeService } from 'src/app/services/mensaje.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SppinerService } from 'src/app/services/sppiner.service';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css'],
})
export class GestionProductosComponent {

  productosHot: any[] = []
  listado: any[] = []
  altaProd:FormGroup
  modificarProd: FormGroup
  modalActivo: boolean = false
  idProducto: string
  losBloqueados: string[] = []
  imagenesArray:string[]=[]
  onlyCategory: any;
    

  constructor(private _productosService: ProductosService, private fb: FormBuilder,private _mensaje:MensajeService, public _spinner:SppinerService){
    this.altaProd = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      subcategoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      imagenes: ['', Validators.required],
      destacado: ['', Validators.required],
      marca: ['', Validators.required],
      iva: ['', Validators.required],
      impuesto_interno: ['', Validators.required],
    })

    this.modificarProd = this.fb.group({
      nombreM: ['', Validators.required],
      categoriaM: ['', Validators.required],
      subcategoriaM: ['', Validators.required],
      descripcionM: ['', Validators.required],
      precioM: ['', Validators.required],
      imagenesM: ['', Validators.required],
      destacadoM: ['', Validators.required],
      marcaM: ['', Validators.required],
      ivaM: ['', Validators.required],
      impuesto_internoM: ['', Validators.required],
    })
  }

  ngOnInit(){
    this._spinner.showSpinner()
    this.getBloqueados()
    this.getProductos()
    this.onlyCategory =  JSON.parse(localStorage.getItem('categorias'));
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

  getBloqueados(){
    this._productosService.getBloqueos().subscribe(doc => {
      this.losBloqueados = []
      doc.forEach((element: any) => {
        this.losBloqueados.push(
          element.payload.doc.data().categoria
        )
      })
    })
  }

  agregarProd(tipo){
    if(tipo == 'a'){
        // this.imagenesArray.push(this.altaProd.get('imagenes').value)
        const unProducto: Producto = {
        nombre: this.altaProd.get('nombre').value,
        precio: this.altaProd.get('precio').value,
        categoria: this.altaProd.get('categoria').value,
        subcategoria: this.altaProd.get('subcategoria').value,
        imagenes: this.altaProd.get('imagenes').value,
        descripcion: this.altaProd.get('descripcion').value,
        destacado: this.altaProd.get('destacado').value,
        marca: this.altaProd.get('marca').value,
        iva: this.altaProd.get('iva').value,
        impuesto_interno: this.altaProd.get('impuesto_interno').value,
        cantidad: 1
      }
      this._productosService.createProduct(unProducto) 
      this.altaProd.reset()
      this._mensaje.snackBar("Producto dado de alta correctamente","green")
      console.log(unProducto)
    }else{
      //  this.imagenesArray.push(this.modificarProd.get('imagenesM').value)
       const unProducto: Producto = {
        nombre: this.modificarProd.get('nombreM').value,
        precio: this.modificarProd.get('precioM').value,
        categoria: this.modificarProd.get('categoriaM').value,
        subcategoria: this.modificarProd.get('subcategoriaM').value,
        imagenes: this.modificarProd.get('imagenesM').value, 
        descripcion: this.modificarProd.get('descripcionM').value,
        destacado: this.modificarProd.get('destacadoM').value,
        marca: this.modificarProd.get('marcaM').value,
        iva: this.modificarProd.get('ivaM').value,
        impuesto_interno: this.modificarProd.get('impuesto_internoM').value,
        cantidad: 1
      }
            
      this._productosService.updateProduct(this.idProducto, unProducto) 
      this.modalActivo=false
      this._mensaje.snackBar("Producto modificado correctamente","green")
    }
  }

  borrarPorId(articulo){
    this._productosService.deleteProduct(articulo)
  }

  modificar(articulo){
    this.modalActivo = true
    this.idProducto = articulo

    this._productosService.getProductById(articulo).subscribe(data => {
      this.modificarProd.setValue({
        nombreM: data.nombre,
        precioM: data.precio,
        categoriaM: data.categoria,
        subcategoriaM: data.subcategoria,
        imagenesM: data.imagenes,
        descripcionM: data.descripcion,
        destacadoM: data.destacado,
        marcaM: data.marca,
        ivaM: data.iva,
        impuesto_internoM: data.impuesto_interno,
      })
    })
  }

  cerrarModal(){
    this.modalActivo=false
  }

  altaBloqueo(){
    let categoria = document.getElementById('aBloquear').textContent
    this._productosService.getBloqueos().subscribe(doc => {
      this.listado = []
    doc.forEach((element: any) => {
      this.listado.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
    console.log(`listado: ${this.listado}`)
  })
    
    this.listado.push(categoria)
    let prueba = {
      categoria
    }
    console.log(`listado post: ${this.listado}`)
    this._productosService.setBloqueos(prueba)
  }

  bajaBloqueo(){
    let categoria = document.getElementById('aDesbloquear').textContent
    console.log(`categoria a eliminar: ${categoria}`)
  }



}

