export class Producto{
    imagen: string;
    nombre: string;
    rubro: string;
    subrubro: string;
    descripcion: string;
    precio: number;
    cantidad?: number;
    destacado: boolean;
    marca: string


    constructor(imagen:string, nombre: string, rubro: string, subrubro: string, descripcion: string, precio: number, cantidad: number, destacado: boolean, marca: string){
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.nombre = nombre;
        this.rubro = rubro;
        this.subrubro = subrubro;
        this.precio = precio;
        this.cantidad = cantidad;
        this.destacado = destacado;
        this.marca = marca;
    }

}

