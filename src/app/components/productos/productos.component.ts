import { Component,Renderer2 } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { tr } from 'date-fns/locale';
import { first } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { DataService } from 'src/app/services/data.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SppinerService } from 'src/app/services/sppiner.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  arrProductos: any[] = []
  arrPaginador: any[]
  arrProducts: any[] = []
  arrCategory: any[] = []
  arrProductsPages: any[] = []
  subCategoryFilter: any[] = []
  brandFilter: any[] = []
   numberPages: any = 1
  numberPagesTotal: number
  onlyCategory: any
  onlySubCategory: any
  onlyBrand: any
  pages: any
  visibleFirstPage:boolean=false
  visibleAfterPage:boolean=false
  visibleNextPage:boolean=false
  visibleLastPage:boolean=false
  filteredItem: any
  selectedProduct:any
  lengthPages: number
  min: number;
  max: number;
  marcaSearch = ''
  categoriasUnicas: any
  productSearch = '';
  subCategorySearch = '';
  categorySearch = ''
  brandSearch = ''
  tituloProductos:boolean=true
  buttonPages:boolean=true
  filterArray: any[] = [];
  requestData = {
    "user_id": '22181',
    "token": "oyhl04axaro"
  }
  bloqueados: any[] = ['Notebooks Corporativo', 'Procesadores']
  hayLogueado: boolean;
  //Inicio Productos destacados
  productosHot: any[] = []
  elProducto: Producto
  idProducto: string
  showProductosDestacados:boolean=false
  validadorApi: boolean = false
  // Fin Productos destacados

  


  constructor(private productosServices: ProductosService, private _config: NgbCarouselConfig, private dataService: DataService,
  private _mensaje:MensajeService, public _spinner:SppinerService,private renderer: Renderer2,) {
    _config.interval = 2000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
  }


  ngOnInit() {
    this.getApi()
    this.getBloqueados()
    this._spinner.showSpinner()
    this.getProductos()
    setTimeout(() => {
      if (this.validadorApi){
        this.arrayProducts()
      }
    },2000)
    
    this.dataService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.hayLogueado = isAuthenticated;
    
    });
  }

  loadFirstPage(products: any) {
    this.arrProductsPages = []
    if (products.length > 20) {
      this.numberPages = 1
      this.visibleFirstPage=false
      this.visibleAfterPage=false
      this.visibleNextPage=true
      this.visibleLastPage=true

      for (let i = 0; i < 20; i++) {
        this.arrProductsPages[i] = products[i]
      }
    }
    else {
      this.numberPages = 1
      this.visibleFirstPage=false
      this.visibleAfterPage=false
      this.visibleNextPage=false
      this.visibleLastPage=false

      for (let i = 0; i < products.length; i++) {
        this.arrProductsPages[i] = products[i]
      }
    }
      // this.numberPages = 1
      //  this.visibleFirstPage=false
      //  this.visibleAfterPage=false
      //  this.visibleNextPage=true
      //  this.visibleLastPage=true
  }
// FUNCION EN CASO DE QUE NO FUNCIONE LA API PARA GENERAR UN ARRAY ALEATORI DE 400 PRODUCTOS
  //   arrayProducts(){
  //      for (let i = 0; i < 400; i++) {
  //       const producto = {
  //         marca: `Marca${(Math.random() * 5).toFixed(0)}`,
  //         nombre: `Producto${i + 1}`,
  //         categoria: `Categoría${(Math.random() * 6).toFixed(0)}`,
  //         sub_categoria: `Subcategoría${Math.floor(Math.random() * 10) + 1}`,
  //         imagen: `imagen${i + 1}.jpg`,
  //         ppv_usd: (Math.random() * 500).toFixed(2)
  //       };
  //       this.arrProducts.push(producto);

  //     }
  //     this.loadFirstPage(this.arrProducts)
  //     for (let i = 0; i < this.arrProducts.length; i++) {
  //       this.arrCategory.push({
  //         categoria: this.arrProducts[i].categoria,
  //         sub_categoria: this.arrProducts[i].sub_categoria,
  //         marca:this.arrProducts[i].marca
  //       })
  //     }

  // this.deleteRepetead()
  //   }

  // deleteRepetead(array: any[]) {
  //   const uniqueObjects = new Set();
  //   const uniqueData = array.filter((obj) => {
  //     const objString = JSON.stringify(obj);
  //     if (!uniqueObjects.has(objString)) {
  //       uniqueObjects.add(objString);
  //       return true;
  //     }
  //     return false;
  //   });
  //   console.log(array)
  // }


  arrayProducts() {
    this.productosServices.getArrayProducts(this.requestData, 1, 100).subscribe
      (response => {
        this.pages = response['paginador'];
        this.lengthPages = this.pages.total
       if(this.filterArray.length===0)
       {
        for (let i = 1; i <= this.lengthPages; i += 100) {
          this.productosServices.getArrayProducts(this.requestData, 100, i).subscribe
            (response => {
              this.arrProductos = response['resultado']
              for (let p=0; p < this.arrProductos.length; p++){
                const unProducto: Producto = {
                  nombre: this.arrProductos[p].nombre,
                  precio: this.arrProductos[p].precio,
                  categoria: this.arrProductos[p].categoria,
                  subcategoria: this.arrProductos[p].sub_categoria,
                  imagenes: this.arrProductos[p].imagenes[0],
                  descripcion: this.arrProductos[p].descripcion,
                  destacado: false,
                  marca: this.arrProductos[p].marca,
                  iva: this.arrProductos[p].iva,
                  impuesto_interno: this.arrProductos[p].impuesto_interno,
                  id: this.arrProductos[p].id,
                  cantidad: 1
                }
                //Prueba bloqueo de categorias
                if(!this.establoqueada(unProducto.categoria)){
                  this.arrProducts.push(unProducto)
                }
             
                //
                //this.arrProducts.push(unProducto)
              }
              // this.arrProducts.push(...this.arrProductos)
             
              this.loadFirstPage(this.arrProducts)
              
            })
        }
       }
      })
  }
  nextPage(products: any) {
    this.arrProductsPages = []
    let numberPage = Math.ceil(products.length / 20);
    this.numberPages += 1;
      if (this.numberPages<=numberPage){
      this.visibleFirstPage=true
      this.visibleAfterPage=true
      this.visibleNextPage=true
      this.visibleLastPage=true
    }
    else{
      this.visibleFirstPage=false
      this.visibleAfterPage=false
      this.visibleNextPage=true
      this.visibleLastPage=true
    }
    if (this.numberPages < numberPage) {
      this.min = (((this.numberPages - 2) * 10) * 2 + 20);
      this.max = (this.min) + 20
      let j = 0;
      if (this.max > products.length) {
        this.max = products.length
      }
      do
        for (let i = this.min; i < this.max; i++) {
          this.arrProductsPages[j] = products[i]
          j += 1;
        }
      while (j < numberPage)
    }
    else {
      this.lastPage(products)
    }
  }

  afterPage(products: any) {
    this.arrProductsPages = []
    this.numberPages -= 1;
      if (this.numberPages==1){
      this.visibleFirstPage=false
      this.visibleAfterPage=false
      this.visibleNextPage=true
      this.visibleLastPage=true
    }
    else{
      this.visibleFirstPage=true
      this.visibleAfterPage=true
      this.visibleNextPage=true
      this.visibleLastPage=true
    }
    this.max = ((this.numberPages) * 10) * 2;
    this.min = (this.max) - 20
    let j = 0;
    do
      for (let i = this.min; i < this.max; i++) {
        this.arrProductsPages[j] = products[i]
        j += 1;
      }
    while (j < 20)
  }
  firstPage(products: any) {
    this.arrProductsPages = []
    this.numberPages = 1;
    this.visibleFirstPage=false
    this.visibleAfterPage=false
    this.visibleNextPage=true
    this.visibleLastPage=true
    this.min = 0;
    this.max = 20
    let j = 0;
    for (let i = this.min; i < this.max; i++) {
      this.arrProductsPages[i] = products[i]
    }
  }

  lastPage(products: any) {
    this.arrProductsPages = []
    this.visibleFirstPage=true
    this.visibleAfterPage=true
    this.visibleNextPage=false
    this.visibleLastPage=false
    this.numberPages = Math.ceil(products.length / 20);
    let finalPage = (this.numberPages - 1) * 20;
    this.min = finalPage
    this.max = products.length;
    let j = 0;
    for (let i = 0; i < (products.length - finalPage); i++) {
      this.arrProductsPages[i] = products[this.min]
      this.min++
    }
    console.log(products.length)
  }

  filterProducts() {
    this.numberPages = 1
    if (this.productSearch != '') {
      this.filterArray = this.arrProducts.filter((objeto) => {
        return Object.values(objeto).some((product) => {
          if (typeof product === 'string') {
            this.tituloProductos=true
            return product.toLowerCase().includes(this.productSearch.toLowerCase());
            
          }
          return false;
        });
      });
    }
    else {
      this.filterArray = this.arrProducts.filter((objeto) => {
        return Object.values(objeto).some((product) => {
          if (typeof product === 'string') {    
            return (
              (!this.categorySearch || objeto.categoria === this.categorySearch) &&
              (!this.subCategorySearch || objeto.subcategoria === this.subCategorySearch) &&
              (!this.brandSearch || objeto.marca === this.brandSearch)
            );
          }
          
        });
      });
    }
    this.loadFirstPage(this.filterArray)
    if(this.filterArray.length<=20){
      this.visibleAfterPage=false
      this.visibleFirstPage=false
      this.visibleNextPage=false
      this.visibleLastPage=false
    }
     if(this.filterArray.length==0){
      this.tituloProductos=false
      this.buttonPages=false
      this._mensaje.snackBar("No hay productos que coincidan con los criterios de búsqueda","red")
    }
  }

  cleanFilters() {
    this.filterArray = []
    this.subCategoryFilter=[]
    this.brandFilter=[]
    this.productSearch = ''
    this.categorySearch = ''
    this.subCategorySearch = ''
    this.brandSearch=''
    this.numberPages = 1
    this.buttonPages=true
    this.tituloProductos=true
    this.loadFirstPage(this.arrProducts)

  }

//Inicio Productos destacados
getProductos(){
  this.productosServices.getProducts().subscribe(doc => {
    this.productosHot = []
    doc.forEach((element: any) => {
      
      this.arrProducts.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
      if(element.payload.doc.data().destacado === 'true'){
        this.productosHot.push({
          id: element.payload.doc.id,
          ... element.payload.doc.data()
        })
      }
    })
    if(this.productosHot.length>0)
    {
      this.showProductosDestacados=true
    }
    else{
      this.showProductosDestacados=false
    }
    
    this.loadFirstPage(this.arrProducts)
  })
}

  agregarAlCarrito(addProducto: Producto, idProd: string) {
    if(this.hayLogueado){
      const producto = {addProducto};
      this.dataService.productos$.pipe(first()).subscribe(productos => {
        this.dataService.actualizarProductos([...productos], [producto], idProd);
        this._mensaje.snackBar("Producto agregado al carrito","green")
      });
    }
    else{
      this.dataService.setLoginProgress(true);
    }
    
  }
  //Fin Productos destacados


  // obteber array con las categorias subcategorias y marcas para la busqueda filtrada


  get category(): any[] {
    this.onlyCategory = [...new Set(this.arrProducts.map(producto => producto.categoria))];
    this.onlyCategory.sort();

    const categoriesSaved = sessionStorage.getItem('categoriesSaved');

    if (!categoriesSaved) {
      setTimeout(() => {
        localStorage.setItem('categorias', JSON.stringify(this.onlyCategory));
        sessionStorage.setItem('categoriesSaved', 'true');
      }, 10000);
    }

    return this.onlyCategory
  }

  get subCategory(): any[] {
    this.onlySubCategory = [...new Set(this.arrProducts.map(producto => producto.subcategoria))];
    this.onlySubCategory.sort();
    return this.onlySubCategory
  }

  get brand(): any[] {
    this.onlyBrand = [...new Set(this.arrProducts.map(producto => producto.marca))];
    this.onlyBrand.sort();
    return this.onlyBrand;
  }
  //---------------------------------------------------------------------------------------------

  // Funciones para relacionar los select con los datos a filtrar del array de productos

  updateSubCategories() {
    this.filterArray=[]
    this.subCategorySearch=''
    this.brandSearch=''
    this.productSearch=''
    this.brandFilter=[]
    this.subCategoryFilter = this.arrProducts.filter(
      (subcategoria) => subcategoria.categoria === this.categorySearch
    );
    this.subCategoryFilter = Array.from(new Set(this.subCategoryFilter));
    this.subCategoryFilter = [...new Set(this.subCategoryFilter.map(producto => producto.subcategoria))];
    this.subCategoryFilter.sort();
  }

  updateBrand() {
    this.filterArray=[]
    this.brandSearch=''
    this.productSearch=''
   
    this.brandFilter = this.arrProducts.filter(
      (brand) => brand.subcategoria === this.subCategorySearch
    );
    this.brandFilter = Array.from(new Set(this.brandFilter));
    this.brandFilter = [...new Set(this.brandFilter.map(producto => producto.marca))];
    this.brandFilter.sort();
  }
updateProductSearch(){
  this.filterArray=[]
  this.subCategoryFilter=[]
  this.brandFilter=[]
  this.categorySearch=''
  this.subCategorySearch=''
  this.brandSearch=''
}
modal(producto:any){
  this.selectedProduct=producto
  }

  establoqueada(categoria: string): boolean {
    let existe: boolean = false
    for (let j=0; j< this.bloqueados.length; j++){
      if(this.bloqueados[j] === categoria){
        existe = true
      }
    }
    return existe
  }

  getBloqueados(){
    this.productosServices.getBloqueos().subscribe(doc => {
      this.bloqueados = []
      let catActual: string
      doc.forEach((element: any) => {
        catActual = element.payload.doc.data().categoria
        this.bloqueados.push(catActual)
      })
    })
  }

  getApi(){
    this.productosServices.getApiElite().subscribe(doc => {
      doc.forEach((element: any) => {
        this.validadorApi = element.payload.doc.data().valor
      })
    })
  }
  
  scroll(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);

    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'instant',
      });
    }
  }
  }

  
//---------------------------------------------------------------------------------------------

