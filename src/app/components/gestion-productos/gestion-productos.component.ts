import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tr } from 'date-fns/locale';
import { Producto } from 'src/app/models/producto';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PagosService } from 'src/app/services/pagos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SppinerService } from 'src/app/services/sppiner.service';
import { environment } from 'src/environment/environment';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css'],
})
export class GestionProductosComponent {

  productosHot: any[] = []
  listado: any[] = []
  tablaIva: any[] = []
  altaProd: FormGroup
  modificarProd: FormGroup
  modalActivo: boolean = false
  modalFormatoArticulos: boolean = true
  idProducto: string
  losBloqueados: any[] = []
  imagenesArray: string[] = []
  onlyCategory: any;
  idAuxiliar: string = ""
  showConfirmationDelProd: boolean = false
  estadoApi: string = ""
  validadorApi: boolean = false
  // idApi: string = 'r6SoJw8FxtZ2aWHz2nVq'



  constructor(private _productosService: ProductosService, private _pagosService: PagosService, private fb: FormBuilder,private _mensaje:MensajeService, public _spinner:SppinerService){
    
    this.altaProd = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      subcategoria: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      imagenes: ['', Validators.required],
      imagenes2: [''],
      imagenes3: [''],
      destacado: ['', Validators.required],
      marca: ['', Validators.required],
      iva: ['', Validators.required],
      impuesto_interno: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
    });

    this.modificarProd = this.fb.group({
      nombreM: ['', Validators.required],
      categoriaM: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      subcategoriaM: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      descripcionM: ['', Validators.required],
      precioM: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      imagenesM: ['', Validators.required],
      imagenesM2: [''],
      imagenesM3: [''],
      destacadoM: ['', Validators.required],
      marcaM: ['', Validators.required],
      ivaM: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      impuesto_internoM: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
    })
  }

  ngOnInit() {
    this._spinner.showSpinner()
    this.getApi();
    this.getBloqueados()
    this.getProductos()
    this.onlyCategory =  JSON.parse(localStorage.getItem('categorias'));  
    this.getTablaIva()
  }

  getTablaIva(){
    this._pagosService.getIva().subscribe(doc => {
      this.tablaIva = []
      doc.forEach((element: any) => {
        this.tablaIva.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  getApi() {
    this._productosService.getApiElite().subscribe(doc => {
      doc.forEach((element: any) => {
        this.validadorApi = element.payload.doc.data().valor
      })
    })
    setTimeout(() => {
      this.validadorApi === true ? this.estadoApi = 'Activa' : this.estadoApi = 'Inactiva';
    }, 2000)
  }

  altaApi() {
    let ss = {
      valor: true
    }
    this._productosService.updateApiElite(environment.idApi, ss)
    this.getApi()
    this._mensaje.snackBar('API de Elite Activada', 'green')
  }

  bajaApi() {
    let ss = {
      valor: false
    }
    this._productosService.updateApiElite(environment.idApi, ss)
    this.getApi()
    this._mensaje.snackBar('API de Elite Desactivada', 'green')
  }

  getProductos() {
    this._productosService.getProducts().subscribe(doc => {
      this.productosHot = []
      doc.forEach((element: any) => {
        this.productosHot.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
    })
  }

  getBloqueados() {
    this._productosService.getBloqueos().subscribe(doc => {
      this.losBloqueados = []
      doc.forEach((element: any) => {
        this.losBloqueados.push({
          id: element.payload.doc.id,
          categoria: element.payload.doc.data().categoria
        })
      })
    })
  }

  agregarProd(tipo) {
    let unProducto: Producto;
  
    if (tipo == 'a') {
      let imagenesActuales:any[]=[]
      imagenesActuales.push(this.altaProd.get('imagenes').value)
      let imagen2 = this.altaProd.get('imagenes2').value
      let imagen3 = this.altaProd.get('imagenes3').value

      if(imagen2){
        imagenesActuales.push(imagen2)
      }
      if(imagen3){
        imagenesActuales.push(imagen3)
      }

      unProducto = {
        nombre: this.altaProd.get('nombre').value,
        precio: this.altaProd.get('precio').value,
        categoria: this.altaProd.get('categoria').value,
        subcategoria: this.altaProd.get('subcategoria').value,
        imagenes: imagenesActuales,
        descripcion: this.altaProd.get('descripcion').value,
        destacado: this.altaProd.get('destacado').value,
        marca: this.altaProd.get('marca').value,
        iva: this.altaProd.get('iva').value,
        impuesto_interno: this.altaProd.get('impuesto_interno').value,
        cantidad: 1
      }
      this._productosService.createProduct(unProducto)
      this.modalActivo = false;
      this._mensaje.snackBar("Producto agregado correctamente", "green");
    } else {
      let imagenesActuales:any[]=[]
      imagenesActuales.push(this.modificarProd.get('imagenesM').value)
      let imagen2 = this.modificarProd.get('imagenesM2').value
      let imagen3 = this.modificarProd.get('imagenesM3').value

      if(imagen2){
        imagenesActuales.push(imagen2)
      }
      if(imagen3){
        imagenesActuales.push(imagen3)
      }
        unProducto = {
          nombre: this.modificarProd.get('nombreM').value,
          precio: this.modificarProd.get('precioM').value,
          categoria: this.modificarProd.get('categoriaM').value,
          subcategoria: this.modificarProd.get('subcategoriaM').value,
          imagenes: imagenesActuales,
          descripcion: this.modificarProd.get('descripcionM').value,
          destacado: this.modificarProd.get('destacadoM').value,
          marca: this.modificarProd.get('marcaM').value,
          iva: this.modificarProd.get('ivaM').value,
          impuesto_interno: this.modificarProd.get('impuesto_internoM').value,
          cantidad: 1
       }
       this._productosService.updateProduct(this.idProducto, unProducto)
        this.modalActivo = false;
        this._mensaje.snackBar("Producto modificado correctamente", "green");
    }
      
      
  }
  
  sonImagenesIguales(nuevasImagenes: string[], imagenesActuales: string[]): boolean {
    if (nuevasImagenes.length !== imagenesActuales.length) {
      return false; 
    }
    for (let i = 0; i < nuevasImagenes.length; i++) {
      if (nuevasImagenes[i] !== imagenesActuales[i]) {
        return false;
      }
    }
    return true;
  }
  borrarPorId(articulo) {
    // this._productosService.deleteProduct(articulo)
    this.idAuxiliar = articulo;
    this.showConfirmationDelProd = true
  }

  confirmDel() {
    this._productosService.deleteProduct(this.idAuxiliar)
    this.showConfirmationDelProd = false
    this.idAuxiliar = ""
  }

  cancelProd() {
    this.showConfirmationDelProd = false
  }

  modificar(articulo) {
    this.modalActivo = true
    this.idProducto = articulo
    this._productosService.getProductById(articulo).subscribe(data => {
      console.log(data)
      this.modificarProd.setValue({
        nombreM: data.nombre,
        precioM: data.precio,
        categoriaM: data.categoria,
        subcategoriaM: data.subcategoria,
        imagenesM: data.imagenes[0],

        // imagenesM2: data.imagenes[1],
        imagenesM2: data.imagenes[1]? data.imagenes[1] : "",
        imagenesM3: data.imagenes[2]? data.imagenes[2] : "",
        
        descripcionM: data.descripcion,
        destacadoM: data.destacado,
        marcaM: data.marca,
        ivaM: data.iva,
        impuesto_internoM: data.impuesto_interno,
      })
    })
  }

  cerrarModal() {
    this.modalActivo = false
  }

  altaBloqueo() {
    let categoria = document.getElementById('aBloquear').textContent

    if (categoria) {
      let prueba = {
        categoria
      }
      this._productosService.setBloqueos(prueba)
      this.onlyCategory = this.onlyCategory.filter(category => category !== categoria);
      this._mensaje.snackBar('Categoría bloqueada correctamente', 'green')
    }
  }

  bajaBloqueo() {
    let categoria = document.getElementById('aDesbloquear').textContent
    const index = this.losBloqueados.findIndex(objeto => objeto.categoria === categoria)
    this._productosService.deleteBloqueo(this.losBloqueados[index].id)
    this._mensaje.snackBar('Categoría desbloqueada correctamente', 'green')
  }

  setApiElite(elValor: boolean) {
    let ss = {
      valor: elValor
    }
    this._productosService.setApiElite(ss)
  }
}