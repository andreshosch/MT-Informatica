export class Pedido {
    carrito: any[];
    idUser: number;
    apellido: string;
    nombre:string
    fecha:string
    celular:number
    transporte?:string
    seguimiento?:string
    

    constructor(carrito: any[], idUser: number,apellido:string,nombre:string,fecha:string,celular:number,transporte:string,seguimiento:string) {
        this.carrito = carrito
        this.idUser = idUser
        this.apellido=apellido
        this.nombre=nombre
        this.fecha=fecha
        this.celular=celular
        this.seguimiento=seguimiento
        this.transporte=transporte
    }
}
