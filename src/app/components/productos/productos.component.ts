
import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from 'src/app/services/productos.service';

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
  filterArray: any[] = [];
  requestData = {
    "user_id": '22181',
    "token": "oyhl04axaro"
  }
  bloqueados: any[] = []
  hayLogueado: boolean;
  //Inicio Productos destacados
  productosHot: any[] = []
  elProducto: Producto
  idProducto: string
  // Fin Productos destacados


  constructor(private productosServices: ProductosService, private _config: NgbCarouselConfig, private dataService: DataService) {
    _config.interval = 2000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
  }


  ngOnInit() {
    this.arrayProducts()
    this.getProductos()
    this.dataService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.hayLogueado = isAuthenticated;
    
    });
  }

  loadFirstPage(products: any) {
    this.arrProductsPages = []
    if (products.length > 20) {
      for (let i = 0; i < 20; i++) {
        this.arrProductsPages[i] = products[i]
      }
    }
    else {
      for (let i = 0; i < products.length; i++) {
        this.arrProductsPages[i] = products[i]
      }
    }
      this.numberPages = 1
      this.visibleFirstPage=false
      this.visibleAfterPage=false
      this.visibleNextPage=true
      this.visibleLastPage=true
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
                  imagenes: this.arrProductos[p].imagenes,
                  descripcion: this.arrProductos[p].descripcion,
                  destacado: false,
                  marca: this.arrProductos[p].marca,
                  iva: this.arrProductos[p].iva,
                  impuesto_interno: this.arrProductos[p].impuesto_interno,
                  id: this.arrProductos[p].id,
                  cantidad: 1
                }
                //Prueba bloqueo de categorias
                // if(!this.establoqueada(unProducto.subcategoria)){
                //   this.arrProducts.push(unProducto)
                // }

                //
                this.arrProducts.push(unProducto)
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
    console.log(products.length)
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
    console.log(this.numberPages)
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
    console.log(products.length)
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
  }

  cleanFilters() {
    this.filterArray = []
    this.productSearch = ''
    this.categorySearch = ''
    this.subCategorySearch = ''
    this.brandSearch=''

    this.numberPages = 1
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
    this.loadFirstPage(this.arrProducts)
  })
}

  agregarAlCarrito(addProducto: Producto, idProd: string) {
    if(this.hayLogueado){
      const producto = {addProducto};
      this.dataService.productos$.pipe(first()).subscribe(productos => {
        this.dataService.actualizarProductos([...productos], [producto], idProd);
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
  this.categorySearch=''
  this.subCategorySearch=''
  this.brandSearch=''
}
modal(producto:any){
  this.selectedProduct=producto
  }

  establoqueada(subcategoria: string): boolean {
    let existe: boolean = false
    for (let j=0; j< this.bloqueados.length; j++){
      if(this.bloqueados[j] === subcategoria){
        existe = true
      }
    }
    return existe
  }


 } 





//---------------------------------------------------------------------------------------------








