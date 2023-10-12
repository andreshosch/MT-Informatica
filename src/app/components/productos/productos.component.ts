
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
  numberPages = 1
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

  loadFirstPage() {
    this.arrProductsPages = []
    for (let i = 0; i < 20; i++) {
      this.arrProductsPages[i] = this.arrProducts[i]
    }
  }

  arrayProducts() {
    this.productosServices.getArrayProducts(this.requestData, 1, 100).subscribe
      (response => {
        this.pages = response['paginador'];
        this.lengthPages = this.pages.total

        for (let i = 1; i <= this.lengthPages; i += 100) {
          this.productosServices.getArrayProducts(this.requestData, 100, i).subscribe
            (response => {
              this.arrProductos = response['resultado']
              this.arrProducts.push(...this.arrProductos)
              this.loadFirstPage()
            })
        }
console.log(this.arrProducts)
console.log(this.filterArray)
      })
  }

  nextPage(products:any) {
   products = []
    this.numberPages += 1;
    if (this.numberPages < 20) {
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
      while (j < 20)
    }
    else {
      this.lastPage(products)
    }

  }

  afterPage(products:any) {
    products = []
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

  }
  firstPage(products:any) {
    products = []
    this.numberPages = 1;
    this.min = 0;
    this.max = 20
    let j = 0;
    for (let i = this.min; i < this.max; i++) {
      this.arrProductsPages[i] = products[i]
    }

  }

  lastPage(products:any) {
    this.arrProductsPages = []
    this.numberPages = Math.ceil(products.length / 20);
    let finalPage = (this.numberPages - 1) * 20;
    this.min = finalPage
    console.log("el mino es " + this.min)
    this.max = products.length;

    let j = 0;
    for (let i = 0; i < (this.arrProducts.length - finalPage); i++) {
      this.arrProductsPages[i] = this.arrProducts[this.min]
      this.min++
    }

  }
 
  filterProducts(){
    this.filterArray = this.arrProducts.filter((objeto) => {
      return Object.values(objeto).some((product) => {
        if (typeof product === 'string') {
          return product.toLowerCase().includes(this.productSearch.toLowerCase());
        }
        return false;
      });
    });
    console.log(this.filterArray)
  }
}
  

  
