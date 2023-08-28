export class Usuario{
    dni: number;
    nombre: string;
    apellido: string;
    celular: number;
    domicilio: string;
    mail: string;
    cuit?: number;

    constructor(dni: number, nombre:string, apellido:string, celular:number, domicilio:string, mail:string, cuit:number){
        this.dni = dni
        this.nombre = nombre
        this.apellido = apellido
        this.celular = celular
        this.domicilio = domicilio
        this.mail = mail
        this.cuit = cuit

        
    }

}