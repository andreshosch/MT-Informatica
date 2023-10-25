export class Producto{
    imagenes: string[];
    nombre: string;
    categoria: string;
    subcategoria: string;
    descripcion: string;
    precio: number;
    cantidad?: number;
    destacado?: boolean;
    marca: string;
    iva: number;
    impuesto_interno: number;
    id?: string



    constructor(imagenes:string[], nombre: string, categoria: string, subcategoria: string, descripcion: string, precio: number, cantidad: number, destacado: boolean, marca: string, iva: number, impuesto_interno: number, id?: string){
        this.descripcion = descripcion;
        this.imagenes = imagenes;
        this.nombre = nombre;
        this.categoria = categoria;
        this.subcategoria = subcategoria;
        this.precio = precio;
        this.cantidad = cantidad;
        this.destacado = destacado;
        this.marca = marca;
        this.iva = iva;
        this.impuesto_interno = impuesto_interno;
        this.id= id;
    }

}

