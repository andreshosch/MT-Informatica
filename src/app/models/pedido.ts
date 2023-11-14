export class Pedido {
    carrito: any[];
    idUser: number;
    apellido: string;
    nombre:string
    fecha:string
    celular:number

    constructor(carrito: any[], idUser: number,apellido:string,nombre:string,fecha:string,celular:number) {
        this.carrito = carrito
        this.idUser = idUser
        this.apellido=apellido
        this.nombre=nombre
        this.fecha=fecha
        this.celular=celular
    }
}
