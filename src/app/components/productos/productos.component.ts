
import { Component } from '@angular/core';
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
  arrProductsPages: any[] = []
  numberPages :any= 1
  numberPagesTotal: number
  pages: any
  lengthPages: number
  min: number;
  max: number;
  productSearch = '';
  filterArray: any[] = [];
  requestData = {
    "user_id": '22181',
    "token": "oyhl04axaro"
  }



  constructor(private productosServices: ProductosService) {
  }


  ngOnInit() {
    this.arrayProducts()
  }

  loadFirstPage(products:any) {
    this.arrProductsPages = []
    if (products.length>20){
      for (let i = 0; i < 20; i++) {
        this.arrProductsPages[i] = products[i]
      }
    }
    else{
      for (let i = 0; i < products.length; i++) {
        this.arrProductsPages[i] = products[i]
      }
      this.numberPages=1
    }
    
    
  }

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
              this.arrProducts.push(...this.arrProductos)
              this.loadFirstPage(this.arrProducts)
            })
        }
       }
      })
  }

  nextPage(products:any) {
   this.arrProductsPages = []
   let numberPages = Math.ceil(products.length / 20);
    this.numberPages += 1;
    if (this.numberPages < numberPages) {
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
      while (j < numberPages)
    }
    else {
      this.lastPage(products)
    }
    console.log("minimo " +this.min)
    console.log("maximo " +this.max)
  }

  afterPage(products:any) {
    this.arrProductsPages = []
    this.numberPages -= 1;
    this.max = ((this.numberPages) * 10) * 2;
    this.min = (this.max) - 20
    let j = 0;
    do
      for (let i = this.min; i < this.max; i++) {
        this.arrProductsPages[j] = products[i]
        j += 1;
      }
    while (j < 20)
    console.log("minimo " +this.min)
    console.log("maximo " +this.max)
  }
  firstPage(products:any) {
    this.arrProductsPages = []
    this.numberPages = 1;
    this.min = 0;
    this.max = 20
    let j = 0;
    for (let i = this.min; i < this.max; i++) {
      this.arrProductsPages[i] = products[i]
    }
    console.log("minimo " +this.min)
    console.log("maximo " +this.max)
  }

  lastPage(products:any) {
    this.arrProductsPages = []
    this.numberPages = Math.ceil(products.length / 20);
    let finalPage = (this.numberPages - 1) * 20;
    this.min = finalPage
    this.max = products.length;
    console.log("minimo " +this.min)
    console.log("maximo " +this.max)
    let j = 0;
    for (let i = 0; i < (products.length - finalPage); i++) {
      this.arrProductsPages[i] = products[this.min]
      this.min++
    }
    
  }
 
  filterProducts(){
    this.numberPages=1
    this.filterArray = this.arrProducts.filter((objeto) => {
      return Object.values(objeto).some((product) => {
        if (typeof product === 'string') {
          return product.toLowerCase().includes(this.productSearch.toLowerCase());
        }
        return false;
      });
    });
    this.loadFirstPage(this.filterArray)
    console.log(this.filterArray)
  }

cleanFilters(){
  this.filterArray=[]
  this.productSearch=''
  this.numberPages=1
  this.loadFirstPage(this.arrProductos)
}  
}
  

  
