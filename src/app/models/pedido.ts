export class Pedido {
    carrito: any[];
    idUser: number;

    constructor(carrito: any[], idUser: number) {
        this.carrito = carrito
        this.idUser = idUser
    }
}
