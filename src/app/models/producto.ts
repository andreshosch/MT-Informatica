export class Producto{
    imagen: string;
    nombre: string;
    rubro: string;
    subrubro: string;
    descripcion: string;
    precio: number;

    constructor(imagen:string, nombre: string, rubro: string, subrubro: string, descripcion: string, precio: number){
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.nombre = nombre;
        this.rubro = rubro;
        this.subrubro = subrubro;
        this.precio = precio;
    }

}

